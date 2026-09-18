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
      icon: <FaFacebookF size={13} />,
      style:
        'text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      href: 'https://www.twitter.com/',
      label: 'Twitter',
      icon: <FaTwitter size={13} />,
      style:
        'text-[#1DA1F2] bg-[#1DA1F2]/10 border-[#1DA1F2]/30 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
    },
    {
      href: 'https://www.instagram.com/',
      label: 'Instagram',
      icon: <FaInstagram size={13} />,
      style:
        'text-[#E1306C] bg-[#E1306C]/10 border-[#E1306C]/30 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]',
    },
    {
      href: 'mailto:support@snapkart.com',
      label: 'Email',
      icon: <FaEnvelope size={13} />,
      style:
        'text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/30 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335]',
    }
  ]

  return (
    <footer className="mt-4 border-t border-white/10 bg-slate-950 text-slate-200 text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo3.png"
                alt="SnapKart Logo"
                className="h-16 w-20 rounded-xl border border-cyan-400/30 object-contain bg-transparent mix-blend-screen shadow-md"
              />
              
              <div>
                <h2 className="text-xl font-extrabold tracking-wide text-white">
                  𝕊𝕟𝕒𝕡𝕜𝕒𝕣𝕥
                </h2>
                <p className="text-xs text-cyan-300 font-light">
                  Everything you need. Delivered.
                </p>
              </div>
            </div>

            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              Your one-stop shop for trendy and essential products. Built with care
              to give users a smooth shopping experience, faster access to products,
              and dependable service.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
              <p className="text-xs font-medium text-white">
                Proudly Engineered by Shubham Kumar
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Thank you for choosing SnapKart.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
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
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Customer Service
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
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
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Follow Us
            </h3>

            <div className="flex items-center gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`grid h-9 w-9 place-items-center rounded-xl border transition duration-300 hover:-translate-y-0.5 ${item.style}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Connect with us for updates, offers, and latest launches.
            </p>

            <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
              <p className="text-xs font-medium text-cyan-400">
                support@snapkart.com
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                We usually reply within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3.5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
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