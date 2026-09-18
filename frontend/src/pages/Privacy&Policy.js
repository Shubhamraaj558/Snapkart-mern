import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLock,
  FaInfoCircle,
  FaCookieBite,
  FaUserShield,
  FaUserCog,
  FaSyncAlt,
  FaEnvelope,
  FaChevronDown,
  FaArrowLeft,
  FaShieldAlt,
  FaHeadset,
  FaTruck,
  FaChartLine,
  FaPhone
} from 'react-icons/fa';

const privacySections = [
  {
    id: 1,
    emoji: "📥",
    title: "Information We Collect",
    icon: <FaInfoCircle className="text-indigo-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">
          We may collect personal details like your name, email address, phone number, delivery address, and payment details when you:
        </p>
        <ul className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            Register or create an account
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            Place an order
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            Subscribe to our newsletter
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            Contact customer support
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 2,
    emoji: "🔧",
    title: "How We Use Your Information",
    icon: <FaUserCog className="text-purple-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">The information we collect is used to:</p>
        <ul className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
            Process your orders efficiently
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
            Improve your shopping experience
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
            Send important order updates
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
            Personalize recommendations
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
            Respond to your queries
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    emoji: "🔐",
    title: "Data Protection & Security",
    icon: <FaUserShield className="text-emerald-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">
          Your data is securely stored and transmitted using industry-standard encryption (AES-256) and access controls.
        </p>
        <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm sm:grid-cols-2">
          <div>
            <strong className="text-emerald-700">We don't share:</strong>
            <ul className="mt-1 space-y-0.5 text-slate-600">
              <li>• Personal data with third parties</li>
              <li>• Your browsing history</li>
              <li>• Sensitive payment details</li>
            </ul>
          </div>
          <div>
            <strong className="text-emerald-700">We share only when:</strong>
            <ul className="mt-1 space-y-0.5 text-slate-600">
              <li>• Required to fulfill orders</li>
              <li>• Mandated by law</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 4,
    emoji: "🍪",
    title: "Cookies & Tracking",
    icon: <FaCookieBite className="text-amber-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">
          SnapKart uses cookies to improve site functionality and provide a personalized experience.
        </p>
        <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200/50 bg-amber-50/50 p-3">
            <FaShieldAlt className="mt-0.5 text-amber-500 shrink-0" />
            <div>
              <strong>Essential Cookies:</strong> Required for site functionality (e.g., cart, login)
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-amber-200/50 bg-amber-50/50 p-3">
            <FaShieldAlt className="mt-0.5 text-amber-500 shrink-0" />
            <div>
              <strong>Analytics Cookies:</strong> Help us understand usage patterns (you can opt-out)
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            You can manage cookies through your browser settings at any time.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 5,
    emoji: "🔗",
    title: "Third-Party Services",
    icon: <FaLock className="text-rose-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">
          We use trusted third-party services for payment processing, shipping, and analytics.
        </p>
        <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm sm:grid-cols-3">
          <div className="text-center p-2 rounded-xl bg-slate-50/50">
            <div className="mx-auto mb-1 h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <FaLock className="text-rose-500 text-sm" />
            </div>
            <strong>Payment</strong>
            <p className="text-[11px] text-slate-500">Razorpay, Stripe</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-slate-50/50">
            <div className="mx-auto mb-1 h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
              <FaTruck className="text-sky-500 text-sm" />
            </div>
            <strong>Shipping</strong>
            <p className="text-[11px] text-slate-500">Delhivery, BlueDart</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-slate-50/50">
            <div className="mx-auto mb-1 h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FaChartLine className="text-indigo-500 text-sm" />
            </div>
            <strong>Analytics</strong>
            <p className="text-[11px] text-slate-500">Google Analytics</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          All partners follow strict confidentiality and data protection policies.
        </p>
      </>
    ),
  },
  {
    id: 6,
    emoji: "⚖️",
    title: "Your Rights & Choices",
    icon: <FaUserCog className="text-emerald-500" />,
    content: (
      <>
        <p className="mb-3 text-xs sm:text-sm">You have full control over your personal data:</p>
        <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm sm:grid-cols-2">
          <div className="p-2.5 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
            <strong className="text-emerald-700">Access & Update:</strong>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Log into your account to view or edit your information
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
            <strong className="text-emerald-700">Delete Data:</strong>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Request permanent deletion of your account and data
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
            <strong className="text-emerald-700">Opt-Out:</strong>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Unsubscribe from marketing emails anytime
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
            <strong className="text-emerald-700">Download:</strong>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Request a copy of your data in standard format
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 7,
    emoji: "🔄",
    title: "Policy Updates",
    icon: <FaSyncAlt className="text-blue-500" />,
    content: (
      <>
        <p className="mb-2 text-xs sm:text-sm">
          This Privacy Policy was last updated on <strong>April 30, 2026</strong>.
        </p>
        <p className="text-xs sm:text-sm text-slate-600">
          We may update this policy from time to time. Significant changes will be communicated via email and posted here. Continued use of SnapKart after updates constitutes acceptance of the revised policy.
        </p>
      </>
    ),
  },
  {
    id: 8,
    emoji: "📞",
    title: "Contact Us",
    icon: <FaEnvelope className="text-rose-500" />,
    content: (
      <div className="space-y-2">
        <p className="mb-2 text-xs sm:text-sm">For questions regarding this Privacy Policy:</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 p-3">
            <FaEnvelope className="text-rose-500 text-sm shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">Email Support</p>
              <p className="text-xs text-slate-600">support@snapkart.in</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 p-3">
            <FaPhone className="text-sky-500 text-sm shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">Phone</p>
              <p className="text-xs text-slate-600">+91-XXXXXXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(1);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 px-3 py-6 sm:px-4 lg:px-6">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Back button */}
        <div className="mb-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
          >
            <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* main container */}
        <div className="rounded-3xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-xl overflow-hidden">
          {/* hero header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 px-4 py-8 text-center text-white sm:px-8 lg:px-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-md">
              <FaLock className="text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/95 leading-relaxed">
              Your privacy matters to us. This page explains how SnapKart collects, uses, and protects your personal information.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
              Last Updated: April 30, 2026
            </div>
          </div>

          {/* commitment banner */}
          <div className="border-t border-white/20 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 px-4 py-5 text-center backdrop-blur-md sm:px-8">
            <div className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-md">
              <FaShieldAlt className="text-emerald-500 text-sm" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Our Privacy Commitment
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
              We prioritize your data protection with industry-standard encryption, strict access controls, and transparent practices. Your trust is our foundation.
            </p>
          </div>

          {/* sections */}
          <div className="px-4 py-5 sm:px-8 lg:px-10">
            <div className="space-y-3">
              {privacySections.map(({ id, emoji, title, icon, content }) => {
                const isOpen = openSection === id;

                return (
                  <div
                    key={id}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? 'border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-white shadow-md'
                        : 'border-slate-200/50 bg-white/80 hover:border-purple-200 hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => toggleSection(id)}
                      className="flex w-full items-start justify-between gap-3 px-4 py-4 sm:px-6"
                      aria-expanded={isOpen}
                      aria-controls={`section-content-${id}`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-lg sm:text-xl shrink-0">{emoji}</span>
                        <div
                          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                            isOpen
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {icon}
                        </div>
                        <div className="min-w-0 text-left">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                            {title}
                          </h3>
                          <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">
                            {isOpen ? 'Hide details' : 'Tap to view details'}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 bg-indigo-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <FaChevronDown className="text-xs" />
                      </div>
                    </button>

                    <div
                      id={`section-content-${id}`}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6">
                          <div className="ml-0 sm:ml-12 rounded-xl border border-white/60 bg-white/90 p-4 text-xs sm:text-sm leading-relaxed text-slate-700 shadow-sm">
                            {content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* support CTA */}
        <div className="mt-6 rounded-2xl border border-white/50 bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white shadow-xl backdrop-blur-xl sm:p-8">
          <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <FaHeadset />
                Privacy Questions?
              </div>
              <h3 className="text-xl font-bold sm:text-2xl">
                Need clarification about your data?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Our team is ready to help with data access requests, account deletion, or any privacy concerns.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="mailto:support@snapkart.in"
                className="block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Contact Privacy Team
              </a>
              <p className="text-[11px] text-slate-400 text-center">
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;