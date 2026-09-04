import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-300/40 to-pink-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl w-full mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:max-w-lg">
              
              {/* Phone & Email */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <FaPhone className="text-3xl bg-indigo-100 p-2 rounded-2xl text-indigo-600" />
                  Quick Connect
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                    <FaPhone className="text-xl text-indigo-500" />
                    <div>
                      <p className="font-semibold text-slate-900">Customer Support</p>
                      <a href="tel:+11234567890" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        +1 (123) 456-7890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <FaEnvelope className="text-xl text-purple-500" />
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a href="mailto:support@snapkart.com" className="text-purple-600 hover:text-purple-700 font-medium">
                        support@snapkart.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Follow Us</h2>
                <div className="grid grid-cols-3 gap-4">
                  <a 
                    href="https://facebook.com" 
                    className="group relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="text-xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    className="group relative p-4 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl text-white shadow-lg hover:shadow-sky-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-sky-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    className="group relative p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400/50 transition-all duration-300 text-slate-900 placeholder-slate-500 shadow-lg hover:shadow-xl"
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
                      className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400/50 transition-all duration-300 text-slate-900 placeholder-slate-500 shadow-lg hover:shadow-xl"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400/50 transition-all duration-300 text-slate-900 placeholder-slate-500 shadow-lg hover:shadow-xl resize-vertical"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          ircle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-16 lg:mt-24 text-center">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Visit Us</h2>
              <div className="mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <iframe
                  title="SnapKart Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.138627!2d-73.98731968459357!3d40.75889697932646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b311746f%3A0xd134e199a405a163!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center text-slate-700">
                <FaMapMarkerAlt className="text-2xl text-indigo-500" />
                <p className="text-lg font-semibold">123 SnapKart Street, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;