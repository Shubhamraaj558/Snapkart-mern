import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf, FaHeart } from 'react-icons/fa';
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    description: '',
    price: '',
    sellingPrice: '',
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  // 🔥 NEW REF (zoom fix)
  const imageContainerRef = useRef(null);

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: params?.id }),
    });
    setLoading(false);
    const dataResponse = await response.json();

    setData(dataResponse?.data);
    setActiveImage(dataResponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  // 🔥 FIXED ZOOM FUNCTION
  console.log("activeImage:", activeImage);
  const handleZoomImage = useCallback((e) => {
    if (!imageContainerRef.current) return;

    setZoomImage(true);

    const rect = imageContainerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate('/cart');
  };

  // ❤️ WISHLIST FUNCTION
  const handleAddToWishlist = async () => {
    try {
      const res = await fetch(SummaryApi.addWishlist.url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId: data._id }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Added to wishlist ❤️');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-25 to-pink-50">
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <div className="min-h-[180px] flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* IMAGE SECTION */}
          <div className="h-auto flex flex-col lg:flex-row-reverse gap-3 lg:gap-5">
            
            {/* 🔥 REF ADDED HERE (NO UI CHANGE) */}
            <div
              ref={imageContainerRef}
              className="h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] lg:h-[320px] lg:w-[320px] relative bg-gradient-to-br from-white via-slate-50 to-rose-50 rounded-3xl p-4 shadow-2xl border border-white/50 backdrop-blur-sm"
            >
              <img
                src={activeImage}
                className="h-full w-full object-contain mix-blend-multiply cursor-zoom-in rounded-2xl"
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
              />

              {zoomImage && activeImage && (
                <div className="absolute right-[-520px] top-0 w-[500px] h-[400px] bg-white border shadow-2xl rounded-2xl overflow-hidden z-[9999]">

                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("${activeImage}")`, // 🔥 IMPORTANT FIX
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "180% 180%",
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                    }}
                  />

                </div>
              )}
            </div>

            <div className="h-full flex gap-2 lg:flex-col overflow-scroll scrollbar-none lg:overflow-auto">
              {data?.productImage?.map((imgURL, index) => (
                <div
                  className="h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-br from-white via-slate-50 to-rose-50 rounded-xl p-1 shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-200 hover:scale-105"
                  key={imgURL}
                >
                  <img
                    src={imgURL}
                    className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90"
                    onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                    onClick={() => handleMouseEnterProduct(imgURL)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <div>
              <p className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 via-pink-100 to-orange-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {data?.brandName}
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-800 via-slate-900 to-slate-700 bg-clip-text text-transparent mt-2">
                {data?.productName}
              </h2>
              <p className="text-slate-500 font-medium mt-1">{data?.category}</p>
            </div>

            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
              <span className="text-slate-600 font-medium">4.8 (1.2k reviews)</span>
            </div>

            <div className="flex items-center gap-4 text-xl sm:text-2xl lg:text-3xl font-black">
              <p className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                {displayINRCurrency(data.sellingPrice)}
              </p>
              {data?.price && (
                <p className="text-xl text-slate-400 line-through">
                  {displayINRCurrency(data.price)}
                </p>
              )}
            </div>

            {/* 🔥 PREMIUM BUTTONS (UNCHANGED) */}
            <div className="flex flex-col sm:flex-row gap-3 my-4 flex-wrap">
              <button
                onClick={(e) => handleBuyProduct(e, data?._id)}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 active:scale-95 min-w-[140px]"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300" />
                <span className=" px-3 py-1.5 text-sm sm:text-base relative z-10 flex items-center justify-center gap-2">
                  🛒 Buy Now
                </span>
              </button>

              <button
                onClick={(e) => handleAddToCart(e, data?._id)}
                className="group relative rounded-3xl border-2 border-slate-900 bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-500 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 hover:shadow-2xl active:scale-95 min-w-[140px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  🛒 Add to Cart
                </span>
              </button>

              <button
                onClick={handleAddToWishlist}
                className="group flex items-center justify-center gap-2 rounded-3xl border-2 border-pink-500/60 bg-gradient-to-r from-pink-50/50 to-rose-50/50 px-6 py-4 text-lg font-semibold text-pink-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-xl active:scale-95"
              >
                <FaHeart className="text-xl group-hover:scale-110 transition-transform duration-200" />
                <span>Wishlist</span>
              </button>
            </div>

            <div className="bg-rose-100 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-white/50">
              <p className="text-lg font-bold underline italic text-slate-800 mb-3"> 🧾Product Description :</p>
              <p className="text-slate-600 leading-6 whitespace-pre-line">{data?.description}</p>
            </div>
          </div>
        </div>

        {/* RECOMMENDED */}
        {data.category && (
          <div className="mt-16">
            <CategroyWiseProductDisplay
              category={data?.category}
              heading="Recommended Products"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;