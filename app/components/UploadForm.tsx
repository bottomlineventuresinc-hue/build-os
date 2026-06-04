'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !userId) {
      setMessage('Please select a file, enter a title, and ensure you are logged in')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadRes.json()
      if (!uploadData.success) throw new Error(uploadData.error)

      const designRes = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          image_url: uploadData.fileUrl,
          file_url: uploadData.fileUrl,
          user_id: userId
        })
      })

      const designData = await designRes.json()
      if (designData.success) {
        setMessage('Design uploaded! Redirecting...')
        setTimeout(() => {
          window.location.href = `/designs/${designData.designId}`
        }, 1500)
      } else {
        setMessage(`Error: ${designData.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload Your Design</h1>

      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: '2px dashed #667eea',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '20px',
            background: '#f8f9fa'
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
              Drag your design here or click to upload
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Supports PNG, JPG, PDF (max 50MB)
            </p>
          </label>
        </div>

        {preview && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Preview:</p>
            <img
              src={preview}
              alt="preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Design title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          required
        />

        <textarea
          placeholder="Design description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box',
            minHeight: '100px'
          }}
        />

        <button
          type="submit"
          disabled={!file || loading || !userId}
          style={{
            width: '100%',
            padding: '14px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'wait' : 'pointer',
            opacity: !file || loading || !userId ? 0.6 : 1
          }}
        >
          {loading ? 'Uploading...' : 'Upload Design'}
        </button>

        {message && (
          <p style={{
            marginTop: '15px',
            color: message.includes('Error') ? 'red' : 'green'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
