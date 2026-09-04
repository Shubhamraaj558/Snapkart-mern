import React, { useContext, useState, useRef, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaUserCircle } from 'react-icons/fa'
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 transform scale-90 origin-center">

      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-0" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating Logo */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="w-20 h-20 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-sm animate-float-slow">
          <FaUserCircle className="text-2xl text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-sm z-40 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-500 animate-glass-float">

        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 -skew-x-12 animate-shimmer-slow pointer-events-none" />
          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
              Welcome Back
            </h1>
            <p className="text-indigo-100 font-medium text-sm opacity-90">
              Sign in to your Snapkart account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4285f4]/90 via-[#34a853]/90 to-[#fbbc05]/90 p-px shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4285f4] via-[#34a853] to-[#fbbc05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10 animate-gradient-xyz" />

              <div className="relative flex h-full w-full items-center justify-center gap-3 bg-white/95 backdrop-blur-xl rounded-xl px-6 font-semibold text-base shadow-inner transition-all duration-300 group-hover:bg-white">
                <div className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#fbbc05] shadow-lg transition-all duration-500 group-hover:scale-110">
                  <FaGoogle className="text-white relative z-10" />
                  <div className="absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping-slow bg-white/20" />
                </div>

                <span className="font-bold tracking-wide text-gray-800">
                  Continue with Google
                </span>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1877f2]/90 via-[#42a5f5]/90 to-[#1977f3]/90 p-px shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1877f2] via-[#42a5f5] to-[#1977f3] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10 animate-gradient-xyz" />

              <div className="relative flex h-full w-full items-center justify-center gap-3 bg-white/95 backdrop-blur-xl rounded-xl px-6 font-semibold text-base shadow-inner transition-all duration-300 group-hover:bg-white">
                <div className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#1877f2] to-[#42a5f5] shadow-lg transition-all duration-500 group-hover:scale-110">
                  <FaFacebookF className="text-white relative z-10" />
                  <div className="absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping-slow bg-white/20" />
                </div>

                <span className="font-bold tracking-wide text-gray-800">
                  Continue with Facebook
                </span>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </button>
          </div>

          <div className="flex items-center my-6 py-2">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <span className="px-4 text-xs text-white/80 font-bold uppercase tracking-widest">or</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white/95 tracking-wide uppercase">
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
              className="w-full h-12 px-4 py-2.5 bg-white/30 backdrop-blur-xl border-2 border-white/40 hover:border-white/60 focus:border-white rounded-xl text-white/95 placeholder-white/70 font-semibold text-base focus:outline-none focus:ring-4 focus:ring-indigo-400/60 focus:border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 appearance-none"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white/95 tracking-wide uppercase">
              Password
            </label>
            <div className="relative z-30">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleOnChange}
                className="w-full h-12 px-4 py-2.5 pr-14 bg-white/30 backdrop-blur-xl border-2 border-white/40 hover:border-white/60 focus:border-white rounded-xl text-white/95 placeholder-white/70 font-semibold text-base focus:outline-none focus:ring-4 focus:ring-indigo-400/60 focus:border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 appearance-none"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-lg border border-white/30 hover:border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg text-white/90 hover:text-white" />
                ) : (
                  <FaEye className="text-lg text-white/90 hover:text-white" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/30 border-2 border-red-500/60 backdrop-blur-sm rounded-xl text-red-100 text-xs font-bold shadow-lg animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <Link
            to="/forgot-password"
            className="block text-right text-xs text-indigo-200 hover:text-white font-semibold transition-all duration-300 hover:underline underline-offset-1"
          >
            Forgot Password?
          </Link>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !data.email || !data.password}
            className="w-full h-12 group relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5 font-bold">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>

          {/* Guest Button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full h-12 bg-white/40 backdrop-blur-2xl border-2 border-white/50 hover:border-white/70 hover:bg-white/60 text-white/95 font-bold py-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            👤 Continue as Guest
          </button>

          <p className="text-center text-xs text-white/85 pt-1">
            New to Snapkart?{' '}
            <Link
              to="/sign-up"
              className="text-indigo-200 hover:text-white font-bold transition-all duration-300 hover:underline underline-offset-1"
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