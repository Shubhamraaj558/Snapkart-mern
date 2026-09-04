import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaTrashAlt,
  FaArrowRight,
  FaStar,
  FaFire,
} from 'react-icons/fa';
import { HeartIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(SummaryApi.getWishlist.url, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`${SummaryApi.deleteWishlist.url}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Removed from wishlist');
        fetchWishlist();
      } else {
        toast.error(result.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Premium header */}
        <div className="mx-auto mb-12 w-full max-w-4xl rounded-3xl border border-rose-100/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="mx-auto flex max-w-md flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-6 py-3 text-rose-600">
                <FaHeart className="h-5 w-5 animate-pulse" />
                <span className="text-lg font-bold">My Wishlist</span>
              </div>

              <h1 className="mt-4 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                Your Saved Collection
              </h1>

              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Discover your curated collection of loved products. Ready to shop?
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 px-10 text-white shadow-2xl md:shrink-0">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg">
                  <FaFire className="h-8 w-8" />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-300">
                  Total Saved Items
                </p>
                <p className="text-4xl font-black">{data.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {new Array(10).fill(null).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="group overflow-hidden rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl"
              >
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-4/5 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-3 w-3/5 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-4 w-16 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-4 w-12 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                  <div className="h-10 w-full rounded-2xl bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          /* Premium empty state */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-rose-100/50 bg-white/70 px-8 py-20 text-center shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-xl" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100/50 to-pink-100/50 p-1 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white/90">
                  <HeartIcon className="h-12 w-12 text-rose-500" />
                </div>
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-black text-slate-800">
              No Saved Items Yet
            </h2>

            <p className="mt-4 max-w-md text-lg text-slate-600">
              Your wishlist is waiting for amazing products. Start exploring and save
              items you'll love.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl"
              >
                Start Shopping
                <FaArrowRight />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-3xl border-2 border-slate-200/50 bg-white/50 px-8 py-4 text-lg font-semibold text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white hover:shadow-lg"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        ) : (
          /* Premium wishlist grid */
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.map((item, index) => {
              const product = item?.productId;

              return (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  {/* Premium remove button */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-3xl bg-white/90 text-rose-500 shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-rose-500 hover:text-white hover:shadow-xl"
                  >
                    <FaTrashAlt className="h-5 w-5" />
                  </button>

                  {/* Premium image */}
                  <Link to={`/product/${product?._id}`} className="block">
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50/50 to-rose-50/50 p-4 pb-6">
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm">
                        <img
                          src={product?.productImage?.[0]}
                          alt={product?.productName}
                          className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110"
                        />

                        {/* Premium badge */}
                        <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                          Saved
                        </div>
                      </div>
                    </div>

                    {/* Premium content */}
                    <div className="p-6">
                      <div className="mb-2 flex items-center gap-1">
                        <FaStar className="h-4 w-4 text-amber-400" />
                        <span className="text-xs text-slate-500">4.8</span>
                      </div>

                      <h2 className="line-clamp-1 text-base font-black text-slate-800 sm:text-lg">
                        {product?.productName}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {product?.category}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <p className="text-lg font-black text-rose-600">
                          {displayINRCurrency(product?.sellingPrice)}
                        </p>

                        {product?.price && (
                          <p className="text-sm text-slate-400 line-through">
                            {displayINRCurrency(product?.price)}
                          </p>
                        )}
                      </div>

                      <Link
                        to={`/product/${product?._id}`}
                        className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black px-6 py-3.5 text-center text-sm font-bold text-white shadow-xl hover:shadow-2xl"
                      >
                        View Details
                      </Link>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;