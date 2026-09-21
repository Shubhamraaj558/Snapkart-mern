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
  FaXmark
} from "react-icons/fa6"
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'
import SummaryApi from '../common'
import { setUserDetails } from '../store/userSlice'

// helper
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

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    setProfilePic(user?.profilePic || null)
  }, [user])

  const menuItems = useMemo(() => [
    {
      label: "Dashboard",
      to: "dashboard",
      icon: <FaShieldHalved className="text-[15px]" /> 
    },
    {
      label: "All Users",
      to: "all-users",
      icon: <FaUsers className="text-[15px]" />
    },
    {
      label: "All Products",
      to: "all-products",
      icon: <FaBoxOpen className="text-[15px]" />
    },
    {
      label: "All Orders",
      to: "all-orders",
      icon: <FaClipboardList className="text-[15px]" />
    }
  ], [])

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file")
      return
    }

    try {
      setUploading(true)
      const base64 = await fileToBase64(file)

      const res = await fetch(SummaryApi.updateProfilePic.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ profilePic: base64 })
      })

      const result = await res.json()

      if (result.success) {
        setProfilePic(base64)
        dispatch(setUserDetails({
          ...user,
          profilePic: base64
        }))
        alert("Profile updated ✅")
      } else {
        alert(result.message)
      }
      setUploading(false)
    } catch (err) {
      alert("Upload failed!")
      setUploading(false)
    }
  }

  const handleRemovePic = async () => {
    try {
      const res = await fetch(SummaryApi.updateProfilePic.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ profilePic: "" })
      })

      const result = await res.json()

      if (result.success) {
        setProfilePic(null)
        dispatch(setUserDetails({
          ...user,
          profilePic: null
        }))
        alert("Profile removed ✅")
      }
    } catch (err) {
      alert("Error removing image")
    }
  }

  const isActiveLink = (to) => {
    return location.pathname.includes(to)
  }

  // Sidebar content reuse component for mobile & desktop
  const SidebarContent = () => (
    <div className="relative flex h-full flex-col text-xs sm:text-sm">
      {/* Brand */}
      <div className="border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md">
            <FaShieldHalved className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white">
              Admin Panel
            </h2>
            <p className="text-[11px] text-slate-300">
              Control center
            </p>
          </div>
        </div>
        {/* Close button for mobile drawer */}
        <button 
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden text-slate-400 hover:text-white p-1.5"
        >
          <FaXmark size={18} />
        </button>
      </div>

      {/* Profile */}
      <div className="border-b border-white/15 px-4 py-4">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 shadow-inner">
          <div className="relative mx-auto w-fit">
            <label
              htmlFor="profilePicInput"
              className="group relative block cursor-pointer"
              title="Change Profile Picture"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={user?.name || "Admin User"}
                  className="h-20 w-20 rounded-2xl border-2 border-cyan-300/40 object-cover shadow-[0_6px_20px_rgba(34,211,238,0.18)] transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-4xl text-white shadow-[0_6px_20px_rgba(59,130,246,0.30)] transition duration-300 group-hover:scale-105">
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

              <div className="absolute -bottom-1.5 -right-1.5 rounded-xl border border-white/20 bg-slate-900 p-1.5 text-cyan-300 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                <FaUpload size={13} />
              </div>
            </label>

            {profilePic && (
              <button
                type="button"
                onClick={handleRemovePic}
                disabled={uploading}
                className="absolute -top-1.5 -right-1.5 rounded-lg border border-red-400/30 bg-red-500 p-1.5 text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                title="Remove Profile Picture"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm font-semibold capitalize text-white">
              {user?.name || "Admin User"}
            </p>
            <p className="mt-0.5 text-xs text-slate-300 truncate max-w-[180px] mx-auto">
              {user?.email || "admin@example.com"}
            </p>
            <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {user?.role || "ADMIN"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-3.5 overflow-y-auto">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Management
        </p>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const active = isActiveLink(item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileSidebarOpen(false)}
                className={`group flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-300 ${
                  active
                    ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-white shadow-[0_6px_20px_rgba(34,211,238,0.12)]'
                    : 'border-transparent bg-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                      active
                        ? 'bg-white/15 text-cyan-200'
                        : 'bg-white/8 text-slate-300 group-hover:bg-white/12 group-hover:text-cyan-200'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="text-[11px] text-slate-400">
                      Manage {item.label.toLowerCase()}
                    </p>
                  </div>
                </div>

                <FaChevronRight
                  className={`text-xs transition ${
                    active
                      ? 'translate-x-0 text-cyan-200'
                      : 'text-slate-500 group-hover:translate-x-1 group-hover:text-white'
                  }`}
                />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="rounded-xl bg-gradient-to-r from-orange-400/15 to-cyan-400/10 px-3 py-2">
          <p className="text-xs font-semibold text-white">System Status</p>
          <p className="mt-0.5 text-[11px] text-slate-300">
            Admin access active.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-950 px-2 sm:px-3 py-3 overflow-x-hidden text-xs sm:text-sm">
      {/* Mobile Menu Toggle Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border border-white/10 px-3 py-2.5 rounded-xl mb-3 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <FaShieldHalved className="text-cyan-400" />
          <span>Admin Dashboard</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
        >
          <FaBars size={14} />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/70 backdrop-blur-sm">
          <div className="w-[260px] max-w-full h-full bg-slate-950 border-r border-white/10 overflow-y-auto shadow-2xl">
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Grid Layout for Desktop & Tablet */}
      <div className="mx-auto grid min-h-[calc(100vh-130px)] max-w-[1500px] md:grid-cols-[240px_1fr] gap-3">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 backdrop-blur-xl shadow-[0_15px_60px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.16),_transparent_26%)]" />
          <SidebarContent />
        </aside>

        {/* Main Content Workspace - Cleaned up white space */}
        <main className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-slate-900/90 shadow-[0_15px_60px_rgba(0,0,0,0.35)] overflow-hidden text-xs">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/75 px-3.5 py-2.5 backdrop-blur-xl">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white">Dashboard Workspace</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Manage users, products, and orders smoothly
              </p>
            </div>

            <div className="hidden rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 lg:flex">
              Welcome back,
              <span className="ml-1 font-semibold text-white">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>

          {/* Outlet Section with transparent background & 0 padding to remove white space */}
          <div className="flex-1 min-h-0 bg-transparent p-0 overflow-y-auto overflow-x-hidden">
            <div className="w-full h-full overflow-x-auto text-[11px] sm:text-xs leading-relaxed" style={{ zoom: '0.82' }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel