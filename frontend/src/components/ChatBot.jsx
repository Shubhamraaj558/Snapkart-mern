import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeadset,
  FaMicrophone,
  FaPaperPlane,
  FaTimes,
  FaTruck,
  FaUndo,
  FaCreditCard,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMagic,
  FaCommentDots,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";

const ChatBot = () => {
  const welcomeMessage = {
    role: "bot",
    type: "text",
    text: "Hey 👋 I’m Snapkart Assistant. I can help you with orders, returns, payments, and trending products.",
    time: "Just now",
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(2);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: "Track Order", icon: <FaTruck />, value: "Track my order" },
    { label: "Returns", icon: <FaUndo />, value: "Tell me return policy" },
    { label: "Payments", icon: <FaCreditCard />, value: "Payment options" },
    { label: "Top Picks", icon: <FaStar />, value: "Recommend best products" },
  ];

  const featuredProducts = [
    { name: "iPhone 14", tag: "Popular", price: "₹59,999" },
    { name: "Nike Shoes", tag: "Best Seller", price: "₹3,499" },
    { name: "Smart Watch", tag: "Trending", price: "₹2,199" },
  ];

  const smartSuggestions = [
    "Show trending products",
    "Track my latest order",
    "What are payment options?",
    "Tell me return policy",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
    }
  }, [open]);

  const nowTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
  };

  const getBotReply = (msg) => {
    const text = msg.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return {
        type: "text",
        text: "Hi there! Need help with shopping, delivery, returns, or payments?",
      };
    }

    if (
      text.includes("product") ||
      text.includes("recommend") ||
      text.includes("best") ||
      text.includes("top picks") ||
      text.includes("trending")
    ) {
      return {
        type: "products",
        text: "Here are some popular picks you may like:",
      };
    }

    if (text.includes("order") || text.includes("track")) {
      return {
        type: "text",
        text: "You can track your order from the My Orders section. If you share the order issue, I’ll guide you faster.",
      };
    }

    if (text.includes("delivery")) {
      return {
        type: "text",
        text: "Delivery usually takes 3–5 days based on location and seller availability.",
      };
    }

    if (text.includes("return")) {
      return {
        type: "text",
        text: "Most products have a 7-day return policy. Some categories may have seller-specific rules.",
      };
    }

    if (text.includes("payment")) {
      return {
        type: "text",
        text: "We support UPI, cards, net banking, wallets, and Cash on Delivery on eligible orders.",
      };
    }

    if (text.includes("thank")) {
      return {
        type: "text",
        text: "You’re welcome 💜 I’m always here to make your shopping easier.",
      };
    }

    return {
      type: "text",
      text: "I didn’t fully get that. Try asking about orders, returns, delivery, payments, or product suggestions.",
    };
  };

  const sendMessage = (customValue) => {
    const finalText = customValue || input;
    if (!finalText.trim()) return;

    const userMsg = {
      role: "user",
      type: "text",
      text: finalText,
      time: nowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");
    setShowSuggestions(false);

    setTimeout(() => {
      const reply = getBotReply(finalText);

      const botMsg = {
        role: "bot",
        type: reply.type,
        text: reply.text,
        time: nowTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 850);
  };

  const toggleLike = (index) => {
    setLikedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    setInput("");
    setLoading(false);
    setShowSuggestions(true);
  };

  const renderBotContent = (msg) => {
    if (msg.type === "products") {
      return (
        <div className="space-y-3">
          <p className="text-sm leading-6">{msg.text}</p>

          <div className="grid gap-2">
            {featuredProducts.map((item, i) => (
              <motion.div
                whileHover={{ y: -2 }}
                key={i}
                className="rounded-2xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,238,255,0.92))] p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{item.tag}</p>
                  </div>

                  <span className="text-xs font-semibold text-[#6d4aff] bg-[linear-gradient(180deg,#efeaff,#e8f4ff)] px-2 py-1 rounded-full">
                    {item.price}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => setInput(`Tell me price of ${item.name}`)}
                    className="text-xs font-medium text-[#6d4aff] hover:text-[#5133db] transition"
                  >
                    Ask about this →
                  </button>

                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <FaCheckCircle size={10} />
                    In stock
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-sm leading-6 whitespace-pre-line">{msg.text}</p>;
  };

  return (
    <>
      {!open && (
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50"
          aria-label="Open chatbot"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-[#6d4aff]/30 animate-ping" />

            <div className="relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#6d4aff] to-[#8f6bff] text-white pl-3 pr-5 py-3 shadow-[0_18px_40px_rgba(109,74,255,0.35)] border border-white/20 backdrop-blur-xl">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <FaHeadset className="text-lg" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold leading-none">Need help?</p>
                <p className="text-[11px] text-white/80 mt-1">
                  Chat with Snapkart
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-[#ff4d6d] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </motion.button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[3px] z-40"
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-5 right-5 z-50 w-[390px] max-w-[calc(100vw-16px)] h-[640px] max-h-[88vh] rounded-[30px] overflow-hidden border border-white/40 bg-white/75 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.22)] flex flex-col"
          >
            <div className="relative p-4 border-b border-slate-200/70 bg-[linear-gradient(135deg,#ffffff_0%,#f6f2ff_40%,#efe8ff_70%,#e8f5ff_100%)] overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#8f6bff]/15 blur-3xl" />
              <div className="absolute top-10 right-0 w-28 h-28 rounded-full bg-[#66d1ff]/15 blur-3xl" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6d4aff] to-[#8c68ff] text-white flex items-center justify-center shadow-lg">
                      <FaHeadset />
                    </div>
                    <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">
                      Snapkart Assistant
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Online now • Smart shopping support
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetChat}
                    className="w-9 h-9 rounded-full hover:bg-white/80 text-slate-500 flex items-center justify-center transition"
                    title="Reset chat"
                  >
                    <FaTrashAlt size={13} />
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="w-9 h-9 rounded-full hover:bg-white/80 text-slate-500 flex items-center justify-center transition"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6d4aff] font-medium">
                <FaMagic size={10} />
                <span>Smart suggestions ready</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {quickActions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(item.value)}
                    className="group rounded-2xl border border-white/60 bg-white/70 hover:bg-white px-3 py-3 text-left shadow-sm transition"
                  >
                    <div className="flex items-center gap-2 text-[#6d4aff] text-sm mb-1">
                      {item.icon}
                      <span className="font-semibold text-slate-800 group-hover:text-[#6d4aff]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tap to ask instantly
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-3 py-4 bg-[linear-gradient(180deg,#f8faff_0%,#f5f1ff_55%,#eef7ff_100%)]">
              <div className="absolute top-10 left-4 w-28 h-28 rounded-full bg-[#8f6bff]/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-24 right-2 w-28 h-28 rounded-full bg-[#66d1ff]/10 blur-3xl pointer-events-none" />

              <div className="relative space-y-4">
                {showSuggestions && messages.length <= 1 && (
                  <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/75 backdrop-blur-md p-4 shadow-sm">
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <img
                        src="/logo.jpg"
                        alt="Snapkart logo background"
                        className="w-52 h-52 object-contain opacity-[0.08] blur-[1.5px] scale-110 select-none"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(245,241,255,0.88))] pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6d4aff] to-[#67c8ff] text-white flex items-center justify-center shadow-md">
                          <FaCommentDots />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            Start with a quick prompt
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Choose a suggestion to chat faster
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {smartSuggestions.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(item)}
                            className="px-3 py-2 rounded-full text-xs font-medium bg-[linear-gradient(180deg,#ffffff,#f2ebff)] border border-[#e8dbff] text-[#6d4aff] hover:bg-white transition"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {msg.role === "bot" && (
                        <span className="text-[11px] text-slate-400 mb-1 px-1">
                          Assistant
                        </span>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`px-4 py-3 rounded-[22px] shadow-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#6d4aff] to-[#7f5cff] text-white rounded-br-md"
                            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(243,237,255,0.92))] backdrop-blur-md border border-white/70 text-slate-800 rounded-bl-md"
                        }`}
                      >
                        {msg.role === "bot" ? (
                          renderBotContent(msg)
                        ) : (
                          <p className="text-sm leading-6 whitespace-pre-line">
                            {msg.text}
                          </p>
                        )}
                      </motion.div>

                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[11px] text-slate-400">
                          {msg.time}
                        </span>

                        {msg.role === "bot" && (
                          <button
                            onClick={() => toggleLike(i)}
                            className={`text-[12px] transition ${
                              likedMessages[i]
                                ? "text-[#ff4d6d]"
                                : "text-slate-300 hover:text-[#ff4d6d]"
                            }`}
                            title="Like message"
                          >
                            {likedMessages[i] ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] text-slate-400 mb-1 px-1">
                        Assistant is typing...
                      </span>

                      <div className="bg-white/80 backdrop-blur-md border border-white/70 rounded-[22px] rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#6d4aff] typing-dot" />
                          <span className="w-2 h-2 rounded-full bg-[#8f6bff] typing-dot" />
                          <span className="w-2 h-2 rounded-full bg-[#b39cff] typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-3 border-t border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,241,255,0.92))] backdrop-blur-xl">
              <div className="relative flex items-center gap-2 rounded-[24px] border border-slate-200 bg-white px-2 py-2 shadow-sm overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f1ebff] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#edf8ff] to-transparent pointer-events-none" />

                <button
                  onClick={startVoice}
                  className="w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center transition relative z-10"
                >
                  <FaMicrophone size={14} />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 px-2 relative z-10"
                  placeholder="Ask about orders, returns, products..."
                />

                <button
                  onClick={() => sendMessage()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6d4aff] to-[#8f6bff] hover:scale-105 text-white flex items-center justify-center shadow-md transition relative z-10"
                >
                  <FaPaperPlane size={13} />
                </button>
              </div>

              <div className="flex items-center justify-between px-1 pt-2">
                <p className="text-[11px] text-slate-400">
                  Fast, friendly, and always on
                </p>
                <button
                  onClick={resetChat}
                  className="text-[11px] font-medium text-slate-500 hover:text-[#6d4aff] transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes typingWave {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        .typing-dot {
          animation: typingWave 1.15s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }
      `}</style>
    </>
  );
};

export default ChatBot;

// ####################################################### Real chatbot code ################################################################


// bro ek kaaam kroge ye jo mera chatbot h isme koi random quest dummy data add kr doge jo user puch sakta h expected question tere hisab se bina koi backed aur api intergration ke 

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaPhone } from "react-icons/fa"; // npm install framer-motion

// const ChatBot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // 🎤 Voice input
//   const startVoice = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Voice not supported in this browser");
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.start();
//     recognition.onresult = (event) => {
//       const text = event.results[0][0].transcript;
//       setInput(text);
//     };
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg = { role: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8080/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await res.json();
//       const botMsg = { role: "bot", text: data.reply || "No response" };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "Server error ❌" },
//       ]);
//     }
//     setLoading(false);
//     setInput("");
//   };

//   return (
//     <>
//       {/* 🔥 FLOATING BUTTON - Pulsing Animation */}
//       {!open && (
//         <motion.button
//           whileHover={{ scale: 1.05, rotate: 360 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setOpen(true)}
//           className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl shadow-2xl border-4 border-white/30 backdrop-blur-lg flex items-center justify-center text-2xl z-50 hover:shadow-purple-500/25 transition-all duration-300"
//         >
//           💬
//         </motion.button>
//       )}

//       {/* 🤖 CHAT WINDOW - Glassmorphism */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ scale: 0, rotate: -10, opacity: 0 }}
//             animate={{ scale: 1, rotate: 0, opacity: 1 }}
//             exit={{ scale: 0, rotate: 10, opacity: 0 }}
//             className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden flex flex-col z-50"
//           >
//             {/* HEADER - Gradient + Shine */}
//             <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-600 p-4 flex justify-between items-center relative overflow-hidden">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                   <span className="text-2xl">🤖</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-white text-lg drop-shadow-lg">
//                     Snapkart AI
//                   </h3>
//                   <p className="text-white/80 text-sm">Online & Ready</p>
//                 </div>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setOpen(false)}
//                 className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200"
//               >
//                 ✕
//               </motion.button>

//               {/* Shine effect */}
//               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
//             </div>

//             {/* MESSAGES - Scrollable */}
//             <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white/50 to-white/20 backdrop-blur-sm space-y-4">
//               {messages.length === 0 && (
//                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
//                   <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//                     <span className="text-3xl">🛍️</span>
//                   </div>
//                   <p className="text-lg font-semibold mb-1">Ask me anything!</p>
//                   <p className="text-sm">
//                     Shopping tips, product recs, order help
//                   </p>
//                 </div>
//               )}

//               <AnimatePresence>
//                 {messages.map((msg, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className={`max-w-[85%] p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 flex flex-col gap-2 ${
//                       msg.role === "user"
//                         ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white self-end shadow-blue-500/25"
//                         : "bg-white/80 text-gray-900 self-start shadow-sm"
//                     }`}
//                   >
//                     <p className="text-sm leading-relaxed">{msg.text}</p>
//                     <div
//                       className={`h-2 rounded-full ${msg.role === "user" ? "bg-white/50" : "bg-gray-300/50"}`}
//                     />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               {loading && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="self-start bg-white/80 p-4 rounded-2xl shadow-sm border border-white/30 backdrop-blur-sm flex items-center gap-2"
//                 >
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
//                     <div
//                       className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     />
//                     <div
//                       className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     Snapkart AI is typing...
//                   </span>
//                 </motion.div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* INPUT - Glass Input */}
//             <div className="p-4 bg-white/20 backdrop-blur-sm border-t border-white/30">
//               <div className="flex items-center gap-2 bg-white/50 backdrop-blur-lg rounded-2xl p-3 border border-white/40 shadow-lg">
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-purple-400/50"
//                   placeholder="Ask about products, orders, or anything..."
//                 />

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={startVoice}
//                   className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl flex items-center justify-center shadow-lg border-white/30 backdrop-blur-sm transition-all duration-200"
//                 >
//                   🎤
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={sendMessage}
//                   disabled={!input.trim() || loading}
//                   className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg border-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   Send →
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%) skewX(-12deg);
//           }
//           100% {
//             transform: translateX(100%) skewX(-12deg);
//           }
//         }
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ChatBot;
