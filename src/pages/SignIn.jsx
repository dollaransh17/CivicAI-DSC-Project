import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || data.message || 'Invalid email or password')
        return
      }

      localStorage.setItem('civicai_token', data.token || data.access_token)
      localStorage.setItem('civicai_user', JSON.stringify(data.user || { email }))
      navigate('/')
    } catch {
      setError('Could not connect to server. Is the backend running?')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 500, height: 500, top: -200, right: -150, background: '#0ea5e9', opacity: 0.15, borderRadius: '50%', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, bottom: -150, left: -100, background: '#7c3aed', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }} />
      
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(14,165,233,0.4)' }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
              </svg>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
              Civic<span style={{ color: '#38bdf8' }}>AI</span>
            </h1>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to continue making your city better</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', color: '#10b981', fontSize: 14 }}>
              {success}
            </div>
          )}
          
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14 }}>
              {error}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(14,165,233,0.5)'; e.target.style.background = 'rgba(14,165,233,0.05)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(14,165,233,0.5)'; e.target.style.background = 'rgba(14,165,233,0.05)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 500 }}>Sign up</span>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <span onClick={() => navigate('/')} style={{ color: '#475569', fontSize: 13, cursor: 'pointer' }}>← Back to home</span>
        </p>
      </div>
    </div>
  )
}
