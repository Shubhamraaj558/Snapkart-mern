import React from 'react'
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const socialLinks = [
    {
      href: 'https://www.facebook.com/',
      label: 'Facebook',
      icon: <FaFacebookF />,
      style:
        'text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      href: 'https://www.twitter.com/',
      label: 'Twitter',
      icon: <FaTwitter />,
      style:
        'text-[#1DA1F2] bg-[#1DA1F2]/10 border-[#1DA1F2]/30 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
    },
    {
      href: 'https://www.instagram.com/',
      label: 'Instagram',
      icon: <FaInstagram />,
      style:
        'text-[#E1306C] bg-[#E1306C]/10 border-[#E1306C]/30 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]',
    },
    {
      href: 'mailto:support@snapkart.com',
      label: 'Email',
      icon: <FaEnvelope />,
      style:
        'text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/30 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335]',
    }
  ]

  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="/logo.jpg"
                alt="SnapKart Logo"
                className="h-20 w-20 rounded-2xl border border-cyan-400/30 object-cover shadow-lg"
              />

              <div>
                <h2 className="text-2xl font-extrabold tracking-wide text-white">
                    𝕊𝕟𝕒𝕡𝕜𝕒𝕣𝕥
                </h2>
                <p className="text-sm text-cyan-300">
                  Everything you need. Delivered.
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Your one-stop shop for trendy and essential products. Built with care
              to give users a smooth shopping experience, faster access to products,
              and dependable service.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-sm font-medium text-white">
                Proudly Engineered by Shubham Kr
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Thank you for choosing SnapKart.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/" className="transition hover:text-cyan-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="transition hover:text-cyan-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-cyan-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-cyan-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Customer Service
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/faqs" className="transition hover:text-cyan-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping-return" className="transition hover:text-cyan-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="transition hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-cyan-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Follow Us
            </h3>

            <div className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`grid h-11 w-11 place-items-center rounded-xl border text-lg transition duration-300 hover:-translate-y-1 ${item.style}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Connect with us for updates, offers, and latest launches.
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <p className="text-sm font-medium text-cyan-400">
                support@snapkart.com
              </p>
              <p className="mt-1 text-xs text-slate-400">
                We usually reply within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} SnapKart. All rights reserved.</p>
          <p className="text-slate-500">
            Designed for a modern shopping experience.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer