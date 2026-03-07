import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Ico({ paths, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {(Array.isArray(paths) ? paths : [paths]).map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

const IC = {
  pin:     ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  arrow:   ['M5 12h14', 'M12 5l7 7-7 7'],
  report:  ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M12 18v-6', 'M9 15h6'],
  track:   ['M22 12h-4l-3 9L9 3l-3 9H2'],
  bot:     ['M12 8V4H8', 'M2 14h2', 'M20 14h2', 'M15 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2', 'M9 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2', 'M6 10h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z'],
  sun:     ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 1v2', 'M12 21v2', 'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42', 'M1 12h2', 'M21 12h2', 'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42'],
  moon:    ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'],
  mapPin:  ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  alert:   ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
}

const FEATURES = [
  {
    title: 'Report an Issue',
    desc: 'Snap a photo, describe the problem, and GPS auto-tags your location. Validated & routed instantly.',
    color: '#0ea5e9',
    rgb: '14,165,233',
    route: 'report',
  },
  {
    title: 'Track My Issue',
    desc: 'Follow your report in real-time — from submission to assignment to resolution. Full transparency.',
    color: '#a78bfa',
    rgb: '167,139,250',
    route: 'track',
  },
  {
    title: 'CivicAI Bot',
    desc: 'Chat to check status, get guidance, or report issues through simple conversation.',
    color: '#34d399',
    rgb: '52,211,153',
    route: 'bot',
  },
  {
    title: 'Mayor Policy Simulator',
    desc: 'Test how city policies could impact traffic, pollution, and citizen satisfaction using simulated civic data.',
    color: '#f59e0b',
    rgb: '245,158,11',
    route: 'mayor-simulator',
  },
  {
    title: 'Nearby Issues',
    desc: 'View civic issues reported in your vicinity — potholes, broken lights, garbage, water leaks and more.',
    color: '#ef4444',
    rgb: '239,68,68',
    route: 'nearby',
  },
]

const wrap = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' }

function FogReveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
      filter: visible ? 'blur(0px)' : 'blur(12px)',
      transition: `opacity 0.8s ${delay}s ease, transform 0.8s ${delay}s ease, filter 0.8s ${delay}s ease`,
    }}>
      {children}
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const navigate = useNavigate()

  const theme = {
    bg: darkMode ? '#030712' : '#f8fafc',
    text: darkMode ? '#fff' : '#0f172a',
    textMuted: darkMode ? '#94a3b8' : '#64748b',
    card: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.04)',
    border: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.1)',
    navBg: darkMode ? 'rgba(3,7,18,0.88)' : 'rgba(248,250,252,0.88)',
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div style={{ background: theme.bg, color: theme.text, fontFamily: "'Inter',system-ui,sans-serif", overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60,
        display: 'flex', alignItems: 'center',
        background: scrolled ? theme.navBg : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.border}` : '1px solid transparent',
        transition: 'all .35s',
      }}>
        <div style={{ ...wrap, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(14,165,233,0.35)',
            }}>
              <Ico paths={IC.pin} size={15} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
              Civic<span style={{ color: '#38bdf8' }}>AI</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: darkMode ? '#fbbf24' : '#1e293b' }}>
              <Ico paths={darkMode ? IC.sun : IC.moon} size={18} />
            </button>
            <button onClick={() => navigate('/signin')} style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: theme.text, transition: 'all 0.2s' }}>Sign In</button>
            <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', border: 'none', borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff' }}>Sign Up</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live</span>
            </div>
          </div>
        </div>
      </nav>

      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        <div className="orb" style={{ width: 700, height: 700, top: -250, left: -200, background: '#0ea5e9', opacity: 0.3 }} />
        <div className="orb" style={{ width: 500, height: 500, top: 60, right: -150, background: '#7c3aed', opacity: 0.2 }} />

        <div className="sf-wrap" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <iframe
            title="Nature Composition"
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/b491f1e70152461cba34fc7a2d7c6e4c/embed?autospin=1&autostart=1&ui_hint=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
          />
        </div>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 4,
          background: 'linear-gradient(to bottom, #030712 0%, #030712 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, zIndex: 1,
          background: 'linear-gradient(to bottom, transparent, #030712)',
        }} />

        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#475569', fontSize: 10 }}>
          <span>Scroll down</span>
          <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom,#475569,transparent)' }} />
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, zIndex: 1,
          background: 'linear-gradient(to bottom, transparent 0%, #030712 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, zIndex: 3,
          background: '#030712',
        }} />
      </section>

      <section style={{ padding: '80px 0 100px', position: 'relative' }}>
        <div className="orb" style={{ width: 500, height: 500, top: 0, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', opacity: 0.08 }} />
        <div style={{ ...wrap, position: 'relative' }}>

          {FEATURES.map((feat, i) => {
            const isRight = i % 2 === 1
            const isLast = i === FEATURES.length - 1
            const isHov = hovered === i

            return (
              <FogReveal key={feat.title} delay={i * 0.15}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isRight ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 48,
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                      position: 'relative',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .4s ease',
                    }}
                  >
                    <div style={{
                      position: 'absolute', inset: -8, borderRadius: '50%',
                      background: `radial-gradient(circle, rgba(${feat.rgb},${isHov ? 0.5 : 0.15}) 0%, transparent 70%)`,
                      filter: `blur(${isHov ? 14 : 8}px)`,
                      transition: 'all .4s ease',
                    }} />
                    <div style={{
                      position: 'absolute', inset: -20, borderRadius: '50%',
                      background: `radial-gradient(circle, rgba(${feat.rgb},${isHov ? 0.25 : 0.05}) 0%, transparent 70%)`,
                      filter: `blur(${isHov ? 24 : 12}px)`,
                      transition: 'all .4s ease',
                    }} />
                    <div style={{
                      width: isHov ? 20 : 14, height: isHov ? 20 : 14, borderRadius: '50%',
                      background: feat.color,
                      boxShadow: `0 0 ${isHov ? 28 : 12}px rgba(${feat.rgb},${isHov ? 0.8 : 0.4})`,
                      transition: 'all .4s ease',
                      position: 'relative', zIndex: 1,
                    }} />
                  </div>

                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate(`/${feat.route}`)}
                    style={{
                      flex: 1, maxWidth: 480,
                      padding: '32px 36px',
                      borderRadius: 22,
                      background: isHov ? `rgba(${feat.rgb},0.06)` : theme.card,
                      border: `1px solid ${isHov ? `rgba(${feat.rgb},0.3)` : theme.border}`,
                      boxShadow: isHov ? `0 0 60px rgba(${feat.rgb},0.1), inset 0 0 30px rgba(${feat.rgb},0.03)` : 'none',
                      transition: 'all .4s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{feat.title}</h3>
                    <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>{feat.desc}</p>
                  </div>
                </div>

                {!isLast && (
                  <div style={{
                    position: 'relative',
                    height: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    <div style={{
                      width: 2, height: '100%',
                      background: `linear-gradient(to bottom, rgba(${feat.rgb},0.4), rgba(${FEATURES[i + 1].rgb},0.4))`,
                      borderRadius: 2,
                      boxShadow: `0 0 16px rgba(${feat.rgb},0.2), 0 0 16px rgba(${FEATURES[i + 1].rgb},0.2)`,
                    }} />
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                      width: 8, height: 8, borderRadius: '50%',
                      background: `rgba(${FEATURES[i + 1].rgb},0.6)`,
                      boxShadow: `0 0 14px rgba(${FEATURES[i + 1].rgb},0.5)`,
                    }} />
                  </div>
                )}
              </div>
              </FogReveal>
            )
          })}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: '28px 24px' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ico paths={IC.pin} size={12} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Civic<span style={{ color: '#38bdf8' }}>AI</span></span>
          </div>
        </div>
      </footer>

    </div>
  )
}
