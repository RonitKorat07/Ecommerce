import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecommendedProducts } from "../../redux/Productslice";
import Userproductcardverti from "../../components/User/Userproductcardverti";
import { ChevronRight, Filter, SortAsc, LayoutGrid, Search } from "lucide-react";
import Button from "../../components/UI/Button";
import { Card, CardBody } from "../../components/UI/Card";

const Categorywiseproduct = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { recommendedProducts, loading, error } = useSelector((state) => state.products);
  const [sortOption, setSortOption] = useState("all");

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [categoryId, dispatch]);

  const sortedProducts = [...recommendedProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      <p className="text-[var(--text-muted)] font-medium">Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-[var(--danger)] font-bold text-xl">Error loading category</p>
      <p className="text-[var(--text-muted)]">{error}</p>
      <Button variant="outline" onClick={() => dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }))}>Try Again</Button>
    </div>
  );

  if (!recommendedProducts.length) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="p-6 bg-white rounded-full shadow-inner">
        <Search size={48} className="text-[var(--border-light)]" strokeWidth={1} />
      </div>
      <p className="text-[var(--text-main)] font-bold text-xl">No products found for this category</p>
      <Button variant="primary" onClick={() => navigate('/user/dashboard')}>Explore Other Categories</Button>
    </div>
  );

  const categoryName = recommendedProducts[0]?.category?.name || "Category";

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Breadcrumb & Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          <span className="hover:text-[var(--primary)] cursor-pointer" onClick={() => navigate('/user/dashboard')}>Home</span>
          <ChevronRight size={12} />
          <span className="text-[var(--primary)]">{categoryName}</span>
        </div>

        <Card className="overflow-hidden border-none shadow-xl bg-white">
          <CardBody className="p-0">
            <div className="bg-[var(--gradient-hero)] h-32 md:h-48 flex items-center px-8 md:px-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex flex-col gap-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {categoryName}
                </h1>
                <p className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
                  Explore the best of {categoryName} curated just for you.
                </p>
              </div>
              <LayoutGrid size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
            </div>

            <div className="px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[var(--border-light)]">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-[var(--bg-body)] rounded-xl border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)]">
                  {recommendedProducts.length} Items Found
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <SortAsc size={14} />
                  </div>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full md:w-48 pl-10 pr-4 py-3 bg-[var(--bg-body)] border border-[var(--border-light)] rounded-xl text-xs font-bold text-[var(--text-main)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all cursor-pointer"
                  >
                    <option value="all">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                <Button variant="ghost" className="w-12 h-12 p-0 rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] text-[var(--text-main)]">
                  <Filter size={18} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {sortedProducts.map((product) => (
          <Userproductcardverti key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Categorywiseproduct;

