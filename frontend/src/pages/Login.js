import React, { useContext, useState, useRef, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import Context from '../context'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (result.success) {
        toast.success(result.message)
        navigate('/')
        fetchUserDetails()
        fetchUserAddToCart()
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    toast.info("Welcome Guest! Happy Shopping 🛍️")
    navigate("/")
  }

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon! 🚀`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-xs sm:text-sm">

      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-sm z-30 bg-white/15 backdrop-blur-2xl shadow-2xl rounded-2xl border border-white/30 overflow-hidden">

        {/* Header */}
        <div className="p-4 pb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden text-center">
          <h1 className="text-xl font-black tracking-tight mb-0.5 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-indigo-100 font-medium text-[11px] sm:text-xs opacity-90">
            Sign in to your Snapkart account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 relative z-10">

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="relative h-10 overflow-hidden rounded-xl bg-white/95 backdrop-blur-xl border border-white/40 shadow hover:bg-white transition-all flex items-center justify-center gap-2 px-4 font-semibold text-xs text-gray-800"
            >
              <div className="grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc05]">
                <FaGoogle className="text-white text-[10px]" />
              </div>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              className="relative h-10 overflow-hidden rounded-xl bg-white/95 backdrop-blur-xl border border-white/40 shadow hover:bg-white transition-all flex items-center justify-center gap-2 px-4 font-semibold text-xs text-gray-800"
            >
              <div className="grid h-5 w-5 place-items-center rounded bg-gradient-to-r from-[#1877f2] to-[#42a5f5]">
                <FaFacebookF className="text-white text-[10px]" />
              </div>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="flex items-center my-3 py-1">
            <div className="flex-grow h-px bg-white/40" />
            <span className="px-3 text-[10px] text-white/80 font-bold uppercase tracking-widest">or</span>
            <div className="flex-grow h-px bg-white/40" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-xs font-bold text-white/95 uppercase tracking-wide">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={handleOnChange}
              className="w-full h-10 px-3 py-2 bg-white/25 backdrop-blur-xl border border-white/40 focus:border-white rounded-xl text-white/95 placeholder-white/70 font-medium text-xs sm:text-sm focus:outline-none shadow-inner"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-xs font-bold text-white/95 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleOnChange}
                className="w-full h-10 px-3 py-2 pr-10 bg-white/25 backdrop-blur-xl border border-white/40 focus:border-white rounded-xl text-white/95 placeholder-white/70 font-medium text-xs sm:text-sm focus:outline-none shadow-inner"
                required
              />

              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1.5 rounded-lg border border-white/30 text-white transition-all cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-500/30 border border-red-500/60 backdrop-blur-sm rounded-xl text-red-100 text-[11px] font-bold">
              ⚠️ {error}
            </div>
          )}

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-[11px] text-indigo-200 hover:text-white font-semibold transition-all underline-offset-1 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !data.email || !data.password}
            className="w-full h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Guest Button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full h-10 bg-white/30 backdrop-blur-2xl border border-white/40 hover:bg-white/50 text-white/95 font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
          >
            👤 Continue as Guest
          </button>

          <p className="text-center text-[11px] text-white/85 pt-1">
            New to Snapkart?{' '}
            <Link
              to="/sign-up"
              className="text-indigo-200 hover:text-white font-bold transition-all hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login