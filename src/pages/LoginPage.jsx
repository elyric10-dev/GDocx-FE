import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginBackground from '../components/LoginBackground'
import DecorativeBackground from '../components/ui/DecorativeBackground'
import FeatureChip from '../components/ui/FeatureChip'
import GlassCard from '../components/ui/GlassCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import StatusBadge from '../components/ui/StatusBadge'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'

const EmailIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const LockIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

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
      <div className="relative min-h-[38vh] lg:min-h-screen">
        <LoginBackground />
      </div>

      <DecorativeBackground
        variant="panel"
        showDocs={false}
        className="flex flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-16"
      >
        <div className="gdocx-enter-fade-up relative z-10 w-full max-w-[420px]">
          <div className="mb-8 lg:mb-10">
            <div className="mb-4">
              <StatusBadge label="Workspace ready" pulse />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gdocx-blue)]">
              Welcome back
            </p>
            <h2 className="gdocx-gradient-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Sign in to GDocx
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--gdocx-text-secondary)]">
              Enter your credentials to access your documents, drafts, and shared files.
            </p>
          </div>

          <GlassCard glow className="p-7 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={EmailIcon}
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={LockIcon}
              />

              <PrimaryButton
                type="submit"
                disabled={submitting || loading}
                showArrow={!submitting && !loading}
              >
                {submitting ? 'Signing in…' : loading ? 'Loading…' : 'Sign in'}
              </PrimaryButton>
            </form>
          </GlassCard>

          <div
            className="mt-8 flex items-center justify-center gap-6 sm:gap-10"
            aria-label="Included features"
          >
            <FeatureChip label="Autosave" color="blue" />
            <span className="h-8 w-px shrink-0 bg-[var(--gdocx-border)]/50" aria-hidden />
            <FeatureChip label="Sharing" color="green" />
            <span className="h-8 w-px shrink-0 bg-[var(--gdocx-border)]/50" aria-hidden />
            <FeatureChip label="Rich text" color="yellow" />
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[var(--gdocx-text-muted)]">
            <svg className="h-3.5 w-3.5 text-[var(--gdocx-green)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure access to your workspace
          </p>
        </div>
      </DecorativeBackground>
    </div>
  )
}
