import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import {
  FaAngleLeft,
  FaAngleRight,
  FaCartShopping,
  FaBolt,
  FaShieldHeart,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(8).fill(null);

  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setData(categoryProduct?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [category]);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 320;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 320;
  };

  const getDiscountPercent = (price, sellingPrice) => {
    if (!price || !sellingPrice || price <= sellingPrice) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 via-white to-rose-100 px-4 py-6 sm:px-5 md:px-6">
        {/* background glow */}
        <div className="pointer-events-none absolute -top-10 left-0 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-rose-600 shadow-sm backdrop-blur">
              <FaBolt className="text-[11px]" />
              Trending Collection
            </div>

            <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
              {heading}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Fresh picks in {category} · {data.length} items
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-md backdrop-blur transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleLeft />
            </button>

            <button
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-md backdrop-blur transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollElement}
          className="relative z-10 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="snap-start w-full min-w-[255px] max-w-[255px] sm:min-w-[280px] sm:max-w-[280px] md:min-w-[310px] md:max-w-[310px] overflow-hidden rounded-3xl border border-white/50 bg-white/65 shadow-lg backdrop-blur-md"
                >
                  <div className="flex min-h-[180px]">
                    <div className="w-[42%] bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                    <div className="flex-1 p-4 space-y-3">
                      <div className="h-4 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-8 rounded-full bg-slate-200 animate-pulse mt-3" />
                    </div>
                  </div>
                </div>
              ))
            : data.map((product) => {
                const discount = getDiscountPercent(
                  product?.price,
                  product?.sellingPrice
                );

                return (
                  <Link
                    key={product?._id}
                    to={`/product/${product?._id}`}
                    className="group snap-start w-full min-w-[255px] max-w-[255px] sm:min-w-[280px] sm:max-w-[280px] md:min-w-[310px] md:max-w-[310px] overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  >
                    <div className="flex min-h-[180px]">
                      {/* image */}
                      <div className="relative w-[42%] overflow-hidden bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 sm:p-4">
                        <div className="absolute left-2 top-2 flex flex-col gap-1">
                          <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow">
                            New
                          </span>

                          {discount > 0 && (
                            <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <img
                          src={product?.productImage?.[0]}
                          alt={product?.productName}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* content */}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] sm:text-xs font-medium text-amber-700">
                              <FaBolt />
                              Popular
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] sm:text-xs font-medium text-emerald-700">
                              <FaShieldHeart />
                              Assured
                            </span>
                          </div>

                          <h2 className="line-clamp-2 text-sm sm:text-base font-semibold leading-snug text-slate-800">
                            {product?.productName}
                          </h2>

                          <p className="mt-1 text-xs sm:text-sm capitalize text-slate-500">
                            {product?.category}
                          </p>

                          <p className="mt-2 text-[11px] sm:text-xs text-slate-500">
                            Fast delivery · Top rated choice
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <p className="text-sm sm:text-base font-bold text-rose-600">
                              {displayINRCurrency(product?.sellingPrice)}
                            </p>

                            {product?.price && (
                              <p className="text-xs sm:text-sm text-slate-400 line-through">
                                {displayINRCurrency(product?.price)}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product?._id)}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:from-rose-500 hover:to-pink-500"
                        >
                          <FaCartShopping className="text-xs" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Mobile hint / dots */}
        {!loading && data.length > 0 && (
          <div className="relative z-10 mt-4 flex items-center justify-center gap-2 md:hidden">
            {data.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full ${
                  index === 0 ? 'w-6 bg-rose-500' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;