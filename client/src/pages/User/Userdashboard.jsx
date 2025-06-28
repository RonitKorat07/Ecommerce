import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/Categoryslice";
import { fetchProducts } from "../../redux/Productslice";
import { useNavigate } from "react-router-dom";
import Userproductcardverti from "../../components/Userproductcardverti";
import UserProductCardHoriz from "../../components/Userproductcardhoriz";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
        left: direction * 1200,
        behavior: "smooth",
      });
    }
  };

  // Common button className for scroll buttons
  const buttonClassName =
    "absolute top-14 sm:top-24 bg-gray-200 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 flex items-center justify-center cursor-pointer z-10 ";

  return (
    <div className="p-4 space-y-10">
      {/* Categories */}
      <section>
        <div className="flex gap-6 overflow-x-auto py-2 justify-around px-1">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/user/category/${cat._id}`)}
              className="flex flex-col items-center min-w-[80px] cursor-pointer hover:scale-105"
            >
              <div className="w-25 h-25 rounded-full bg-gray-200 shadow overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-1 text-sm text-center">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="w-full h-72 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center text-white text-3xl font-bold">
        Welcome to Ronit's Store
      </section>

      {/* Top Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <div className="relative">
          <button
            onClick={() => scrollContainer(topProductsRef, -1)}
            className={buttonClassName + " left-2"}
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-3 h-3 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => scrollContainer(topProductsRef, 1)}
            className={buttonClassName + " right-2"}
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-3 h-3 sm:w-6 sm:h-6" />
          </button>

          <div
            className="flex gap-4 overflow-x-auto hide-scrollbar p-2 scroll-smooth"
            ref={topProductsRef}
            style={{ scrollBehavior: "smooth" }}
          >
            {topProducts.map((product) => (
              <UserProductCardHoriz key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Discount Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          10% – 25% Discount
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products
            .filter((pro) => pro.discount >= 10 && pro.discount <= 25)
            .slice(0, 8)
            .map((pro) => (
              <Userproductcardverti key={pro._id} product={pro} />
            ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">New Arrivals</h2>
        <div className="relative">
          <button
            onClick={() => scrollContainer(newArrivalsRef, -1)}
            className={buttonClassName + " left-2"}
            // aria-label="Scroll left"
          >
            <FiChevronLeft  className="w-3 h-3 sm:w-6 sm:h-6"/>
          </button>
          <button
            onClick={() => scrollContainer(newArrivalsRef, 1)}
            className={buttonClassName + " right-2"}
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-3 h-3 sm:w-6 sm:h-6 " />
          </button>
          <div
            className="flex gap-4 overflow-x-auto hide-scrollbar p-2 scroll-smooth"
            ref={newArrivalsRef}
            style={{ scrollBehavior: "smooth" }}
          >
            
            {newArrivals.map((product) => (
              <UserProductCardHoriz key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
