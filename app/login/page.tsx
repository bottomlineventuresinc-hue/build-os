'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('Check your email for magic link!')
      }
    } catch (err) {
      setMessage('Error: Something went wrong')
    }
    
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Sign In to BUILD OS</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
      {message && (
        <p style={{
          marginTop: '15px',
          color: message.includes('Error') ? 'red' : 'green'
        }}>
          {message}
        </p>
      )}
    </div>
  )
}
