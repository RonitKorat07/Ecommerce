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
      <section className="pt-6 pb-2 w-full">
        <div className="max-w-[1400px] mx-auto">
          {/* Add px-4 lg:px-8 here but keep the scroll track bleeding to edges if we want, or just pad it here */}
          <div className="flex gap-8 md:gap-12 overflow-x-auto py-6 hide-scrollbar scroll-smooth justify-start lg:justify-center items-center px-4 lg:px-8 w-full">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/user/category/${cat._id}`)}
                className="flex flex-col items-center gap-3 min-w-[70px] cursor-pointer transition-all group flex-shrink-0"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[var(--primary)] shadow-[0_4px_15px_rgb(0,0,0,0.05)] group-hover:shadow-[0_8px_25px_rgb(0,0,0,0.1)] bg-white transition-all duration-300 transform group-hover:-translate-y-1">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-[13px] font-bold text-slate-600 group-hover:text-[var(--primary)] transition-colors text-center tracking-wide">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-16">
        {/* Refined Hero Banner */}
        <section className="relative group overflow-hidden rounded-[2rem] h-[220px] md:h-[300px] lg:h-[340px] shadow-2xl transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")',
              backgroundPosition: 'center 40%',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-center p-6 pl-8 md:p-10 md:pl-12 lg:p-12 lg:pl-16 text-white w-full md:w-3/4 lg:w-2/3">
            <div className="animate-in slide-in-from-left-8 duration-700 space-y-2.5 md:space-y-3">
              <span className="inline-flex items-center gap-2 bg-[var(--accent)]/15 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)]/30 shadow-sm w-max">
                <Sparkles size={10} className="text-[var(--accent)]" /> Premium Collection
              </span>
              
              <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter drop-shadow-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Elevate Your <br className="hidden md:block"/>
                <span className="text-[var(--accent)]">Signature Style</span>
              </h1>
              
              <p className="text-[10px] md:text-xs text-white/80 max-w-[360px] mb-3 font-medium leading-relaxed">
                Step into the new season with our exclusive curation of modern cuts and luxury fabrics.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-1">
                <Button className="rounded-lg px-5 h-8 md:h-9 shadow-lg text-white border-none bg-[var(--accent)] hover:bg-[var(--accent-dark)] font-black text-[9px] tracking-widest uppercase">
                   Men
                </Button>
                <Button className="rounded-lg px-5 h-8 md:h-9 shadow-md text-white border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-md font-black text-[9px] tracking-widest uppercase">
                   Women
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Top Products Slider */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[var(--primary-light)] rounded-lg text-[var(--primary)]">
                <TrendingUp size={16} />
              </div>
              <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
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
              <UserProductCardHoriz key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Discount Grid */}
        <section className="space-y-8">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-100 rounded-lg text-[var(--danger)]">
              <Percent size={16} />
            </div>
            <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
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
              <UserProductCardHoriz key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
