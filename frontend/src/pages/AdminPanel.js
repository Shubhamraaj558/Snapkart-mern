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
  FaChevronRight
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
      label: "All Users",
      to: "all-users",
      icon: <FaUsers className="text-[18px]" />
    },
    {
      label: "All Products",
      to: "all-products",
      icon: <FaBoxOpen className="text-[18px]" />
    },
    {
      label: "All Orders",
      to: "all-orders",
      icon: <FaClipboardList className="text-[18px]" />
    }
  ], [])

  // ✅ UPDATED FUNCTION (UPLOAD + DB SAVE)
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

        // ✅ redux update (important)
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

  // ✅ UPDATED DELETE FUNCTION
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

        // ✅ redux update
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

  return (
    <div className="hidden min-h-[calc(100vh-120px)] bg-slate-950 px-4 py-4 md:block">
      <div className="mx-auto grid min-h-[calc(100vh-152px)] max-w-[1600px] grid-cols-[290px_1fr] gap-4">
        
        {/* Sidebar */}
        <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.16),_transparent_26%)]" />

          <div className="relative flex h-full flex-col">
            {/* Brand */}
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                  <FaShieldHalved className="text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-white">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-slate-300">
                    Control center dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="border-b border-white/10 px-6 py-6">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 shadow-inner">
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
                        className="h-28 w-28 rounded-[26px] border-4 border-cyan-300/40 object-cover shadow-[0_10px_30px_rgba(34,211,238,0.18)] transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-28 w-28 place-items-center rounded-[26px] bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-[68px] text-white shadow-[0_10px_30px_rgba(59,130,246,0.30)] transition duration-300 group-hover:scale-105">
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

                    <div className="absolute -bottom-2 -right-2 rounded-2xl border border-white/20 bg-slate-900 p-2 text-cyan-300 opacity-0 shadow-xl transition duration-300 group-hover:opacity-100">
                      <FaUpload size={16} />
                    </div>
                  </label>

                  {profilePic && (
                    <button
                      type="button"
                      onClick={handleRemovePic}
                      disabled={uploading}
                      className="absolute -top-2 -right-2 rounded-xl border border-red-400/30 bg-red-500 p-2 text-white shadow-lg transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Remove Profile Picture"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                <div className="mt-5 text-center">
                  <p className="text-lg font-semibold capitalize text-white">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {user?.email || "admin@example.com"}
                  </p>
                  <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {user?.role || "ADMIN"}
                  </div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex-1 px-4 py-5">
              <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Management
              </p>

              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const active = isActiveLink(item.to)

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                        active
                          ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-white shadow-[0_10px_30px_rgba(34,211,238,0.12)]'
                          : 'border-transparent bg-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                            active
                              ? 'bg-white/15 text-cyan-200'
                              : 'bg-white/8 text-slate-300 group-hover:bg-white/12 group-hover:text-cyan-200'
                          }`}
                        >
                          {item.icon}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-slate-400">
                            Manage {item.label.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <FaChevronRight
                        className={`text-sm transition ${
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
            <div className="border-t border-white/10 px-5 py-4">
              <div className="rounded-2xl bg-gradient-to-r from-orange-400/15 to-cyan-400/10 px-4 py-3">
                <p className="text-sm font-semibold text-white">System Status</p>
                <p className="mt-1 text-xs text-slate-300">
                  Admin access active and dashboard ready.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex min-h-0 flex-col rounded-[28px] border border-white/10 bg-slate-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/75 px-6 py-5 backdrop-blur-xl">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Workspace</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage users, products, and orders from one place
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 lg:flex">
              Welcome back,
              <span className="ml-1 font-semibold text-white">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 bg-[linear-gradient(to_bottom_right,rgba(15,23,42,0.98),rgba(30,41,59,0.95))] p-6 overflow-y-auto">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4 md:p-5">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel