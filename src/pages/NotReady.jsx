import { useParams, useNavigate } from 'react-router-dom'

const pg = {
  report: { t: 'Report an Issue', c: '#0ea5e9', r: '14,165,233' },
  track:  { t: 'Track My Issue',  c: '#a78bfa', r: '167,139,250' },
  bot:    { t: 'CivicAI Bot',     c: '#34d399', r: '52,211,153' },
  'mayor-simulator': { t: 'Mayor Policy Simulator', c: '#f59e0b', r: '245,158,11' },
}
const fallback = { t: 'Unknown', c: '#64748b', r: '100,116,139' }

export default function NotReady() {
  const { feature } = useParams()
  const nav = useNavigate()
  const p = pg[feature] || fallback

  return (
    <div style={{
      minHeight: '100vh', background: '#030712', color: '#fff',
      fontFamily: "'Inter',system-ui,sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>

        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 28px',
          background: `rgba(${p.r},0.08)`, border: `1.5px solid rgba(${p.r},0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 32px rgba(${p.r},0.12)`,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={p.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" /><path d="M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, color: p.c }}>{p.t}</h2>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.65, marginBottom: 32 }}>
          This feature is under development. Check back soon.
        </p>

        <div onClick={() => nav('/')} className="btn-ghost"
          style={{ display: 'inline-flex', cursor: 'pointer', padding: '11px 28px', fontSize: 13, fontWeight: 600, borderColor: `rgba(${p.r},0.25)`, color: p.c }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
          Go back
        </div>
      </div>
    </div>
  )
}
