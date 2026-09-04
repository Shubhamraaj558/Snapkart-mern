import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHeadset, FaShieldAlt, FaTruck } from 'react-icons/fa';

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Simply browse products, add them to your cart, and proceed to checkout. You’ll be guided step-by-step to complete your purchase.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept debit/credit cards, UPI, net banking, and popular wallets. All transactions are secured with encryption.",
  },
  {
    question: "When will I receive my order?",
    answer:
      "Orders are delivered within 2–7 business days depending on your location. You will receive tracking updates once your order is shipped.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes! Products can be returned or exchanged within 7 days of delivery if they are unused and in original packaging.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Go to the My Orders section in your account or use the tracking link sent via SMS/email once your order is shipped.",
  },
  {
    question: "Is my personal data safe with SnapKart?",
    answer: (
      <>
        Absolutely. We use encrypted connections and follow strict data protection
        policies. Read our{" "}
        <a href="/privacy" className="text-pink-600 font-semibold underline underline-offset-4">
          Privacy Policy
        </a>{" "}
        for more details.
      </>
    ),
  },
  {
    question: "Need more help?",
    answer: (
      <>
        Feel free to contact our support team at{" "}
        <strong>support@snapkart.in</strong> or call{" "}
        <strong>+91-XXXXXXXXXX</strong>. We're here to help!
      </>
    ),
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm backdrop-blur-md">
            <FaQuestionCircle />
            Help Center
          </div>

          <h1 className="bg-gradient-to-r from-orange-600 via-rose-500 to-pink-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Everything you need to know about orders, payments, delivery, returns, and account safety at SnapKart.
          </p>
        </div>

        {/* Top feature cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <FaHeadset />
            </div>
            <h3 className="font-bold text-slate-900">24/7 Support</h3>
            <p className="mt-1 text-sm text-slate-600">Friendly help whenever you need assistance.</p>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FaShieldAlt />
            </div>
            <h3 className="font-bold text-slate-900">Secure Payments</h3>
            <p className="mt-1 text-sm text-slate-600">Protected checkout with trusted payment options.</p>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <FaTruck />
            </div>
            <h3 className="font-bold text-slate-900">Fast Delivery</h3>
            <p className="mt-1 text-sm text-slate-600">Quick shipping and real-time order tracking.</p>
          </div>
        </div>

        {/* FAQ section */}
        <div className="rounded-[2rem] border border-white/50 bg-white/65 p-4 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="space-y-4">
            {faqData.map(({ question, answer }, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-orange-300/70 bg-gradient-to-r from-orange-50 to-rose-50 shadow-lg'
                      : 'border-slate-200/70 bg-white/80 hover:border-orange-200 hover:bg-orange-50/40'
                  }`}
                >
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isOpen
                            ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <span className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
                        isOpen ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {question}
                      </span>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? 'bg-orange-500 text-white rotate-180'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="ml-14 rounded-2xl border border-white/60 bg-white/80 p-4 text-sm leading-7 text-slate-600 shadow-sm sm:text-base">
                          {answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-100/80 to-rose-100/80 px-6 py-5 text-center shadow-inner">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              SnapKart Support Promise
            </p>
            <p className="mt-2 text-base sm:text-lg font-medium text-slate-700">
              Your questions matter, and your satisfaction stays at the center of every order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;