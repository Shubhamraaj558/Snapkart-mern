import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const ChangeUserRole = ({
  name,
  email,
  role,
  userId,
  onClose,
  callFunc,
}) => {
  const [userRole, setUserRole] = useState(role)
  const [loading, setLoading] = useState(false)

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value)
  }

  const updateUserRole = async () => {
    try {
      setLoading(true)

      const fetchResponse = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          role: userRole
        })
      })

      const responseData = await fetchResponse.json()

      if (responseData.success) {
        toast.success(responseData.message)
        onClose()
        callFunc()
      }

      if (responseData.error) {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error("Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md'>
      <div className='w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_20px_80px_rgba(0,0,0,0.45)]'>

        {/* Header */}
        <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-xl'>
          <div>
            <h1 className='text-xl font-bold text-white'>Change User Role</h1>
            <p className='mt-1 text-sm text-slate-400'>
              Update access permission for this user
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-red-500/15 hover:text-red-300'
          >
            <IoMdClose />
          </button>
        </div>

        {/* Body */}
        <div className='p-6'>
          <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-5'>
            <div className='mb-4 flex items-center gap-4'>
              <div className='grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg'>
                {name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className='min-w-0'>
                <p className='truncate text-lg font-semibold text-white'>
                  {name}
                </p>
                <p className='truncate text-sm text-slate-400'>
                  {email}
                </p>
              </div>
            </div>

            <div className='mt-5 space-y-2'>
              <label className='text-sm font-medium text-slate-200'>
                Select Role
              </label>

              <select
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]'
                value={userRole}
                onChange={handleOnChangeSelect}
              >
                {
                  Object.values(ROLE).map((el) => {
                    return (
                      <option value={el} key={el} className='text-black'>
                        {el}
                      </option>
                    )
                  })
                }
              </select>
            </div>

            <div className='mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 px-4 py-3'>
              <p className='text-xs uppercase tracking-[0.18em] text-cyan-200'>
                Current selection
              </p>
              <p className='mt-1 text-sm font-semibold text-white'>
                {userRole}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='mt-5 flex items-center justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white'
            >
              Cancel
            </button>

            <button
              onClick={updateUserRole}
              disabled={loading}
              className='rounded-2xl border border-orange-400/30 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:from-orange-400 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? "Updating..." : "Change Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeUserRole