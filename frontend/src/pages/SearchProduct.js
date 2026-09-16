import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'
import { FaSearch, FaTimes } from 'react-icons/fa'

const SearchProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const urlSearch = new URLSearchParams(location.search)
  const searchQuery = urlSearch.get("q") || ""
  const [searchInput, setSearchInput] = useState(searchQuery)

  // Page khulte hi ya search page par aate hi input par focus karne ke liye (Mobile keyboard open hoga)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // URL change hone par input sync rakhna
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  const fetchProduct = async () => {
    if (!searchQuery.trim()) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(SummaryApi.searchProduct.url + location.search)
      const dataResponse = await response.json()
      setData(dataResponse.data || [])
    } catch (error) {
      console.error("Error fetching search results:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [location.search])

  // Type karte hi live URL update karne ke liye
  const handleOnChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <div className='min-h-screen bg-slate-950 text-white px-4 sm:px-6 lg:px-8 pt-10 pb-16'>
      <div className='max-w-7xl mx-auto'>

        {/* Mobile & Desktop Interactive Search Input Bar */}
        <div className='mb-2'>
          <div className='relative flex items-center bg-slate-900 border border-slate-700 focus-within:border-cyan-400 rounded-2xl shadow-xl px-5 py-3 transition-all'>
            <FaSearch className='text-cyan-400 mr-3 shrink-0' size={18} />
            <input
              ref={inputRef}
              type='text'
              value={searchInput}
              onChange={handleOnChange}
              placeholder='Search products, brands, categories...'
              className='w-full bg-transparent text-white placeholder:text-slate-400 outline-none text-sm sm:text-base'
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("")
                  navigate('/search')
                  if (inputRef.current) inputRef.current.focus()
                }}
                className='text-slate-400 hover:text-white p-1'
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Info Bar */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-md mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 sm:p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20'>
              <FaSearch size={18} />
            </div>
            <div>
              <h1 className='text-lg sm:text-xl font-bold tracking-wide'>Search Results</h1>
              <p className='text-xs text-slate-400 mt-0.5'>
                {searchQuery ? `Showing results for "${searchQuery}"` : "Start typing above to explore products"}
              </p>
            </div>
          </div>
          {searchQuery && !loading && (
            <div className='bg-slate-800 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-700'>
              {data.length} {data.length === 1 ? 'Item Found' : 'Items Found'}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-20 gap-3'>
            <div className='w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin'></div>
            <p className='text-slate-400 text-sm font-medium animate-pulse'>Searching products for you...</p>
          </div>
        )}

        {/* Empty State: When no query is entered */}
        {(!searchQuery || searchQuery.trim() === "") && !loading && (
          <div className='bg-slate-900/50 border border-slate-800/80 text-center py-6 px-6 rounded-3xl max-w-xl mx-auto shadow-inner'>
            <div className='w-16 h-16 bg-slate-800 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-slate-700 shadow-md'>
              <FaSearch size={28} />
            </div>
            <h2 className='text-lg font-bold text-white mb-2'>Discover Your Favorite Products</h2>
            <p className='text-slate-400 text-sm'>
              Type anything in the search bar above to instantly find electronics, fashion, gadgets, and more!
            </p>
          </div>
        )}

        {/* No Results Found */}
        {searchQuery && data.length === 0 && !loading && (
          <div className='bg-slate-900/50 border border-slate-800/80 text-center py-16 px-6 rounded-3xl max-w-xl mx-auto shadow-inner'>
            <div className='text-4xl mb-3'>🔍</div>
            <h2 className='text-lg font-bold text-white mb-1'>No Results Found</h2>
            <p className='text-slate-400 text-sm'>
              We couldn't find anything matching "<span className='text-cyan-400 font-medium'>{searchQuery}</span>". Try searching for something else.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {data.length !== 0 && !loading && searchQuery && (
          <VerticalCard loading={loading} data={data} />
        )}

      </div>
    </div>
  )
}

export default SearchProduct