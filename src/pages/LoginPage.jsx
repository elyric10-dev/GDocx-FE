import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginBackground from '../components/LoginBackground'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setError('')
  }, [])

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Unable to sign in. Please try again.'
      setError(typeof message === 'string' ? message : 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <LoginBackground />

      <div className="login-panel relative flex flex-col items-center justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
        {/* Panel background */}
        <div className="login-panel-bg absolute inset-0" />
        <div className="login-panel-orb login-panel-orb-1 absolute -right-16 top-20 h-64 w-64 rounded-full bg-[#4285f4]/15 blur-3xl" />
        <div className="login-panel-orb login-panel-orb-2 absolute -left-12 bottom-24 h-56 w-56 rounded-full bg-[#34a853]/12 blur-3xl" />
        <div className="login-panel-orb login-panel-orb-3 absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-[#fbbc04]/10 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #dadce0 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />

        <div className="login-form-enter relative z-10 w-full max-w-[420px]">
          <div className="mb-8 lg:mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4285f4]/20 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34a853] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34a853]" />
              </span>
              <span className="text-xs font-medium text-[#5f6368]">Workspace ready</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4285f4]">
              Welcome back
            </p>
            <h2 className="mt-2 bg-gradient-to-br from-[#202124] via-[#3c4043] to-[#1a73e8] bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
              Sign in to GDocx
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5f6368]">
              Enter your credentials to access your documents, drafts, and shared files.
            </p>
          </div>

          <div className="login-form-card relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-7 shadow-xl shadow-[#4285f4]/8 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#4285f4]/20 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-gradient-to-tr from-[#34a853]/15 to-transparent blur-2xl" />

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#202124]">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80868b]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#dadce0]/80 bg-white/80 py-3 pl-10 pr-4 text-sm text-[#202124] outline-none transition placeholder:text-[#80868b] focus:border-[#4285f4] focus:bg-white focus:ring-2 focus:ring-[#4285f4]/25"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-[#202124]"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80868b]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#dadce0]/80 bg-white/80 py-3 pl-10 pr-4 text-sm text-[#202124] outline-none transition placeholder:text-[#80868b] focus:border-[#4285f4] focus:bg-white focus:ring-2 focus:ring-[#4285f4]/25"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#4285f4] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1a73e8]/30 transition hover:from-[#1557b0] hover:to-[#3367d6] hover:shadow-xl hover:shadow-[#1a73e8]/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? 'Signing in…' : loading ? 'Loading…' : 'Sign in'}
                  {!submitting && !loading && (
                    <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition group-hover:translate-x-full duration-700" />
              </button>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Autosave', color: '#4285f4' },
              { label: 'Sharing', color: '#34a853' },
              { label: 'Rich text', color: '#fbbc04' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/60 bg-white/50 px-3 py-2.5 text-center shadow-sm backdrop-blur-sm"
              >
                <div
                  className="mx-auto mb-1.5 h-1 w-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium text-[#5f6368]">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#80868b]">
            <svg className="h-3.5 w-3.5 text-[#34a853]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure access to your workspace
          </p>
        </div>
      </div>
    </div>
  )
}
