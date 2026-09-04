import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

const CategroyWiseProductDisplay = ({ category, heading }) => {
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
    fetchData();
  }, [category]);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += 320;
    }
  };

  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= 320;
    }
  };

  return (
    <section className="container mx-auto px-4 my-8 md:my-10">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            {heading}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore top picks in {heading}
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleLeft className="mx-auto" />
          </button>
          <button
            onClick={scrollRight}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleRight className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Product row */}
      <div
        ref={scrollElement}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-2"
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="min-w-[220px] max-w-[220px] sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="h-44 sm:h-48 bg-slate-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-1/3 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-4 w-20 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-4 w-16 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                  <div className="h-9 w-full rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                key={product?._id}
                to={`/product/${product?._id}`}
                onClick={scrollTop}
                className="group min-w-[220px] max-w-[220px] sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative flex h-44 sm:h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 p-4">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-110"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm">
                    {product?.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="line-clamp-1 text-base md:text-lg font-semibold text-slate-800">
                    {product?.productName}
                  </h2>

                  <p className="mt-1 text-sm capitalize text-slate-500">
                    Premium quality • {product?.category}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-base font-bold text-red-600">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-sm text-slate-400 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>

                  <button
                    className="mt-4 w-full rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>

      {/* Mobile arrows */}
      {!loading && data.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
          <button
            onClick={scrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={scrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default CategroyWiseProductDisplay;