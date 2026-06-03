'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@supabase/supabase-js'

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>
  if (!design) return <div style={{ padding: '40px' }}>Design not found</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <a href="/" style={{ color: '#667eea' }}>Back to Home</a>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>{design.title}</h1>
        
        <img 
          src={design.image_url} 
          alt={design.title}
          style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '20px' }}
        />

        <p>Created: {new Date(design.created_at).toLocaleDateString()}</p>

        {design.description && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Description</h3>
            <p>{design.description}</p>
          </div>
        )}

        <button 
          onClick={() => window.location.href = design.file_url}
          style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Download Design
        </button>

        <div style={{ marginTop: '40px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
          <h2>Feedback</h2>
          <p>Coming in Task 2.3-2.4</p>
        </div>
      </div>
    </div>
  )
}
