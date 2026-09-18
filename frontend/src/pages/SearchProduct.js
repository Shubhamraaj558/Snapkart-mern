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
        <div className='min-h-screen bg-slate-950 text-white px-3 sm:px-6 py-4 text-xs sm:text-sm'>
            <div className='max-w-6xl mx-auto space-y-4'>
                
                {/* 🔍 COMPACT SEARCH INPUT BAR */}
                <div>
                    <div className='relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-cyan-400 rounded-xl shadow-md px-4 py-2.5 transition-all'>
                        <FaSearch className='text-cyan-400 mr-3 shrink-0' size={16} />
                        <input
                            ref={inputRef}
                            type='text'
                            value={searchInput}
                            onChange={handleOnChange}
                            placeholder='Search products, brands, categories...'
                            className='w-full bg-transparent text-white placeholder:text-slate-500 outline-none text-xs sm:text-sm font-medium'
                        />
                        {searchInput && (
                            <button 
                                onClick={() => {
                                    setSearchInput("")
                                    navigate('/search')
                                    if(inputRef.current) inputRef.current.focus()
                                }}
                                className='text-slate-400 hover:text-white p-1 transition'
                            >
                                <FaTimes size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* 📊 SEARCH INFO BAR */}
                <div className='flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/80 px-4 py-3 rounded-xl shadow-sm backdrop-blur-md'>
                    <div className='flex items-center gap-2.5 min-w-0'>
                        <div className='p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 shrink-0'>
                            <FaSearch size={14} />
                        </div>
                        <div className='min-w-0'>
                            <h1 className='text-sm font-bold tracking-wide truncate'>Search Results</h1>
                            <p className='text-[11px] text-slate-400 truncate'>
                                {searchQuery ? `Showing results for "${searchQuery}"` : "Start typing above to explore products"}
                            </p>
                        </div>
                    </div>
                    {searchQuery && !loading && (
                        <div className='bg-slate-800/90 text-cyan-300 px-3 py-1 rounded-full text-[11px] font-semibold border border-slate-700 shrink-0'>
                            {data.length} {data.length === 1 ? 'Item' : 'Items'}
                        </div>
                    )}
                </div>

                {/* ⏳ LOADING STATE */}
                {loading && (
                    <div className='flex flex-col items-center justify-center py-12 gap-2'>
                        <div className='w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin'></div>
                        <p className='text-slate-400 text-xs font-medium animate-pulse'>Searching products for you...</p>
                    </div>
                )}

                {/* 📭 EMPTY STATE: When no query is entered */}
                {(!searchQuery || searchQuery.trim() === "") && !loading && (
                    <div className='bg-slate-900/40 border border-slate-800/60 text-center py-8 px-4 rounded-2xl max-w-md mx-auto shadow-inner'>
                        <div className='w-12 h-12 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-2 border border-slate-700 shadow-sm'>
                            <FaSearch size={20} />
                        </div>
                        <h2 className='text-sm font-bold text-white mb-1'>Discover Your Favorite Products</h2>
                        <p className='text-slate-400 text-[11px] max-w-xs mx-auto'>
                            Type anything in the search bar above to instantly find electronics, fashion, gadgets, and more!
                        </p>
                    </div>
                )}

                {/* ❌ NO RESULTS FOUND */}
                {searchQuery && data.length === 0 && !loading && (
                    <div className='bg-slate-900/40 border border-slate-800/60 text-center py-10 px-4 rounded-2xl max-w-md mx-auto shadow-inner'>
                        <div className='text-3xl mb-2'>🔍</div>
                        <h2 className='text-sm font-bold text-white mb-1'>No Results Found</h2>
                        <p className='text-slate-400 text-[11px]'>
                            We couldn't find anything matching "<span className='text-cyan-400 font-medium'>{searchQuery}</span>". Try searching for something else.
                        </p>
                    </div>
                )}

                {/* 📦 PRODUCT GRID */}
                {data.length !== 0 && !loading && searchQuery && (
                    <VerticalCard loading={loading} data={data} />
                )}

            </div>
        </div>
    )
}

export default SearchProduct