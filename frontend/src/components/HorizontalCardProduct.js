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
    scrollElement.current.scrollLeft += 280;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 280;
  };

  const getDiscountPercent = (price, sellingPrice) => {
    if (!price || !sellingPrice || price <= sellingPrice) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  return (
    <div className="container mx-auto px-3 my-5 text-xs sm:text-sm">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-white to-rose-100 px-3 py-4 sm:px-4 sm:py-5 md:px-5">
        
        {/* background glow */}
        <div className="pointer-events-none absolute -top-10 left-0 h-32 w-32 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-orange-300/20 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-rose-600 shadow-xs backdrop-blur border border-rose-100">
              <FaBolt size={10} />
              Trending Collection
            </div>

            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight">
              {heading}
            </h2>

            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600 font-light">
              Fresh picks in <span className="capitalize font-medium">{category}</span> · {data.length} items
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleLeft size={12} />
            </button>

            <button
              onClick={scrollRight}
              aria-label="Scroll Right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleRight size={12} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollElement}
          className="relative z-10 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-2 pt-1"
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="snap-start w-full min-w-[230px] max-w-[230px] sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px] overflow-hidden rounded-2xl border border-white/50 bg-white/65 shadow-md backdrop-blur-md"
                >
                  <div className="flex min-h-[150px]">
                    <div className="w-[42%] bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                    <div className="flex-1 p-3 space-y-2.5">
                      <div className="h-3.5 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-7 rounded-full bg-slate-200 animate-pulse mt-2" />
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
                    className="group snap-start w-full min-w-[230px] max-w-[230px] sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px] overflow-hidden rounded-2xl border border-white/50 bg-white/75 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex min-h-[150px]">
                      {/* image */}
                      <div className="relative w-[42%] overflow-hidden bg-gradient-to-br from-white via-rose-50/50 to-pink-50/50 p-2.5 sm:p-3 flex items-center justify-center">
                        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
                          <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            New
                          </span>

                          {discount > 0 && (
                            <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <img
                          src={product?.productImage?.[0]}
                          alt={product?.productName}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* content */}
                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200/50">
                              <FaBolt size={8} />
                              Popular
                            </span>

                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                              <FaShieldHeart size={8} />
                              Assured
                            </span>
                          </div>

                          <h2 className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-slate-800 min-h-[32px]">
                            {product?.productName}
                          </h2>

                          <p className="mt-0.5 text-[10px] sm:text-[11px] capitalize text-slate-500 font-light">
                            {product?.category}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <p className="text-xs sm:text-sm font-black text-rose-600">
                              {displayINRCurrency(product?.sellingPrice)}
                            </p>

                            {product?.price && (
                              <p className="text-[10px] sm:text-xs text-slate-400 line-through">
                                {displayINRCurrency(product?.price)}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product?._id)}
                          className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white transition hover:from-rose-500 hover:to-pink-500 shadow-xs"
                        >
                          <FaCartShopping size={11} />
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
          <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5 md:hidden">
            {data.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === 0 ? 'w-5 bg-rose-500' : 'w-1.5 bg-slate-300'
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