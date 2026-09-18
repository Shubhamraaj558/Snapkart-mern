import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import {
  FaFilter,
  FaXmark,
  FaCheck,
  FaArrowDownWideShort,
} from 'react-icons/fa6';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll('category');

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          category: filterCategoryList,
        }),
      });

      const dataResponse = await response.json();
      let result = dataResponse?.data || [];

      if (sortBy === 'asc') {
        result = [...result].sort((a, b) => a.sellingPrice - b.sellingPrice);
      }

      if (sortBy === 'dsc') {
        result = [...result].sort((a, b) => b.sellingPrice - a.sellingPrice);
      }

      setData(result);
    } catch (error) {
      console.log('filter product error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter(Boolean);

    setFilterCategoryList(arrayOfCategory);

    const query = new URLSearchParams();
    arrayOfCategory.forEach((el) => query.append('category', el));

    navigate(`/product-category?${query.toString()}`, { replace: true });
  }, [selectCategory, navigate]);

  useEffect(() => {
    fetchData();
  }, [filterCategoryList, sortBy]);

  const handleOnChangeSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectCategory({});
    setSortBy('');
  };

  const removeSingleFilter = (value) => {
    setSelectCategory((prev) => ({
      ...prev,
      [value]: false,
    }));
  };

  const selectedCount = useMemo(() => {
    return Object.values(selectCategory).filter(Boolean).length;
  }, [selectCategory]);

  const FilterPanel = () => (
    <div className="space-y-3 text-xs">
      <div className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm">
        <h3 className="border-b border-slate-200 pb-1.5 font-bold uppercase tracking-wide text-slate-500 text-[11px]">
          Sort By
        </h3>

        <form className="mt-1.5 space-y-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'asc'}
              onChange={handleOnChangeSortBy}
              value="asc"
            />
            <span className="text-slate-700">Low to High</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'dsc'}
              onChange={handleOnChangeSortBy}
              value="dsc"
            />
            <span className="text-slate-700">High to Low</span>
          </label>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <h3 className="font-bold uppercase tracking-wide text-slate-500 text-[11px]">
            Category
          </h3>

          {selectedCount > 0 && (
            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold text-rose-600">
              {selectedCount}
            </span>
          )}
        </div>

        <form className="mt-1.5 space-y-1 max-h-48 overflow-y-auto pr-1">
          {productCategory.map((categoryName) => {
            const checked = !!selectCategory[categoryName?.value];

            return (
              <label
                key={categoryName?.value}
                htmlFor={categoryName?.value}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-2 py-1.5 transition ${
                  checked
                    ? 'border-rose-200 bg-rose-50 text-rose-600 font-medium'
                    : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="category"
                    checked={checked}
                    value={categoryName?.value}
                    id={categoryName?.value}
                    onChange={handleSelectCategory}
                  />
                  <span>{categoryName?.label}</span>
                </div>

                {checked && <FaCheck className="text-[9px]" />}
              </label>
            );
          })}
        </form>
      </div>

      <button
        onClick={clearAllFilters}
        className="w-full rounded-xl border border-rose-200/70 bg-gradient-to-r from-white via-rose-50 to-pink-50 py-2 font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 text-xs"
      >
        🧹 Clear All ✨
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-rose-50 text-xs sm:text-sm">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
        
        {/* Top Header Card */}
        <div className="mb-3 rounded-xl border border-white/60 bg-white/75 p-3 shadow-sm backdrop-blur-sm md:p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                <FaArrowDownWideShort />
                Smart Product Discovery
              </p>
              <h1 className="text-lg font-bold text-slate-800 md:text-xl">
                Explore Products
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-2 md:min-w-[180px]">
              <div className="rounded-lg bg-slate-900 px-2.5 py-2 text-white shadow-sm">
                <p className="text-[10px] text-slate-300">Results</p>
                <p className="text-base font-bold">{data.length}</p>
              </div>

              <div className="rounded-lg bg-white px-2.5 py-2 text-slate-800 shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-400">Filters</p>
                <p className="text-base font-bold">{selectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="mb-2 flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm"
          >
            <FaFilter />
            Filter & Sort
          </button>
          <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-600 shadow-sm border border-slate-100">
            {data.length} products
          </div>
        </div>

        {/* Active Filters Badges */}
        {(filterCategoryList.length > 0 || sortBy) && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {filterCategoryList.map((item) => (
              <button
                key={item}
                onClick={() => removeSingleFilter(item)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:border-rose-200 hover:text-rose-600"
              >
                {item}
                <FaXmark className="text-[9px]" />
              </button>
            ))}

            {sortBy && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-medium text-rose-600">
                {sortBy === 'asc' ? 'Low to High' : 'High to Low'}
              </span>
            )}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px,minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-16 max-h-[calc(100vh-90px)] overflow-y-auto pr-1">
              <FilterPanel />
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-xl border border-white/60 bg-white/50 p-2.5 shadow-sm backdrop-blur-sm">
              {loading ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                  {new Array(8).fill(null).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100"
                    >
                      <div className="h-28 animate-pulse bg-slate-200" />
                      <div className="space-y-2 p-2.5">
                        <div className="h-3 rounded-full bg-slate-200 animate-pulse" />
                        <div className="h-2.5 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                        <div className="h-6 rounded-full bg-slate-200 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data.length > 0 ? (
                <VerticalCard data={data} loading={loading} />
              ) : (
                <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 text-center">
                  <div className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                    No Results
                  </div>
                  <h2 className="mt-3 text-base font-bold text-slate-800">
                    No products matched your filters
                  </h2>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Try removing some filters or changing sort to explore more products.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-slate-50 p-3 shadow-2xl flex flex-col">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-sm font-bold text-slate-800">Filter & Sort</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm border border-slate-200"
                >
                  <FaXmark className="text-xs" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <FilterPanel />
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-md"
                >
                  Show {data.length} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;