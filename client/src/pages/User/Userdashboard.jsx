import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/Categoryslice";
import { fetchProducts } from "../../redux/Productslice";
import { useNavigate } from "react-router-dom";
import Userproductcardverti from "../../components/User/Userproductcardverti";
import UserProductCardHoriz from "../../components/User/Userproductcardhoriz";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Percent } from "lucide-react";
import Button from "../../components/UI/Button";
import { Card, CardBody } from "../../components/UI/Card";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: categories } = useSelector((state) => state.category);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Simple logic for Top Products and New Arrivals
  const topProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);

  const topProductsRef = useRef(null);
  const newArrivalsRef = useRef(null);

  const scrollContainer = (ref, direction = 1) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction * 500,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-20 space-y-12 animate-in fade-in duration-700">
      {/* Categories Bar */}
      <section className="bg-white border-b border-[var(--border-light)] sticky top-[64px] z-40  shadow-sm overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4 hide-scrollbar justify-start md:justify-center items-center">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/user/category/${cat._id}`)}
                className="flex flex-col items-center min-w-[70px] cursor-pointer group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--bg-body)] p-1 border-2 border-transparent group-hover:border-[var(--primary)] transition-all transform group-hover:scale-105 group-hover:shadow-md overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <p className="mt-2 text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--primary)] uppercase tracking-tighter transition-colors">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <section className="relative group overflow-hidden rounded-3xl h-[300px] md:h-[450px] shadow-2xl transition-all hover:scale-[1.005]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: 'var(--gradient-hero)',
              opacity: 0.95
            }}
          ></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8 text-white space-y-6">
            <div className="animate-in slide-in-from-bottom-8 duration-700">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={14} /> New Season Collection
              </span>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Elevate Your <span className="text-[var(--accent)]">Style</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto mb-8 font-medium">
                Discover the latest trends in high-quality fashion and accessories.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="orange" size="lg" className="rounded-2xl px-8 shadow-xl">
                  Shop All Products
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl border-white text-white hover:bg-white/10 px-8 shadow-xl">
                  View Collections
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Top Products Slider */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--primary-light)] rounded-xl text-[var(--primary)]">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Best <span className="text-[var(--primary)]">Sellers</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-xl"
                onClick={() => scrollContainer(topProductsRef, -1)}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-xl"
                onClick={() => scrollContainer(topProductsRef, 1)}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div
            className="flex gap-6 overflow-x-auto hide-scrollbar py-4 px-2 -mx-2 scroll-smooth"
            ref={topProductsRef}
          >
            {topProducts.map((product) => (
              <div key={product._id} className="min-w-[280px] md:min-w-[320px]">
                <UserProductCardHoriz product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Discount Grid */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-[var(--danger)]">
              <Percent size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Flash <span className="text-[var(--danger)]">Deals</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products
              .filter((pro) => pro.discount >= 10 && pro.discount <= 25)
              .slice(0, 10)
              .map((pro) => (
                <Userproductcardverti key={pro._id} product={pro} />
              ))}
          </div>
        </section>

        {/* New Arrivals Slider */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
                New <span className="text-amber-600">Arrivals</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-xl"
                onClick={() => scrollContainer(newArrivalsRef, -1)}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-xl"
                onClick={() => scrollContainer(newArrivalsRef, 1)}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div
            className="flex gap-6 overflow-x-auto hide-scrollbar py-4 px-2 -mx-2 scroll-smooth"
            ref={newArrivalsRef}
          >
            {newArrivals.map((product) => (
              <div key={product._id} className="min-w-[280px] md:min-w-[320px]">
                <UserProductCardHoriz product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
