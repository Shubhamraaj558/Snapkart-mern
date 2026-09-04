import React, { useState } from 'react'
import loginIcons from '../assest/user.gif'
import {
  FaEye,
  FaEyeSlash,
  FaCloudUploadAlt,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  })

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const imagePic = await imageTobase64(file)
      setData((prev) => ({
        ...prev,
        profilePic: imagePic
      }))
    }
  }

  const getPasswordChecks = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }

  const getPasswordStrength = (password) => {
    const checks = getPasswordChecks(password)
    const passedChecks = Object.values(checks).filter(Boolean).length

    if (!password) {
      return {
        score: 0,
        label: "",
        color: "bg-gray-200",
        width: "0%",
        checks
      }
    }

    if (passedChecks <= 2) {
      return {
        score: 1,
        label: "Weak",
        color: "bg-red-500",
        width: "25%",
        checks
      }
    }

    if (passedChecks === 3 || passedChecks === 4) {
      return {
        score: 2,
        label: "Medium",
        color: "bg-yellow-500",
        width: "60%",
        checks
      }
    }

    return {
      score: 3,
      label: "Strong",
      color: "bg-green-500",
      width: "100%",
      checks
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.password !== data.confirmPassword) {
      toast.error("Password & Confirm Password do not match")
      return
    }

    const checks = getPasswordChecks(data.password)
    if (!Object.values(checks).every(Boolean)) {
      toast.error("Please create a stronger password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        toast.success(result.message)
        navigate("/login")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(data.password)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 bg-blue-300/15 rounded-full blur-3xl animate-ping" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-[32px] border border-white/30 bg-white/60 shadow-2xl backdrop-blur-xl">
          
          <div className="flex flex-col lg:flex-row">
            
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl backdrop-blur-sm">
                  <FaUserPlus className="text-3xl" />
                </div>

                <h1 className="text-4xl font-black mb-4">
                  Welcome to SnapKart!
                </h1>

                <p className="text-lg mb-8 font-light leading-relaxed max-w-md">
                  Create your account and start your shopping journey.
                  Enjoy personalized deals, wishlist, faster checkout and more.
                </p>

                <img
                  src={loginIcons}
                  alt="Sign up illustration"
                  className="w-40 h-40 object-cover rounded-3xl shadow-2xl mb-6 bg-white"
                />

                <p className="text-sm opacity-90 max-w-sm">
                  Your privacy and account security are always our top priorities.
                </p>
              </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
              
              {/* Profile Upload */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <img
                    src={data.profilePic || loginIcons}
                    alt="Profile preview"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-3xl border-4 border-white/60 shadow-2xl bg-white"
                  />

                  <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-2xl shadow-xl cursor-pointer border-4 border-white/60 transition-all duration-300 hover:scale-110">
                    <FaCloudUploadAlt className="text-lg" />
                    <input
                      type="file"
                      onChange={handleUploadPic}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-center mb-2 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-600 bg-clip-text text-transparent">
                Create Account
              </h2>

              <p className="text-center text-gray-600 mb-8 text-base sm:text-lg font-medium">
                Join us today and start shopping!
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={data.name}
                    onChange={handleOnChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 shadow-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 outline-none bg-white/80 text-base transition-all duration-300 hover:border-gray-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={handleOnChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 shadow-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 outline-none bg-white/80 text-base transition-all duration-300 hover:border-gray-300"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={data.password}
                      onChange={handleOnChange}
                      required
                      className="w-full px-5 py-3.5 pr-12 rounded-2xl border-2 border-gray-200 shadow-lg focus:border-pink-400 focus:ring-4 focus:ring-pink-200/50 outline-none bg-white/80 text-base transition-all duration-300 hover:border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Use 8+ characters with uppercase, lowercase, number, and special character.
                  </p>

                  {data.password && (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          Password Strength
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            passwordStrength.score === 1
                              ? "text-red-500"
                              : passwordStrength.score === 2
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className={`flex items-center gap-2 ${passwordStrength.checks.minLength ? "text-green-600" : "text-gray-500"}`}>
                          {passwordStrength.checks.minLength ? <FaCheckCircle /> : <FaExclamationCircle />}
                          At least 8 characters
                        </div>

                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasUpper ? "text-green-600" : "text-gray-500"}`}>
                          {passwordStrength.checks.hasUpper ? <FaCheckCircle /> : <FaExclamationCircle />}
                          One uppercase letter
                        </div>

                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasLower ? "text-green-600" : "text-gray-500"}`}>
                          {passwordStrength.checks.hasLower ? <FaCheckCircle /> : <FaExclamationCircle />}
                          One lowercase letter
                        </div>

                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                          {passwordStrength.checks.hasNumber ? <FaCheckCircle /> : <FaExclamationCircle />}
                          One number
                        </div>

                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasSpecial ? "text-green-600" : "text-gray-500"}`}>
                          {passwordStrength.checks.hasSpecial ? <FaCheckCircle /> : <FaExclamationCircle />}
                          One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={data.confirmPassword}
                      onChange={handleOnChange}
                      required
                      className="w-full px-5 py-3.5 pr-12 rounded-2xl border-2 border-gray-200 shadow-lg focus:border-pink-400 focus:ring-4 focus:ring-pink-200/50 outline-none bg-white/80 text-base transition-all duration-300 hover:border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {data.confirmPassword && (
                    <div className="mt-2 text-sm">
                      {data.password === data.confirmPassword ? (
                        <p className="text-green-600 font-medium flex items-center gap-2">
                          <FaCheckCircle />
                          Passwords match
                        </p>
                      ) : (
                        <p className="text-red-500 font-medium flex items-center gap-2">
                          <FaExclamationCircle />
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !data.name ||
                    !data.email ||
                    !data.password ||
                    !data.confirmPassword
                  }
                  className="group w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white font-black py-3.5 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 text-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-xl" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="text-xl group-hover:translate-x-1 transition-transform" />
                        Sign Up Now
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300 underline decoration-2"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp