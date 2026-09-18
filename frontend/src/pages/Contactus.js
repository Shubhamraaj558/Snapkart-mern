import React, { useState, useEffect } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPaperPlane 
} from 'react-icons/fa';

const Contactus = () => {
  // Page load hote hi screen ko top par scroll karne ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Thank you for contacting SnapKart! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden relative py-6 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          
          {/* Contact Info Cards */}
          <div className="space-y-4">
            
            {/* Phone & Email */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                <FaPhone className="text-2xl bg-indigo-100 p-1.5 rounded-xl text-indigo-600" />
                Quick Connect
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <FaPhone className="text-sm text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-slate-900">Customer Support</p>
                    <a href="tel:+11234567890" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <FaEnvelope className="text-sm text-purple-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-slate-900">Email</p>
                    <a href="mailto:support@snapkart.com" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                      support@snapkart.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Follow Us</h2>
              <div className="grid grid-cols-3 gap-3">
                <a 
                  href="https://facebook.com" 
                  className="group relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-md hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-base" />
                </a>
                <a 
                  href="https://twitter.com" 
                  className="group relative p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl text-white shadow-md hover:shadow-sky-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-base" />
                </a>
                <a 
                  href="https://instagram.com" 
                  className="group relative p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white shadow-md hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-base" />
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-5 text-center">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all duration-300 text-xs sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all duration-300 text-xs sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all duration-300 text-xs sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm resize-vertical"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={12} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-8 sm:mt-10 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Visit Us</h2>
            <div className="mx-auto max-w-xl rounded-xl overflow-hidden shadow-md border border-slate-200">
              <iframe
                title="SnapKart Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.138627!2d-73.98731968459357!3d40.75889697932646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b311746f%3A0xd134e199a405a163!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center text-slate-700">
              <FaMapMarkerAlt className="text-lg text-indigo-500" />
              <p className="text-xs sm:text-sm font-semibold">123 SnapKart Street, New York, NY 10001</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contactus;