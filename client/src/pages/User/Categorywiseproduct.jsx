import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRecommendedProducts } from "../../redux/Productslice";
import Userproductcardverti from "../../components/Userproductcardverti";

const Categorywiseproduct = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const { recommendedProducts, loading, error } = useSelector((state) => state.products);
  const [sortOption, setSortOption] = useState("all");

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }));
    }
  }, [categoryId, dispatch]);

  const sortedProducts = [...recommendedProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!recommendedProducts.length)
    return <p className="text-center mt-10 text-gray-600">No products found for this category.</p>;

  const categoryName = recommendedProducts[0]?.category?.name || "Category";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">{categoryName}</h1>

        <div className="flex items-center space-x-3">
          <label htmlFor="sort" className="text-gray-700 font-semibold">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="all">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Userproductcardverti key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Categorywiseproduct;
