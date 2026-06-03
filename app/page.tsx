'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          BUILD OS
        </h2>
        <Link href="/login" style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          Design Feedback, Instantly
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Upload your designs, get real-time feedback from your team, iterate faster
        </p>
        <Link href="/login" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Get Started Free
        </Link>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>
          Why BUILD OS?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px'
        }}>
          {[
            { title: 'Real-Time Feedback', desc: 'Pin feedback directly on your designs' },
            { title: 'Iterate Faster', desc: 'See feedback instantly, make changes immediately' },
            { title: 'Team Collaboration', desc: 'Reply to feedback, keep discussions in one place' }
          ].map((feature, i) => (
            <div key={i} style={{
              padding: '30px',
              border: '1px solid #eee',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 40px',
        background: '#f8f9fa',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
          Ready to build better?
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          Start sharing feedback with your team today
        </p>
        <Link href="/login" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Sign Up Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        background: '#1a1a1a',
        color: 'white',
        textAlign: 'center',
        borderTop: '1px solid #333'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>© 2026 BUILD OS. Our name is our mission.</p>
        <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
          Made by design teams, for design teams
        </p>
      </footer>
    </div>
  )
}
