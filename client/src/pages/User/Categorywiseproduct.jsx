import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecommendedProducts } from "../../redux/Productslice";
import Userproductcardverti from "../../components/User/Userproductcardverti";
import { ChevronRight, Filter, ChevronDown, PackageX, X, AlertCircle, Check } from "lucide-react";
import Button from "../../components/UI/Button";
import { Dropdown, DropdownItem } from "../../components/UI/Dropdown";

const Categorywiseproduct = () => {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { recommendedProducts, loading, error } = useSelector((state) => state.products);
    const [sortOption, setSortOption] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [availability, setAvailability] = useState("all"); // 'all', 'in-stock', 'out-of-stock'
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [localMinPrice, setLocalMinPrice] = useState("");
    const [localMaxPrice, setLocalMaxPrice] = useState("");

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }));
            // Reset filters on category change
            setAvailability("all");
            setMinPrice("");
            setMaxPrice("");
            setLocalMinPrice("");
            setLocalMaxPrice("");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [categoryId, dispatch]);

    const sortLabelMap = {
        all: "Default Sorting",
        "price-asc": "Price: Low to High",
        "price-desc": "Price: High to Low",
        "name-asc": "Name: A to Z",
        "name-desc": "Name: Z to A",
    };

    const handleApplyPrice = () => {
        setMinPrice(localMinPrice);
        setMaxPrice(localMaxPrice);
        setIsFilterOpen(false);
    };

    const filteredProducts = recommendedProducts.filter((product) => {
        const price = product.price - (product.price * (product.discount || 0)) / 100;
        const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);
        
        const isAvailable = (product.stock || 0) > 0;
        const matchesAvailability = 
            availability === "all" || 
            (availability === "in-stock" && isAvailable) || 
            (availability === "out-of-stock" && !isAvailable);

        return matchesMinPrice && matchesMaxPrice && matchesAvailability;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const getPrice = (p) => p.price - (p.price * (p.discount || 0)) / 100;
        if (sortOption === "price-asc") return getPrice(a) - getPrice(b);
        if (sortOption === "price-desc") return getPrice(b) - getPrice(a);
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        return 0;
    });

    const categoryName = recommendedProducts[0]?.category?.name || "Collection";

    // --- Loading State ---
    if (loading) return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-6 transition-premium">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-4 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
                <div className="h-20 w-full bg-slate-200 rounded-lg mb-8 animate-pulse"></div>
                <div className="flex gap-8">
                    <div className="hidden lg:block w-64 h-96 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] h-[320px] animate-pulse overflow-hidden">
                                <div className="h-48 bg-slate-200"></div>
                                <div className="p-3 space-y-3"><div className="h-3 bg-slate-200 rounded w-3/4"></div><div className="h-3 bg-slate-200 rounded w-1/2"></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Error State ---
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] p-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-10 text-center shadow-sm max-w-md w-full animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Unable to Load Collection</h2>
                <p className="text-[var(--text-muted)] text-sm mb-6">{error}</p>
                <Button variant="primary" onClick={() => dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }))} className="w-full py-2.5 rounded-lg font-medium text-sm">
                    Try Again
                </Button>
            </div>
        </div>
    );

    // --- Empty State ---
    if (!recommendedProducts.length) return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-6">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-12 text-center flex flex-col items-center shadow-sm max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-[var(--bg-section)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                        <PackageX size={28} />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>No Products Found</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-6 max-w-md">
                        We are currently restocking our {categoryName} collection. Please check back later or explore other categories.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/user/dashboard')} className="px-6 py-2.5 rounded-lg font-medium text-sm">
                        Explore Catalog
                    </Button>
                </div>
            </div>
        </div>
    );

    // --- Main Render ---
    return (
        <div className="bg-[var(--bg-body)] min-h-screen pb-16 pt-6" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-6">
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors" onClick={() => navigate('/user/dashboard')}>Home</span>
                    <ChevronRight size={10} className="mx-1.5 opacity-40" />
                    <span className="text-[var(--primary)]">{categoryName}</span>
                </nav>

                {/* Header (Aligned with Search/Checkout) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-light)] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-black text-[var(--text-main)] tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                            {categoryName}
                        </h1>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-medium uppercase tracking-wider">
                            Explore {recommendedProducts.length} curated items
                        </p>
                    </div>

                    {/* Desktop Sorting Dropdown */}
                    <div className="hidden md:flex items-center z-10">
                        <Dropdown
                            align="right"
                            trigger={
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border-light)] rounded-md hover:border-[var(--primary)] transition-colors cursor-pointer text-[10px] font-black uppercase tracking-widest group shadow-sm">
                                    <span className="text-[var(--text-muted)]">Sort:</span>
                                    <span className="text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                                        {sortLabelMap[sortOption].split(': ')[1] || sortLabelMap[sortOption]}
                                    </span>
                                    <ChevronDown size={12} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                                </div>
                            }
                        >
                            <DropdownItem onClick={() => setSortOption('all')} className="text-[11px] font-bold">DEFAULT</DropdownItem>
                            <DropdownItem onClick={() => setSortOption('price-asc')} className="text-[11px] font-bold">PRICE: LOW-HIGH</DropdownItem>
                            <DropdownItem onClick={() => setSortOption('price-desc')} className="text-[11px] font-bold">PRICE: HIGH-LOW</DropdownItem>
                            <DropdownItem onClick={() => setSortOption('name-asc')} className="text-[11px] font-bold">NAME: A-Z</DropdownItem>
                            <DropdownItem onClick={() => setSortOption('name-desc')} className="text-[11px] font-bold">NAME: Z-A</DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                {/* Layout: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    
                    {/* Left Sidebar (Proper Filters) */}
                    <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
                        
                        {/* Mobile Toggle Button */}
                        <div className="flex items-center justify-between lg:hidden mb-4">
                            <button 
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-md text-sm font-medium text-[var(--text-main)] shadow-sm w-full"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <Filter size={16} /> Filter Products
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className={`${isFilterOpen ? 'fixed inset-0 z-[100] bg-white p-6 overflow-y-auto animate-in slide-in-from-bottom-4' : 'hidden lg:block'} space-y-6`}>
                            
                            {/* Mobile Drawer Header */}
                            <div className="flex lg:hidden items-center justify-between mb-6 pb-4 border-b border-[var(--border-light)]">
                                <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-[var(--bg-section)] rounded-md text-[var(--text-muted)]">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile Only: Sorting (Since Desktop sort is in header) */}
                            <div className="lg:hidden space-y-3 pb-6 border-b border-[var(--border-light)]">
                                <h3 className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">Sort By</h3>
                                <Dropdown
                                    className="w-full"
                                    align="left"
                                    trigger={
                                        <div className="flex items-center justify-between w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-md text-sm shadow-sm">
                                            <span className="font-medium text-[var(--text-main)]">{sortLabelMap[sortOption]}</span>
                                            <ChevronDown size={16} className="text-[var(--text-muted)]" />
                                        </div>
                                    }
                                >
                                    <DropdownItem onClick={() => setSortOption('all')} className="text-sm">Default</DropdownItem>
                                    <DropdownItem onClick={() => setSortOption('price-asc')} className="text-sm">Price: Low to High</DropdownItem>
                                    <DropdownItem onClick={() => setSortOption('price-desc')} className="text-sm">Price: High to Low</DropdownItem>
                                    <DropdownItem onClick={() => setSortOption('name-asc')} className="text-sm">Name: A to Z</DropdownItem>
                                </Dropdown>
                            </div>

                            {/* Filter Section: Availability */}
                            <div className="space-y-3 pb-6 border-b border-[var(--border-light)]">
                                <h3 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest">Availability</h3>
                                <div className="space-y-2.5">
                                    <label 
                                        className="flex items-center gap-2.5 cursor-pointer group"
                                        onClick={() => setAvailability("in-stock")}
                                    >
                                        <div className={`w-4 h-4 rounded border ${availability === 'in-stock' ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-light)]'} group-hover:border-[var(--primary)] flex items-center justify-center transition-colors`}>
                                            {availability === 'in-stock' && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-medium ${availability === 'in-stock' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>In Stock</span>
                                    </label>
                                    <label 
                                        className="flex items-center gap-2.5 cursor-pointer group"
                                        onClick={() => setAvailability("all")}
                                    >
                                        <div className={`w-4 h-4 rounded border ${availability === 'all' ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-light)]'} group-hover:border-[var(--primary)] flex items-center justify-center transition-colors`}>
                                            {availability === 'all' && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-medium ${availability === 'all' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>All Items</span>
                                    </label>
                                </div>
                            </div>

                            {/* Filter Section: Price Range */}
                            <div className="space-y-3 pb-6 border-b border-[var(--border-light)]">
                                <h3 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[10px]">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            value={localMinPrice}
                                            onChange={(e) => setLocalMinPrice(e.target.value)}
                                            className="w-full pl-5 pr-2 py-1.5 text-xs border border-[var(--border-light)] rounded-md focus:outline-none focus:border-[var(--primary)] bg-[var(--bg-body)]" 
                                        />
                                    </div>
                                    <span className="text-[var(--text-muted)] text-xs">-</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[10px]">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={localMaxPrice}
                                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                                            className="w-full pl-5 pr-2 py-1.5 text-xs border border-[var(--border-light)] rounded-md focus:outline-none focus:border-[var(--primary)] bg-[var(--bg-body)]"
                                        />
                                    </div>
                                </div>
                                <Button 
                                    variant="orange" 
                                    onClick={handleApplyPrice}
                                    className="w-full py-2 mt-1 text-[10px] font-black uppercase tracking-widest text-white border-none rounded-md shadow-sm"
                                    style={{ background: 'var(--gradient-accent)' }}
                                >
                                    Apply Filter
                                </Button>
                            </div>

                            {/* Filter Section: Tags */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Trending', 'New', 'Exclusive', 'Sale'].map((tag, i) => (
                                        <span key={tag} className={`px-3 py-1 bg-[var(--bg-card)] border ${i === 0 ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border-light)] text-[var(--text-muted)]'} rounded-md text-xs font-medium hover:border-[var(--primary)] transition-colors cursor-pointer`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Clear Filters Button (Mobile mainly) */}
                            <div className="pt-4 lg:hidden">
                                <Button variant="primary" className="w-full py-2.5" onClick={() => setIsFilterOpen(false)}>
                                    Show {recommendedProducts.length} Results
                                </Button>
                            </div>

                        </div>
                    </div>

                    {/* Right Grid Layout */}
                    <div className="flex-1 w-full">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {sortedProducts.map((product, index) => (
                                    <div key={product._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 40}ms` }}>
                                        <Userproductcardverti product={product} showDetails={true} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-8 py-12 text-center flex flex-col items-center justify-center shadow-sm w-full animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-14 h-14 bg-[var(--bg-section)] rounded-full flex items-center justify-center text-[var(--border-light)] mb-4">
                                    <PackageX size={24} />
                                </div>
                                <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest mb-2">No items found</h3>
                                <p className="text-[var(--text-muted)] text-[11px] font-medium leading-relaxed max-w-xs mx-auto mb-6">
                                    We couldn't find any products in this collection matching your current filters. Try adjusting your price range or availability.
                                </p>
                                <Button 
                                    variant="orange" 
                                    onClick={() => {setMinPrice(""); setMaxPrice(""); setLocalMinPrice(""); setLocalMaxPrice(""); setAvailability("all");}} 
                                    className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-orange-500/10"
                                    style={{ background: 'var(--gradient-accent)' }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categorywiseproduct;