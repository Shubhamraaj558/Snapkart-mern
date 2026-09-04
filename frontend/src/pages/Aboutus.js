import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaUsers,
  FaBoxOpen,
  FaRegSmile,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa'

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-white/60 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-md transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
          >
            <FaArrowLeft className="text-sm" />
            Back to Home
          </Link>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-[28px] border border-white/50 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.18)]">
          
          {/* Top Hero */}
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <div className="relative z-10">
              <img
                src="/img2.png"
                alt="Er. Shubham Kumar"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto mb-5 border-4 border-white/70 shadow-2xl object-cover"
              />
              <p className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white/95 shadow">
                Creator of SnapKart
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
                About SnapKart
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
                Everything you need. Delivered with trust, speed, and a better shopping experience.
              </p>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10 text-gray-800">

            {/* Developer Intro */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Developed by Er. Shubham Kumar
              </h2>
              <p className="text-gray-700 leading-7 mb-4">
                SnapKart is proudly designed and developed by <strong>Er. Shubham Kumar</strong>, a passionate full-stack developer focused on building responsive, user-friendly, and secure digital products for modern users.
              </p>
              <p className="text-gray-700 leading-7">
                His mission is to create e-commerce experiences that feel fast, reliable, and enjoyable while keeping usability and visual quality at the center of every feature.
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6">
                <a
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="https://github.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:text-white"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <FaUsers className="text-indigo-500 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900">12,000+</div>
                <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
              </div>

              <div className="rounded-2xl bg-pink-50 border border-pink-100 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <FaBoxOpen className="text-pink-500 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900">7,500+</div>
                <div className="text-sm text-gray-600 mt-1">Products Delivered</div>
              </div>

              <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <FaRegSmile className="text-yellow-500 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900">99%</div>
                <div className="text-sm text-gray-600 mt-1">Customer Satisfaction</div>
              </div>
            </div>

            {/* Brand story */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Our Story</h2>
                <p className="text-gray-700 leading-7 mb-4">
                  Founded with a vision to make shopping effortless and accessible, <strong>SnapKart</strong> started from a simple belief: online shopping should be smooth, trustworthy, and enjoyable for everyone.
                </p>
                <p className="text-gray-700 leading-7">
                  What began as a small idea has grown into a platform built around innovation, thoughtful product selection, and a strong commitment to customer satisfaction.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">What We Offer</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <p>Wide range of categories from fashion to electronics and home essentials.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <p>Trusted brands, verified sellers, and carefully selected products.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <p>Secure payments, fast delivery, easy returns, and reliable customer support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <div className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
                Fast Delivery
              </div>
              <div className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm">
                Secure Payments
              </div>
              <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 shadow-sm">
                Easy Returns
              </div>
              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
                24/7 Support
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-10 max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 px-6 py-6 shadow-sm text-center">
              <p className="italic text-indigo-900 font-medium leading-7">
                "SnapKart has totally changed how I shop online – fast delivery, great selection, and the support team is fantastic."
              </p>
              <div className="mt-3 text-sm font-semibold text-indigo-700">
                — Priya S., SnapKart Customer
              </div>
            </div>

            {/* Promise + Community */}
            <div className="mt-12 space-y-8">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Our Promise</h2>
                <p className="text-gray-700 leading-7">
                  At the heart of SnapKart is our promise to deliver more than products. We deliver convenience, transparency, trust, and a seamless shopping experience that respects your time and expectations.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Join the Community</h2>
                <p className="text-gray-700 leading-7">
                  SnapKart is more than a marketplace. It is a growing community of smart shoppers, trusted sellers, and people who believe online buying should be better, safer, and more meaningful.
                </p>
                <p className="mt-4 font-semibold text-indigo-700">
                  Let’s reshape the future of shopping — together.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 border-t border-gray-200 pt-8 text-center">
              <span className="text-lg font-bold text-gray-900 block mb-2">
                Got questions?
              </span>
              <p className="text-gray-600 mb-5">
                We’re always here to help you with anything related to SnapKart.
              </p>
              <a
                href="mailto:support@snapkart.com"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-0.5"
              >
                Contact Us
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Aboutus