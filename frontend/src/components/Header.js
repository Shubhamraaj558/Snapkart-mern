import React, { useContext, useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { FaSearchengin, FaUserTie, FaCartArrowDown ,FaHeart} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice'
import ROLE from '../common/role'
import Context from '../context'

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef(null)

  const URLSearch = new URLSearchParams(location?.search)
  const searchQuery = URLSearch.get("q") || ""
  const [search, setSearch] = useState(searchQuery)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuDisplay(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      })
      const data = await fetchData.json()

      if (data.success) {
        toast.success(data.message)
        dispatch(setUserDetails(null))
        navigate('/')
      } else {
        toast.error(data.message || 'Logout failed')
      }
    } catch (error) {
      toast.error('Something went wrong during logout')
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`)
    } else {
      navigate('/search')
    }
  }

  const handleSearchClick = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full py-3 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border-b border-slate-800'
            : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/70'
          }`}
      >
        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-11">
          <div className="h-20 flex items-center justify-between gap-4">

            {/* Logo + Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none shrink-0"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center justify-center rounded-xl bg-white px-2 py-1 shadow-md">
                <Logo w={69} h={40} />
              </div>

              <div className="hidden sm:block leading-tight">
                <h1 className="text-white text-2xl font-extrabold tracking-wide">
                  𝕊𝕟𝕒𝕡𝕜𝕒𝕣𝕥
                </h1>
                <p className="text-cyan-400 text-xs font-semibold tracking-[0.25em] uppercase">
                  smart shopping
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="w-full max-w-2xl flex items-center rounded-full border border-indigo-400 bg-slate-900 shadow-inner focus-within:border-cyan-400 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className="w-full bg-transparent text-white placeholder:text-slate-400 px-5 py-3 outline-none"
                  onChange={handleSearch}
                  value={search}
                  aria-label="Search products"
                />
                <button
                  className="mr-2 bg-cyan-500 hover:bg-purple-600 text-white rounded-full p-2.5 transition shadow-md"
                  aria-label="Search button"
                  onClick={handleSearchClick}
                  type="button"
                >
                  <FaSearchengin size={18} />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">

              {/* Mobile Search */}
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl border border-slate-700 bg-slate-900 text-white hover:border-cyan-400 transition"
                aria-label="Search"
              >
                <FaSearchengin size={18} />
              </button>

              {/* Cart */}
              {user?._id && (
                <Link
                  to="/wishlist"
                  className="flex items-center justify-center w-11 h-11 rounded-xl border border-rose-400 bg-slate-900 text-pink-400 hover:border-pink-400 hover:text-pink-300 transition"
                >
                  <button className="wishlist-btn">
                    <FaHeart size={20} style={{ color: "red", marginRight: "0px" }} />
                    {/* Wishlist */}
                  </button>
                </Link>
              )}
  
              {user?._id && (
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center w-11 h-11 rounded-xl border border-green-300 bg-slate-900 text-white hover:border-cyan-400 hover:text-cyan-300 transition"
                  aria-label="Cart"
                >
                  <FaCartArrowDown size={20} />
                  {context?.cartProductCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-md">
                      {context.cartProductCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                {user?._id ? (
                  <button
                    onClick={() => setMenuDisplay(prev => !prev)}
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={menuDisplay}
                    className="flex items-center justify-center w-11 h-11 rounded-xl border border-cyan-500 bg-slate-900 overflow-hidden shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name || 'User Profile'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <FaUserTie className="text-cyan-300 w-5 h-5" />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500 px-4 py-2.5 text-white font-semibold hover:bg-pink-600 transition"
                    aria-label="Login"
                  >
                    <FaUserTie />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                )}

                {menuDisplay && (
                  <nav className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.35)] py-2 z-50 text-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-white font-semibold truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-slate-400 text-xs truncate">
                        {user?.email || 'Logged in'}
                      </p>
                    </div>

                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to="/admin-panel/all-products"
                        className="block px-4 py-3 hover:bg-slate-800 text-cyan-300 font-semibold"
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-slate-800 text-white"
                      onClick={() => setMenuDisplay(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 font-semibold"
                    >
                      Logout
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />
    </>
  )
}

export default Header