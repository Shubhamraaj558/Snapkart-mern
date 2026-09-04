import React, { useEffect, useMemo, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md"
import { FaTrash } from "react-icons/fa6"   // ✅ ADD
import ChangeUserRole from '../components/ChangeUserRole'

const roleStyles = {
  ADMIN: 'bg-purple-500/15 text-purple-200 border-purple-400/20',
  GENERAL: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/20',
  USER: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
}

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([])
  const [openUpdateRole, setOpenUpdateRole] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: ""
  })

  const fetchAllUsers = async () => {
    try {
      setLoading(true)

      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include'
      })

      const dataResponse = await fetchData.json()

      if (dataResponse.success) {
        setAllUsers(dataResponse.data)
      }

      if (dataResponse.error) {
        toast.error(dataResponse.message)
      }
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include"
      })

      const data = await res.json()

      if (data.success) {
        setCurrentUserId(data.data._id)
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    fetchAllUsers()
    fetchCurrentUser()
  }, [])

  const totalUsers = allUser.length

  const totalAdmins = useMemo(() => {
    return allUser.filter(user => user?.role === 'ADMIN').length
  }, [allUser])


  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null)

  const handleDelete = async (id) => {
    // console.log("Deleting ID:", id)
  if (id === currentUserId) {
    setShowErrorPopup(true)

    // setTimeout(() => {
    //   setShowErrorPopup(false)
    // }, 2000)

    return
  }

  try {
    const res = await fetch(`${SummaryApi.deleteUser.url}/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    const data = await res.json()

    if (data.success) {
      setShowDeletePopup(true)
      fetchAllUsers()

      // setTimeout(() => {
      //   setShowDeletePopup(false)
      // }, 2000)

    } else {
      toast.error(data.message)
    }

  } catch (error) {
    toast.error("Delete failed")
  }
}

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col gap-4">
      
      {/* Header */}
      <div className="sticky top-0 z-20 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-lg">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              All Users
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage users, roles and account access
            </p>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[120px] rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Users
              </p>
              <p className="mt-1 text-2xl font-black text-white">
                {totalUsers}
              </p>
            </div>

            <div className="min-w-[120px] rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-200">
                Admins
              </p>
              <p className="mt-1 text-2xl font-black text-white">
                {totalAdmins}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-inner">
        {loading ? (
          <div className="grid min-h-[280px] place-items-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
              <p className="text-base font-medium text-slate-300">Loading users...</p>
              <p className="mt-1 text-xs text-slate-500">Fetching user records</p>
            </div>
          </div>
        ) : allUser.length === 0 ? (
          <div className="grid min-h-[280px] place-items-center p-8">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-white/5">
                <svg className="h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H11a4 4 0 00-4 4v2m10 0H7m10-10a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">No users found</h3>
              <p className="mt-2 text-sm text-slate-400">
                User accounts will appear here once they register.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-220px)] overflow-auto">
            <table className="w-full min-w-[860px] text-sm text-left">
              <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-xl">
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="px-4 py-3 font-semibold">Sr.</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {allUser.map((el, index) => (
                  <tr
                    key={el?._id || index}
                    className="border-b border-white/5 text-slate-200 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 text-sm font-bold text-white">
                          {el?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight">
                            {el?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {el?._id?.slice(-6) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      <span className="truncate block max-w-[220px]">
                        {el?.email}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${
                        roleStyles[el?.role] || 'bg-slate-500/10 text-slate-200 border-slate-400/20'
                      }`}>
                        {el?.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      <div className="flex flex-col">
                        <span>{moment(el?.createdAt).format('MMM DD, YYYY')}</span>
                        <span className="text-xs text-slate-500">
                          {moment(el?.createdAt).fromNow()}
                        </span>
                      </div>
                    </td>

                    {/* ✅ ONLY CHANGE HERE */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 shadow-sm transition hover:scale-105 hover:bg-emerald-500 hover:text-white"
                          onClick={() => {
                            setUpdateUserDetails(el)
                            setOpenUpdateRole(true)
                          }}
                        >
                          <MdModeEdit className="text-lg" />
                        </button>

                        <button
                          className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 shadow-sm transition hover:scale-105 hover:bg-red-500 hover:text-white"
                          onClick={() => setConfirmDeleteUser(el._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-slate-900 text-white px-6 py-5 rounded-2xl shadow-2xl border border-green-400/30 text-center">

            <h2 className="text-lg font-semibold text-green-400 mb-4">
              ✅ User Deleted Successfully
            </h2>

            <button
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
              onClick={() => setShowDeletePopup(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}


      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

            <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-transparent to-orange-400/10 pointer-events-none" />

            <div className="relative p-6 sm:p-7 text-white">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15 shadow-lg shadow-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
                  />
                </svg>
              </div>

              <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-white">
                Delete this user?
              </h2>

              <p className="mt-3 text-center text-sm sm:text-base leading-6 text-gray-300">
                This action will permanently remove the user data. This cannot be undone.
              </p>

              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
                Please confirm before deleting this account.
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/30 active:scale-[0.98]"
                  onClick={() => {
                    const id = confirmDeleteUser   // ✅ store first
                    setConfirmDeleteUser(null)     // ✅ then clear
                    handleDelete(id)               // ✅ then call
                  }}
                >
                  Yes, Delete ✔️
                </button>

                <button
                  className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm sm:text-base font-semibold text-gray-200 transition-all duration-300 hover:bg-white/15 hover:text-white active:scale-[0.98]"
                  onClick={() => setConfirmDeleteUser(null)}
                >
                  Cancel ❌
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-400/20 bg-slate-900/90 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">

            <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-transparent to-rose-500/10 pointer-events-none" />

            <div className="relative px-6 py-7 sm:px-7 sm:py-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15 shadow-lg shadow-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
                  />
                </svg>
              </div>

              <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-red-400">
                Action Restricted
              </h2>

              <p className="mt-3 text-center text-sm sm:text-base leading-6 text-slate-300">
                You cannot delete your own account while you are currently signed in.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <p className="text-sm italic text-slate-300">
                  “To protect system integrity, self-deletion is disabled for the active administrator.”
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center">
                Please use another admin account if this profile needs to be removed.
              </div>

              <button
                onClick={() => setShowErrorPopup(false)}
                className="mt-7 w-full rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/30 active:scale-[0.98]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
    
  )
}

export default AllUsers