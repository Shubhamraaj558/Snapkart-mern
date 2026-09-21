import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  FaRegCircleUser,
  FaUpload,
  FaTrash,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaShieldHalved,
  FaChevronRight,
  FaBars,
  FaXmark,
  FaMagnifyingGlass,
  FaBell,
  FaChartLine,
  FaArrowTrendUp,
  FaGear,
  FaPlus,
  FaBullhorn,
  FaRotate,
  FaSpinner,
  FaCheck,
  FaBolt
} from "react-icons/fa6"
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'
import SummaryApi from '../common'
import { setUserDetails } from '../store/userSlice'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [profilePic, setProfilePic] = useState(user?.profilePic || null)
  const [uploading, setUploading] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const [addProductModal, setAddProductModal] = useState(false)
  const [broadcastModal, setBroadcastModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [productForm, setProductForm] = useState({ name: '', price: '', category: '' })
  const [broadcastText, setBroadcastText] = useState('')

  const notificationsList = [
    { id: 1, title: "New order received #9821", time: "2m ago", type: "order" },
    { id: 2, title: "Server CPU load reached 78%", time: "15m ago", type: "system" },
    { id: 3, title: "New user registration: Alex M.", time: "1h ago", type: "user" }
  ]

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    setProfilePic(user?.profilePic || null)
  }, [user])

  const menuItems = useMemo(() => [
    { label: "Dashboard", to: "dashboard", icon: <FaShieldHalved className="text-[13px]" />, count: "Live" },
    { label: "All Users", to: "all-users", icon: <FaUsers className="text-[13px]" />, count: "Active" },
    { label: "All Products", to: "all-products", icon: <FaBoxOpen className="text-[13px]" />, count: "Stock" },
    { label: "All Orders", to: "all-orders", icon: <FaClipboardList className="text-[13px]" />, count: "New" }
  ], [])

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [menuItems, searchQuery])

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast("❌ Please select a valid image file")
      return
    }

    try {
      setUploading(true)
      const base64 = await fileToBase64(file)

      const res = await fetch(SummaryApi.updateProfilePic.url, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profilePic: base64 })
      })

      const result = await res.json()

      if (result.success) {
        setProfilePic(base64)
        dispatch(setUserDetails({ ...user, profilePic: base64 }))
        showToast("✅ Profile picture updated successfully!")
      } else {
        showToast(`❌ ${result.message}`)
      }
      setUploading(false)
    } catch (err) {
      showToast("❌ Upload failed!")
      setUploading(false)
    }
  }

  const handleRemovePic = async () => {
    try {
      const res = await fetch(SummaryApi.updateProfilePic.url, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profilePic: "" })
      })

      const result = await res.json()

      if (result.success) {
        setProfilePic(null)
        dispatch(setUserDetails({ ...user, profilePic: null }))
        showToast("🗑️ Profile picture removed!")
      }
    } catch (err) {
      showToast("❌ Error removing image")
    }
  }

  const isActiveLink = (to) => location.pathname.includes(to)

  const SidebarContent = () => (
    <div className="relative flex h-full flex-col text-[11px]">
      {/* Brand */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-cyan-500/20 via-blue-600/10 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <FaBolt className="text-xs animate-pulse text-yellow-300" />
          </div>
          <div>
            <h2 className="text-[12px] font-black tracking-wider text-white flex items-center gap-1.5 uppercase">
              Admin Nexus
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h2>
            <p className="text-[9px] text-cyan-300 font-medium tracking-wide">Enterprise Command v3.0</p>
          </div>
        </div>
        <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
          <FaXmark size={15} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="border-b border-white/10 px-3.5 py-3 bg-white/[0.02]">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-3 shadow-inner backdrop-blur-md relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="relative mx-auto w-fit">
            <label htmlFor="profilePicInput" className="group relative block cursor-pointer" title="Change Profile Picture">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={user?.name || "Admin"}
                  className="h-16 w-16 rounded-2xl border-2 border-cyan-400/60 object-cover shadow-[0_4px_20px_rgba(34,211,238,0.3)] transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-3xl text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition duration-300 group-hover:scale-105">
                  <FaRegCircleUser />
                </div>
              )}

              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleUploadPic}
                disabled={uploading}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              <div className="absolute -bottom-1 -right-1 rounded-xl border border-white/20 bg-slate-900 p-1.5 text-cyan-300 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                {uploading ? <FaSpinner className="animate-spin" size={11} /> : <FaUpload size={11} />}
              </div>
            </label>

            {profilePic && (
              <button
                type="button"
                onClick={handleRemovePic}
                disabled={uploading}
                className="absolute -top-1 -right-1 rounded-lg border border-red-400/30 bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
                title="Remove Image"
              >
                <FaTrash size={10} />
              </button>
            )}
          </div>

          <div className="mt-2.5 text-center">
            <p className="text-[12px] font-bold capitalize text-white tracking-wide truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400 truncate max-w-[170px] mx-auto font-light">
              {user?.email || "admin@example.com"}
            </p>
            <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {user?.role || "ADMIN"}
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3.5 pt-3">
        <div className="relative">
          <FaMagnifyingGlass className="absolute left-3 top-2.5 text-cyan-400/70 text-[11px]" />
          <input
            type="text"
            placeholder="Quick search navigation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-[10px] text-white placeholder-slate-400 focus:border-cyan-400/60 focus:bg-white/10 focus:outline-none transition shadow-inner"
          />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3.5 py-3 overflow-y-auto custom-scrollbar">
        <p className="px-2 pb-1.5 text-[8px] font-extrabold uppercase tracking-[0.25em] text-slate-400">
          Core Directory
        </p>

        <nav className="flex flex-col gap-1.5">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => {
              const active = isActiveLink(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`group flex items-center justify-between rounded-xl border px-2.5 py-2 transition-all duration-300 ${
                    active
                      ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-400/25 via-blue-600/30 to-indigo-600/20 text-white shadow-[0_4px_20px_rgba(34,211,238,0.2)] scale-[1.02]'
                      : 'border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/15 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`grid h-7 w-7 place-items-center rounded-lg transition ${active ? 'bg-cyan-400/30 text-cyan-200 border border-cyan-400/40 shadow-sm' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-cyan-300'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-wide">{item.label}</p>
                      <p className="text-[9px] text-slate-400 leading-tight font-light">Manage {item.label.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${active ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/30' : 'bg-white/5 text-slate-400'}`}>
                      {item.count}
                    </span>
                    <FaChevronRight className={`text-[8px] transition ${active ? 'text-cyan-300 translate-x-0.5' : 'text-slate-500 group-hover:translate-x-1 group-hover:text-white'}`} />
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="px-2 py-2 text-center text-slate-400 text-[10px] italic">No menu items found</p>
          )}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="border-t border-white/10 px-3.5 py-3 bg-slate-900/60">
        <div className="rounded-xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent p-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <FaChartLine size={11} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white flex items-center gap-1.5">
                Nexus Secure <FaArrowTrendUp className="text-emerald-400 text-[9px]" />
              </p>
              <p className="text-[8px] text-cyan-300 font-mono tracking-wide">256-Bit SSL Secured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 px-2.5 sm:px-4 py-3 overflow-x-hidden text-[11px] font-sans relative selection:bg-cyan-500 selection:text-white">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/95 border border-cyan-400/50 px-4 py-2 rounded-xl shadow-2xl text-white text-[11px] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Menu Toggle Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900/90 border border-white/10 px-3.5 py-2.5 rounded-2xl mb-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-white font-black text-[12px] uppercase">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <FaBolt size={11} />
          </div>
          <span>Admin Nexus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition">
              <FaBell size={12} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </button>

            {/* Notification Dropdown Mobile */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl z-50">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <span className="font-bold text-white text-[11px]">System Alerts</span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">3 New</span>
                </div>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {notificationsList.map(n => (
                    <div key={n.id} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                      <p className="font-semibold text-white text-[10px]">{n.title}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md">
            <FaBars size={12} />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-md">
          <div className="w-[260px] max-w-full h-full bg-slate-950 border-r border-white/10 overflow-y-auto shadow-2xl">
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* NORMAL SCALE CONTAINER */}
      <div className="w-full">
        <div className="mx-auto grid min-h-[calc(100vh-45px)] max-w-[1700px] md:grid-cols-[250px_1fr] gap-3">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),_transparent_35%)]" />
            <SidebarContent />
          </aside>

          {/* Main Workspace Area */}
          <main className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden text-[11px] backdrop-blur-2xl relative">
            
            {/* Top Bar with Action Buttons */}
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3 gap-3 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="hidden sm:grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 shadow-sm">
                  <FaGear className="animate-spin-slow text-[11px]" />
                </div>
                <div>
                  <h1 className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-2">
                    Dashboard Command Center
                    <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 uppercase">Secure Node</span>
                  </h1>
                  <p className="text-[9px] text-slate-400 font-light">
                    Real-time enterprise overview, inventory channels & broadcast management
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                
                {/* Desktop Notification Bell with Toggle */}
                <div className="relative hidden md:block">
                  <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shadow-sm" title="System Notifications">
                    <FaBell size={12} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/15 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-2xl z-50">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                        <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                          <FaBell className="text-cyan-400" /> Notifications
                        </span>
                        <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20 font-bold">3 Active</span>
                      </div>
                      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar">
                        {notificationsList.map(n => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/30 transition">
                            <p className="font-bold text-white text-[10px]">{n.title}</p>
                            <p className="text-[8px] text-slate-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setAddProductModal(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 text-cyan-200 px-3 py-1.5 rounded-xl font-bold transition text-[10px] shadow-md shadow-cyan-500/10"
                >
                  <FaPlus size={10} className="text-cyan-400" />
                  <span>Add Product</span>
                </button>

                <button 
                  onClick={() => setBroadcastModal(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/40 hover:bg-blue-500/30 text-blue-200 px-3 py-1.5 rounded-xl font-bold transition text-[10px] shadow-md shadow-blue-500/10"
                >
                  <FaBullhorn size={10} className="text-blue-400" />
                  <span>Broadcast</span>
                </button>

                <button 
                  onClick={() => showToast("🔄 Workspace Telemetry Refreshed!")}
                  className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 p-2 rounded-xl font-bold transition shadow-sm"
                  title="Refresh Data"
                >
                  <FaRotate size={11} />
                </button>
              </div>
            </div>

            {/* Router Outlet Area */}
            <div className="flex-1 min-h-0 bg-transparent p-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="w-full h-full overflow-x-auto text-[10px] sm:text-[11px] leading-relaxed p-3 sm:p-4">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Product Modal Popup */}
      {addProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-950 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <h3 className="text-[12px] font-bold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                  <FaBoxOpen size={11} />
                </div> 
                Add New Inventory Item
              </h3>
              <button onClick={() => setAddProductModal(false)} className="text-slate-400 hover:text-white p-1">
                <FaXmark size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Quantum Mechanical Keyboard" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white text-[11px] focus:border-cyan-400 focus:outline-none transition shadow-inner" 
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider">Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="2499" 
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white text-[11px] focus:border-cyan-400 focus:outline-none transition shadow-inner" 
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider">Category</label>
                <input 
                  type="text" 
                  placeholder="Peripherals / Hardware" 
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white text-[11px] focus:border-cyan-400 focus:outline-none transition shadow-inner" 
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={() => setAddProductModal(false)} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-[11px] font-semibold transition">Cancel</button>
                <button onClick={() => {
                  if(!productForm.name) { showToast("❌ Enter product name"); return; }
                  showToast("✅ Product successfully published to database!");
                  setAddProductModal(false);
                  setProductForm({ name: '', price: '', category: '' });
                }} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-slate-950 font-black transition text-[11px] shadow-lg shadow-cyan-500/20 flex items-center gap-1.5">
                  <FaCheck size={10} /> Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal Popup */}
      {broadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-950 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <h3 className="text-[12px] font-bold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  <FaBullhorn size={11} />
                </div>
                Global Broadcast Notice
              </h3>
              <button onClick={() => setBroadcastModal(false)} className="text-slate-400 hover:text-white p-1">
                <FaXmark size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider">Announcement Text</label>
                <textarea 
                  rows={4}
                  placeholder="Type critical update or promotion info here..." 
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 p-3 text-white text-[11px] focus:border-blue-400 focus:outline-none transition shadow-inner custom-scrollbar" 
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={() => setBroadcastModal(false)} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-[11px] font-semibold transition">Cancel</button>
                <button onClick={() => {
                  if(!broadcastText) { showToast("❌ Broadcast content cannot be empty"); return; }
                  showToast("🚀 Broadcast transmission sent to all active clients!");
                  setBroadcastModal(false);
                  setBroadcastText('');
                }} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black transition text-[11px] shadow-lg shadow-blue-500/20 flex items-center gap-1.5">
                  <FaBullhorn size={10} /> Broadcast Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPanel