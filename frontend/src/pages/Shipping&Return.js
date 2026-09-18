import React, { useState, useEffect } from 'react';
import {
  FaTruck,
  FaUndoAlt,
  FaBoxes,
  FaStopwatch,
  FaRupeeSign,
  FaSearchLocation,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaShieldAlt,
  FaHeadset,
} from 'react-icons/fa';

const sections = [
  {
    title: "Shipping Policy",
    badge: "Fast & Reliable",
    icon: <FaTruck className="text-emerald-500" />,
    items: [
      {
        heading: "Delivery Timeframe",
        content: (
          <>
            Orders are typically processed within <strong>24–48 hours</strong> of confirmation.
            <br />
            <br />
            <strong>Estimated delivery times:</strong>
            <br />
            • <strong>Metro Cities:</strong> 2–4 business days
            <br />
            • <strong>Other Locations:</strong> 4–7 business days
          </>
        ),
        icon: <FaStopwatch className="text-sky-500" />,
      },
      {
        heading: "Shipping Charges",
        content: (
          <>
            <strong>Free shipping</strong> on all prepaid orders above ₹499.
            <br />
            <br />
            For orders below ₹499, a nominal shipping fee of ₹49 may apply.
          </>
        ),
        icon: <FaRupeeSign className="text-yellow-500" />,
      },
      {
        heading: "Order Tracking",
        content: (
          <>
            Once your order is shipped, you will receive a tracking link via SMS or email.
            <br />
            <br />
            You can also track your order in the <strong>My Orders</strong> section of your account.
          </>
        ),
        icon: <FaSearchLocation className="text-indigo-500" />,
      },
    ],
  },
  {
    title: "Return & Refund Policy",
    badge: "Simple & Fair",
    icon: <FaUndoAlt className="text-rose-500" />,
    items: [
      {
        heading: "Return Eligibility",
        content: (
          <>
            Products can be returned within <strong>7 days</strong> of delivery.
            <br />
            <br />
            Items must be unused, undamaged, and returned in their original packaging.
          </>
        ),
        icon: <FaBoxes className="text-purple-500" />,
      },
      {
        heading: "Non-Returnable Items",
        content:
          "Some items like personal care, innerwear, and perishable goods may not be eligible for return due to hygiene or safety reasons.",
        icon: <FaShieldAlt className="text-slate-500" />,
      },
      {
        heading: "Refunds",
        content: (
          <>
            Once we receive and inspect the returned item, a refund will be processed within{" "}
            <strong>5–7 business days</strong>.
            <br />
            <br />
            The amount will be credited to your original payment method or wallet.
          </>
        ),
        icon: <FaRupeeSign className="text-emerald-600" />,
      },
    ],
  },
];

const ShippingAndReturns = () => {
  // Page load hote hi screen ko top par scroll karne ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [openSections, setOpenSections] = useState({ "0-0": true });

  const toggleSection = (parentIdx, itemIdx) => {
    setOpenSections((prev) => {
      const key = `${parentIdx}-${itemIdx}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-100 px-3 py-6 sm:px-4 lg:px-6">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
            <FaTruck />
            SnapKart Policies
          </div>

          <h1 className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent sm:text-3xl lg:text-4xl">
            Shipping & Returns
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fast deliveries, transparent charges, and hassle-free returns — designed to keep your shopping experience smooth from checkout to doorstep.
          </p>
        </div>

        {/* top stat / promise cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-sm">
              <FaTruck />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Fast Dispatch</h3>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600">Orders usually leave within 24–48 hours.</p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 text-sm">
              <FaUndoAlt />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Easy Returns</h3>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600">Simple return window with clear rules.</p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 text-sm">
              <FaHeadset />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Support Ready</h3>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600">Need help with a shipment or refund?</p>
          </div>
        </div>

        {/* policy blocks */}
        <div className="space-y-5">
          {sections.map((section, pIdx) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/50 bg-white/65 p-4 shadow-xl backdrop-blur-2xl sm:p-5 lg:p-6"
            >
              <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md text-sm">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{section.title}</h2>
                    <p className="text-[11px] sm:text-xs text-slate-500">Clear information, no hidden surprises.</p>
                  </div>
                </div>

                <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
                  {section.badge}
                </span>
              </div>

              <div className="space-y-3">
                {section.items.map(({ heading, content, icon }, idx) => {
                  const key = `${pIdx}-${idx}`;
                  const isOpen = !!openSections[key];

                  return (
                    <div
                      key={key}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? 'border-sky-200 bg-gradient-to-r from-sky-50 to-white shadow-md'
                          : 'border-slate-200/70 bg-white/80 hover:border-sky-100 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleSection(pIdx, idx)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                        aria-expanded={isOpen}
                        aria-controls={`section-content-${key}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 text-xs ${
                              isOpen
                                ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {icon}
                          </div>

                          <div>
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              {heading}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-slate-500">
                              {isOpen ? 'Hide details' : 'View details'}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 text-xs ${
                            isOpen
                              ? 'rotate-180 bg-sky-500 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <FaChevronDown />
                        </div>
                      </button>

                      <div
                        id={`section-content-${key}`}
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                        aria-hidden={!isOpen}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                            <div className="ml-0 sm:ml-12 rounded-xl border border-white/60 bg-white/85 p-3 text-xs sm:text-sm leading-relaxed text-slate-600 shadow-sm">
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
          ))}
        </div>

        {/* support card */}
        <div className="mt-6 rounded-2xl border border-white/50 bg-slate-900 p-5 text-white shadow-xl sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <FaHeadset />
                Need Help?
              </div>

              <h3 className="text-lg sm:text-xl font-bold">
                Questions about shipping or returns?
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our support team can help with delivery timelines, order tracking, return eligibility, and refund status.
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-emerald-400" />
                  <span className="font-medium">support@snapkart.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-sky-400" />
                  <span className="font-medium">+91-XXXXXXXXXX</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <a
                href="mailto:support@snapkart.in"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                Contact Support
              </a>

              <p className="text-[11px] text-slate-400 lg:text-right">
                Your satisfaction is our priority at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAndReturns;