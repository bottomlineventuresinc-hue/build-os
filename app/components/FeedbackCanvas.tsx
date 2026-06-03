'use client'

import { useEffect, useState } from 'react'

interface Feedback {
  id: string
  x: number
  y: number
  comment: string
  user_id: string
  created_at: string
}

interface FeedbackCanvasProps {
  designId: string
  imageUrl: string
  userId: string
}

export default function FeedbackCanvas({ designId, imageUrl, userId }: FeedbackCanvasProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [pinnedCoords, setPinnedCoords] = useState<{ x: number; y: number } | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [designId])

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback?design_id=${designId}`)
      const data = await res.json()
      if (data.success) {
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPinnedCoords({ x, y })
  }

  const handleSubmitFeedback = async () => {
    if (!pinnedCoords || !comment.trim()) {
      alert('Please add a comment')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design_id: designId,
          user_id: userId,
          x: pinnedCoords.x,
          y: pinnedCoords.y,
          comment: comment.trim()
        })
      })

      const data = await res.json()
      if (data.success) {
        setComment('')
        setPinnedCoords(null)
        setPlacing(false)
        fetchFeedback()
      }
    } catch (error) {
      alert('Error saving feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setPlacing(!placing)}
          style={{
            padding: '10px 20px',
            background: placing ? '#ff6b6b' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {placing ? 'Cancel Pinning' : 'Add Feedback Pin'}
        </button>
      </div>

      <div
        onClick={handleImageClick}
        style={{
          position: 'relative',
          cursor: placing ? 'crosshair' : 'default',
          marginBottom: '20px'
        }}
      >
        <img
          src={imageUrl}
          alt="Design for feedback"
          style={{
            width: '100%',
            borderRadius: '8px',
            display: 'block'
          }}
        />

        {feedback.map((pin) => (
          <div
            key={pin.id}
            style={{
              position: 'absolute',
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              background: '#667eea',
              borderRadius: '50%',
              border: '2px solid white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            title={pin.comment}
          >
            💬
          </div>
        ))}

        {pinnedCoords && (
          <div
            style={{
              position: 'absolute',
              left: `${pinnedCoords.x}%`,
              top: `${pinnedCoords.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              background: '#ff6b6b',
              borderRadius: '50%',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            ✓
          </div>
        )}
      </div>

      {pinnedCoords && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Add Comment</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              minHeight: '80px',
              marginBottom: '12px'
            }}
          />
          <button
            onClick={handleSubmitFeedback}
            disabled={submitting}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'wait' : 'pointer',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            {submitting ? 'Saving...' : 'Save Feedback'}
          </button>
          <button
            onClick={() => {
              setPinnedCoords(null)
              setComment('')
            }}
            style={{
              padding: '10px 20px',
              background: '#ddd',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Feedback Pins ({feedback.length})</h3>
        {feedback.length === 0 ? (
          <p style={{ color: '#999' }}>No feedback yet. Be the first to add a pin!</p>
        ) : (
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            {feedback.map((pin) => (
              <div
                key={pin.id}
                style={{
                  background: '#fff',
                  padding: '12px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  borderLeft: '4px solid #667eea'
                }}
              >
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#667eea' }}>
                  Position: {Math.round(pin.x)}%, {Math.round(pin.y)}%
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#333' }}>{pin.comment}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                  {new Date(pin.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
