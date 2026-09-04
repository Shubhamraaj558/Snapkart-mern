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
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm">
        <h3 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Sort By
        </h3>

        <form className="mt-2 space-y-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50">
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'asc'}
              onChange={handleOnChangeSortBy}
              value="asc"
            />
            <span className="text-sm text-slate-700">Low to High</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50">
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'dsc'}
              onChange={handleOnChangeSortBy}
              value="dsc"
            />
            <span className="text-sm text-slate-700">High to Low</span>
          </label>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Category
          </h3>

          {selectedCount > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
              {selectedCount}
            </span>
          )}
        </div>

        <form className="mt-2 space-y-2 text-sm">
          {productCategory.map((categoryName) => {
            const checked = !!selectCategory[categoryName?.value];

            return (
              <label
                key={categoryName?.value}
                htmlFor={categoryName?.value}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-2.5 py-2 transition ${
                  checked
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
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
                  <span className="text-sm">{categoryName?.label}</span>
                </div>

                {checked && <FaCheck className="text-[10px]" />}
              </label>
            );
          })}
        </form>
      </div>

      <button
        onClick={clearAllFilters}
        className="group relative w-full overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-r from-white via-rose-50 to-pink-50 py-3 text-sm font-semibold text-rose-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-pink-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="relative flex items-center justify-center gap-2">
          🧹 Clear All ✨
        </span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-rose-50">
      <div className="container mx-auto px-3 py-4 md:px-4 md:py-5">
        <div className="mb-4 rounded-2xl border border-white/60 bg-white/75 p-4 shadow-md backdrop-blur-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                <FaArrowDownWideShort />
                Smart Product Discovery
              </p>

              <h1 className="text-xl font-bold text-slate-800 md:text-2xl">
                Explore Products
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                Browse filtered collections with a cleaner shopping flow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:min-w-[220px]">
              <div className="rounded-xl bg-slate-900 px-3 py-3 text-white shadow-sm">
                <p className="text-[11px] text-slate-300">Results</p>
                <p className="text-xl font-bold">{data.length}</p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 text-slate-800 shadow-sm">
                <p className="text-[11px] text-slate-400">Filters</p>
                <p className="text-xl font-bold">{selectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <FaFilter />
            Filter & Sort
          </button>

          <div className="rounded-xl bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm">
            {data.length} products
          </div>
        </div>

        {(filterCategoryList.length > 0 || sortBy) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {filterCategoryList.map((item) => (
              <button
                key={item}
                onClick={() => removeSingleFilter(item)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-rose-200 hover:text-rose-600"
              >
                {item}
                <FaXmark className="text-[10px]" />
              </button>
            ))}

            {sortBy && (
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-600">
                {sortBy === 'asc' ? 'Low to High' : 'High to Low'}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px,minmax(0,1fr)] lg:h-[calc(100vh-170px)]">
          <div className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-110px)] overflow-y-auto pr-1">
              <FilterPanel />
            </div>
          </div>

          <div className="min-w-0 lg:h-[calc(100vh-170px)] lg:overflow-hidden">
            <div className="mb-3 flex items-center justify-between rounded-xl border border-white/60 bg-white/75 px-4 py-2.5 shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-slate-700">
                Search Results: <span className="font-bold">{data.length}</span>
              </p>

              <p className="hidden text-sm text-slate-500 sm:block">
                {selectedCount > 0
                  ? `${selectedCount} filters applied`
                  : 'All products'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/55 p-3 shadow-sm backdrop-blur-sm lg:h-[calc(100%-50px)] lg:overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {new Array(8).fill(null).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <div className="h-36 animate-pulse bg-slate-200" />
                      <div className="space-y-3 p-3">
                        <div className="h-4 rounded-full bg-slate-200 animate-pulse" />
                        <div className="h-3 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                        <div className="h-8 rounded-full bg-slate-200 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data.length > 0 ? (
                <VerticalCard data={data} loading={loading} />
              ) : (
                <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 text-center">
                  <div className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
                    No Results
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-800">
                    No products matched your filters
                  </h2>

                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Try removing some filters or changing sort to explore more products.
                  </p>

                  <button
                    onClick={clearAllFilters}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFilterOpen(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] rounded-t-[24px] bg-slate-50 p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Filter & Sort</h2>

                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                >
                  <FaXmark />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto pr-1">
                <FilterPanel />
              </div>

              <div className="mt-4 bg-slate-50 pt-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md"
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