import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRecommendedProducts } from "../../redux/Productslice";
import Recommendproduct from "./Recommendproduct";
import toast from "react-hot-toast";
import { addToCart } from "../../redux/Cartslice";
import Button from "../UI/Button";
import { Card, CardBody } from "../UI/Card";
import { ShoppingBag, Zap, Share2, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const Productdetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentProduct: product, loading, error, recommendedProducts } = useSelector(
    (state) => state.products
  );
  const currentUserId = useSelector((state) => state.user.user?._id);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      dispatch(fetchRecommendedProducts({
        categoryId: product.category?._id,
        excludeId: product._id
      }));
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product && product.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      <p className="text-[var(--text-muted)] font-medium">Loading product details...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-[var(--danger)] font-bold text-xl">Error loading product</p>
      <p className="text-[var(--text-muted)]">{error}</p>
      <Button variant="outline" onClick={() => dispatch(fetchProductById(id))}>Try Again</Button>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-[var(--text-main)] font-bold text-xl">Product not found</p>
      <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color.");
      return;
    }

    try {
      const res = await dispatch(
        addToCart({
          userId: currentUserId,
          productId: product._id,
          selectedSize,
          selectedColor,
          quantity : 1,
        })
      ).unwrap();

      toast.success(res.message || "Added to cart successfully!");
    } catch (error) {
      toast.error(error)
    }
  };

  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-16 animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Image Section */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto hide-scrollbar pb-2 md:pb-0">
            {product.images?.map((img, i) => (
              <Card 
                key={i} 
                className={`flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 border-2 ${mainImage === img ? 'border-[var(--primary)] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setMainImage(img)}
              >
                <CardBody className="p-0">
                  <img
                    src={img}
                    className="w-16 h-16 md:w-24 md:h-24 object-cover"
                    alt={`Product view ${i + 1}`}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
          
          {/* Main Display */}
          <div className="flex-1 order-1 md:order-2">
            <Card className="h-full overflow-hidden bg-white border-[var(--border-light)] group relative">
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white text-[var(--text-main)]">
                  <Share2 size={18} />
                </Button>
                <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white text-[var(--danger)]">
                  <Heart size={18} />
                </Button>
              </div>
              <CardBody className="p-0 flex items-center justify-center bg-[#f9fafb] min-h-[400px] md:min-h-[550px]">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full max-h-[550px] object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Right: Product Info Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest rounded-full">{product.category?.name}</span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">In Stock ({product.stock})</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Out of Stock</span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 pt-2">
              <span className="text-4xl font-extrabold text-[var(--text-main)]">₹{discountPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-[var(--text-muted)] line-through mb-1">₹{product.price}</span>
                  <span className="mb-2 px-2 py-0.5 bg-[var(--danger)] text-white text-xs font-bold rounded-lg shadow-sm">{product.discount}% OFF</span>
                </>
              )}
            </div>
          </div>

          <p className="text-[var(--text-muted)] text-base leading-relaxed border-t border-b border-[var(--border-light)] py-6">
            {product.description}
          </p>

          {/* Configuration Selection */}
          <div className="space-y-8">
            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">Select Color</h4>
                   <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">{selectedColor || "None selected"}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-xl transition-all duration-300 ${
                        selectedColor === color ? 'rotate-12 scale-110 shadow-lg ring-2 ring-[var(--primary)] ring-offset-4' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">Select Size</h4>
                   <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">{selectedSize || "None selected"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-[var(--primary)] text-white shadow-xl scale-105 transform -translate-y-1"
                          : "bg-white border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10">
            <Button 
               variant="orange" 
               size="lg"
               className="flex-1 h-14 rounded-2xl text-base gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
               onClick={handleAddToCart}
            >
              <ShoppingBag size={22} strokeWidth={2.5} />
              Add to Shopping Bag
            </Button>
            <Button 
               variant="primary" 
               size="lg"
               className="flex-1 h-14 rounded-2xl text-base gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
            >
              <Zap size={22} fill="currentColor" />
              Quick Buy Now
            </Button>
          </div>

          {/* Features/Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10">
             <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Truck size={20} /></div>
                <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Free Express Delivery</p>
                <p className="text-[10px] text-[var(--text-muted)]">On orders over ₹999</p>
             </div>
             <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={20} /></div>
                <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Authentic Product</p>
                <p className="text-[10px] text-[var(--text-muted)]">100% Quality Guaranteed</p>
             </div>
             <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><RotateCcw size={20} /></div>
                <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Easy 30-Day Returns</p>
                <p className="text-[10px] text-[var(--text-muted)]">No questions asked</p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Products */}
      <div className="pt-20 border-t border-[var(--border-light)]">
        <Recommendproduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default Productdetails;
