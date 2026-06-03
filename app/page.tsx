'use client'

import { useEffect, useState } from 'react'
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
  created_at: string
}

export default function Home() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        const { data: designData } = await supabase
          .from('designs')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })

        setDesigns(designData || [])
      }
      setLoading(false)
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const headerStyle = { background: '#fff', borderBottom: '1px solid #ddd', padding: '20px' }
  const containerStyle = { maxWidth: '1200px', margin: '0 auto' }
  const mainStyle = { minHeight: '100vh', background: '#f8f9fa' }

  return (
    <div style={mainStyle}>
      <div style={headerStyle}>
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>BUILD OS</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user && <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>}
            {user ? (
              <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
              </button>
            ) : (
              <a href="/login" style={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none' }}>Login</a>
            )}
          </div>
        </div>
      </div>

      <div style={{ ...containerStyle, padding: '40px 20px' }}>
        {!user && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Welcome to BUILD OS</h2>
            <p style={{ color: '#666' }}>Collaborate on design feedback with real-time pinning and threads</p>
            <a href="/login" style={{ display: 'inline-block', padding: '14px 28px', background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              Get Started
            </a>
          </div>
        )}

        {user && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>Your Designs</h2>
              <a href="/upload" style={{ padding: '10px 20px', background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                Upload Design
              </a>
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#999' }}>Loading designs...</p>}

            {!loading && designs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px' }}>
                <p style={{ color: '#999', marginBottom: '20px' }}>No designs yet. Upload your first design!</p>
                <a href="/upload" style={{ display: 'inline-block', padding: '10px 20px', background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                  Upload Design
                </a>
              </div>
            )}

            {!loading && designs.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {designs.map((design) => (
                  <a key={design.id} href={`/designs/${design.id}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <img src={design.image_url} alt={design.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{design.title}</h3>
                      <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px' }}>{new Date(design.created_at).toLocaleDateString()}</p>
                      <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>{design.description || 'No description'}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
