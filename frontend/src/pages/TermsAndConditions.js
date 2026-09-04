import React, { useState } from 'react';
import {
  FaFileContract,
  FaUserShield,
  FaBarcode,
  FaCreditCard,
  FaShippingFast,
  FaUserAltSlash,
  FaCopyright,
  FaExclamationTriangle,
  FaSyncAlt,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaGavel,
  FaHeadset,
  FaShieldAlt,
} from 'react-icons/fa';

const termsData = [
  {
    id: 1,
    color: 'from-amber-500 to-yellow-500',
    soft: 'bg-amber-50 text-amber-700',
    icon: <FaFileContract />,
    title: 'Acceptance of Terms',
    content:
      'By accessing and using SnapKart, you accept and agree to be bound by these terms. If you do not agree, please discontinue use of the platform.',
  },
  {
    id: 2,
    color: 'from-orange-500 to-red-500',
    soft: 'bg-orange-50 text-orange-700',
    icon: <FaUserShield />,
    title: 'Account Responsibility',
    content:
      'Users are responsible for maintaining the confidentiality of their account credentials and agree to accept responsibility for all activities under their account.',
  },
  {
    id: 3,
    color: 'from-rose-500 to-pink-500',
    soft: 'bg-rose-50 text-rose-700',
    icon: <FaBarcode />,
    title: 'Product Information',
    content:
      'We strive to provide accurate and up-to-date information. However, SnapKart is not responsible for typographical errors, display differences, or listing inaccuracies in product information.',
  },
  {
    id: 4,
    color: 'from-fuchsia-500 to-pink-500',
    soft: 'bg-fuchsia-50 text-fuchsia-700',
    icon: <FaCreditCard />,
    title: 'Payments & Pricing',
    content:
      'All payments are processed securely. Prices may change without prior notice. Applicable taxes and charges are included unless stated otherwise at checkout.',
  },
  {
    id: 5,
    color: 'from-emerald-500 to-green-500',
    soft: 'bg-emerald-50 text-emerald-700',
    icon: <FaShippingFast />,
    title: 'Shipping & Returns',
    content:
      'Orders are shipped to the address provided by the customer and remain subject to delivery timelines, courier availability, and serviceable regions. Eligible items may be returned under our Return Policy.',
  },
  {
    id: 6,
    color: 'from-indigo-500 to-blue-500',
    soft: 'bg-indigo-50 text-indigo-700',
    icon: <FaUserAltSlash />,
    title: 'User Conduct',
    content:
      'Users agree not to misuse the platform, upload harmful content, manipulate pricing, or engage in fraudulent activity. Any such behavior may result in suspension or permanent account termination.',
  },
  {
    id: 7,
    color: 'from-slate-500 to-gray-600',
    soft: 'bg-slate-100 text-slate-700',
    icon: <FaCopyright />,
    title: 'Intellectual Property',
    content:
      'All content on SnapKart, including logos, text, graphics, product visuals, and site design elements, is owned or licensed by us and protected under applicable intellectual property laws. Unauthorized use is prohibited.',
  },
  {
    id: 8,
    color: 'from-red-500 to-rose-600',
    soft: 'bg-red-50 text-red-700',
    icon: <FaExclamationTriangle />,
    title: 'Limitation of Liability',
    content:
      'SnapKart is not liable for indirect, incidental, or consequential damages resulting from the use or inability to use the platform, delayed deliveries, service interruptions, or third-party failures.',
  },
  {
    id: 9,
    color: 'from-sky-500 to-cyan-500',
    soft: 'bg-sky-50 text-sky-700',
    icon: <FaSyncAlt />,
    title: 'Changes to Terms',
    content:
      'We reserve the right to update these terms at any time. Continued use of the website after any update constitutes your acceptance of the revised Terms & Conditions.',
  },
  {
    id: 10,
    color: 'from-pink-500 to-rose-500',
    soft: 'bg-pink-50 text-pink-700',
    icon: <FaEnvelope />,
    title: 'Contact Information',
    content: (
      <div className="space-y-3">
        <p>For any questions or concerns regarding these terms:</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-pink-100">
            <FaEnvelope className="text-pink-600" />
            <div>
              <p className="font-semibold text-slate-900">Email</p>
              <p className="text-sm text-slate-600">support@snapkart.in</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-sky-100">
            <FaPhone className="text-sky-600" />
            <div>
              <p className="font-semibold text-slate-900">Phone</p>
              <p className="text-sm text-slate-600">+91-XXXXXXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const TermsAndConditions = () => {
  const [openSection, setOpenSection] = useState(1);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 px-4 py-10 sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm backdrop-blur-md">
            <FaGavel />
            Legal Information
          </div>

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-2xl">
            <FaFileContract className="text-3xl" />
          </div>

          <h1 className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Please read these terms carefully before using SnapKart. They explain your rights, responsibilities, and the conditions under which our services are provided.
          </p>
        </div>

        {/* Top cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <FaShieldAlt />
            </div>
            <h3 className="font-bold text-slate-900">Clear Policies</h3>
            <p className="mt-1 text-sm text-slate-600">
              Transparent rules for safe and fair use of the platform.
            </p>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <FaFileContract />
            </div>
            <h3 className="font-bold text-slate-900">User Agreement</h3>
            <p className="mt-1 text-sm text-slate-600">
              Your continued use means you agree to these terms.
            </p>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <FaHeadset />
            </div>
            <h3 className="font-bold text-slate-900">Support Available</h3>
            <p className="mt-1 text-sm text-slate-600">
              Reach out anytime for help understanding our policies.
            </p>
          </div>
        </div>

        {/* Terms content */}
        <div className="rounded-[2rem] border border-white/50 bg-white/65 p-5 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="mb-6 rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Important
            </p>
            <p className="mt-2 text-base text-slate-700 sm:text-lg">
              These terms help maintain a secure, fair, and reliable shopping experience for every SnapKart customer.
            </p>
          </div>

          <div className="space-y-4">
            {termsData.map(({ id, icon, title, content, color, soft }) => {
              const isOpen = openSection === id;

              return (
                <div
                  key={id}
                  className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-rose-50 shadow-lg'
                      : 'border-slate-200/70 bg-white/80 hover:border-orange-200 hover:bg-orange-50/40'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                    aria-controls={`section-content-${id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md bg-gradient-to-br ${color}`}
                      >
                        {icon}
                      </div>

                      <div className="min-w-0">
                        <span className="block text-base font-semibold text-slate-900 sm:text-lg">
                          {title}
                        </span>
                        <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${soft}`}>
                          Section {id}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <FaChevronDown />
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
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="ml-0 sm:ml-16 rounded-2xl border border-white/70 bg-white/90 p-4 text-sm leading-7 text-slate-600 shadow-sm sm:text-base">
                          {content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Thank you for shopping with SnapKart — your trust and satisfaction remain our priority.
          </p>
        </div>

        {/* Support CTA */}
        <div className="mt-10 rounded-[2rem] border border-white/50 bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-300">
                <FaHeadset />
                Need Clarification?
              </div>

              <h3 className="text-2xl font-bold sm:text-3xl">
                Questions about our terms?
              </h3>

              <p className="mt-3 max-w-2xl text-slate-300">
                Contact our support team for clarification on policies, account responsibility, returns, payments, or any legal questions related to SnapKart.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <a
                href="mailto:support@snapkart.in"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Contact Support
              </a>

              <p className="text-sm text-slate-400 lg:text-right">
                We aim to respond to policy-related questions as quickly as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;