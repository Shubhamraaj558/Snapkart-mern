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
    <div className="min-h-screen flex items-center justify-center px-3 py-4 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden text-xs sm:text-sm">
      
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
          
          <div className="flex flex-col lg:flex-row">
            
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden flex-col justify-center items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10" />
              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 shadow-md backdrop-blur-sm">
                  <FaUserPlus className="text-2xl" />
                </div>

                <h1 className="text-2xl font-black mb-2">
                  Welcome to SnapKart!
                </h1>

                <p className="text-xs mb-6 font-light leading-relaxed max-w-xs opacity-90">
                  Create your account and start your shopping journey. Enjoy personalized deals and faster checkout.
                </p>

                <img
                  src={loginIcons}
                  alt="Sign up illustration"
                  className="w-28 h-28 object-cover rounded-2xl shadow-md mb-4 bg-white"
                />

                <p className="text-[11px] opacity-80 max-w-xs">
                  Your privacy and account security are our top priorities.
                </p>
              </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-7/12 p-5 sm:p-6 lg:p-8">
              
              {/* Profile Upload */}
              <div className="flex justify-center mb-5">
                <div className="relative group">
                  <img
                    src={data.profilePic || loginIcons}
                    alt="Profile preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-2 border-white/80 shadow-md bg-white"
                  />

                  <label className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-xl shadow-md cursor-pointer border-2 border-white/80 transition-all hover:scale-105">
                    <FaCloudUploadAlt className="text-sm" />
                    <input
                      type="file"
                      onChange={handleUploadPic}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-center mb-1 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-600 bg-clip-text text-transparent">
                Create Account
              </h2>

              <p className="text-center text-gray-500 mb-5 text-xs sm:text-sm font-medium">
                Join us today and start shopping!
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={data.name}
                    onChange={handleOnChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none bg-white/90 text-xs sm:text-sm transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={handleOnChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none bg-white/90 text-xs sm:text-sm transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
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
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none bg-white/90 text-xs sm:text-sm transition-all"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>

                  <p className="mt-1 text-[10px] text-gray-500">
                    Use 8+ chars with uppercase, lowercase, number & special character.
                  </p>

                  {data.password && (
                    <div className="mt-2 space-y-2 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-700">
                          Password Strength
                        </span>
                        <span
                          className={`text-[11px] font-bold ${
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

                      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                        <div className={`flex items-center gap-1.5 ${passwordStrength.checks.minLength ? "text-green-600" : "text-gray-400"}`}>
                          {passwordStrength.checks.minLength ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                          At least 8 characters
                        </div>

                        <div className={`flex items-center gap-1.5 ${passwordStrength.checks.hasUpper ? "text-green-600" : "text-gray-400"}`}>
                          {passwordStrength.checks.hasUpper ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                          One uppercase letter
                        </div>

                        <div className={`flex items-center gap-1.5 ${passwordStrength.checks.hasLower ? "text-green-600" : "text-gray-400"}`}>
                          {passwordStrength.checks.hasLower ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                          One lowercase letter
                        </div>

                        <div className={`flex items-center gap-1.5 ${passwordStrength.checks.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                          {passwordStrength.checks.hasNumber ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                          One number
                        </div>

                        <div className={`flex items-center gap-1.5 ${passwordStrength.checks.hasSpecial ? "text-green-600" : "text-gray-400"}`}>
                          {passwordStrength.checks.hasSpecial ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                          One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
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
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none bg-white/90 text-xs sm:text-sm transition-all"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>

                  {data.confirmPassword && (
                    <div className="mt-1 text-[11px]">
                      {data.password === data.confirmPassword ? (
                        <p className="text-green-600 font-medium flex items-center gap-1">
                          <FaCheckCircle size={10} /> Passwords match
                        </p>
                      ) : (
                        <p className="text-red-500 font-medium flex items-center gap-1">
                          <FaExclamationCircle size={10} /> Passwords do not match
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
                  className="group w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:opacity-95 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 text-sm mt-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-base" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="text-base group-hover:translate-x-0.5 transition-transform" />
                        Sign Up Now
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-5 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-purple-600 hover:text-purple-700 transition-colors underline"
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