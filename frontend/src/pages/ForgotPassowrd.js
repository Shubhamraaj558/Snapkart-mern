import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaPaperPlane, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.')
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch (err) {
      setError('Failed to send reset link. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4 py-10 overflow-hidden relative">
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-purple-200/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back button */}
        <div className="mb-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5"
          >
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-white/20 bg-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-8 sm:px-8 text-center bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/20 shadow-lg">
              <FaEnvelope className="text-2xl text-white" />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black text-white tracking-tight">
              Forgot Password?
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/80 leading-6 max-w-sm mx-auto">
              No worries. Enter your email address and we’ll send you a password reset link.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-7 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/85">
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/25 bg-white/20 py-3.5 pl-11 pr-4 text-white placeholder:text-white/55 outline-none backdrop-blur-xl transition-all duration-300 focus:border-pink-300 focus:bg-white/25 focus:ring-4 focus:ring-pink-300/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="group w-full rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-5 py-3.5 font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      Send Reset Link
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Success message */}
            {message && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-300/30 bg-green-400/15 px-4 py-3 text-green-50 backdrop-blur-md">
                <FaCheckCircle className="mt-1 text-green-300 shrink-0" />
                <p className="text-sm leading-6">{message}</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-300/30 bg-red-400/15 px-4 py-3 text-red-50 backdrop-blur-md">
                <FaExclamationCircle className="mt-1 text-red-300 shrink-0" />
                <p className="text-sm leading-6">{error}</p>
              </div>
            )}

            {/* Footer link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/75">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-pink-200 hover:text-white transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword