'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@supabase/supabase-js'
import FeedbackCanvas from '@/app/components/FeedbackCanvas'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Design {
  id: string
  title: string
  description: string
  image_url: string
  file_url: string
  user_id: string
  created_at: string
}

export default function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [design, setDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const { data, error } = await supabase
          .from('designs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setDesign(data)
      } catch (err) {
        setError('Error loading design')
      } finally {
        setLoading(false)
      }
    }

    fetchDesign()
  }, [id])

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>
  if (!design) return <div style={{ padding: '40px' }}>Design not found</div>

  const buttonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <a href="/">Back to Home</a>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>{design.title}</h1>
        
        {design.description && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Description</h3>
            <p>{design.description}</p>
          </div>
        )}

        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          Created: {new Date(design.created_at).toLocaleDateString()}
        </p>

        <FeedbackCanvas 
          designId={id}
          imageUrl={design.image_url}
          userId={userId}
        />

        <div style={{ marginTop: '20px' }}>
          <a href={design.file_url} download style={buttonStyle}>
            Download Design
          </a>
        </div>
      </div>
    </div>
  )
}
