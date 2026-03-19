import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecommendedProducts } from "../../redux/Productslice";
import Userproductcardverti from "../../components/User/Userproductcardverti";
import { ChevronRight, ChevronDown, PackageX, Filter, X, Check, AlertCircle, SlidersHorizontal } from "lucide-react";
import Button from "../../components/UI/Button";
import { Dropdown, DropdownItem } from "../../components/UI/Dropdown";

const Categorywiseproduct = () => {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { recommendedProducts, loading, error } = useSelector((state) => state.products);
    const [sortOption, setSortOption] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [availability, setAvailability] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [localMinPrice, setLocalMinPrice] = useState("");
    const [localMaxPrice, setLocalMaxPrice] = useState("");

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }));
            setAvailability("all");
            setMinPrice(""); setMaxPrice("");
            setLocalMinPrice(""); setLocalMaxPrice("");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [categoryId, dispatch]);

    const handleApplyPrice = () => {
        setMinPrice(localMinPrice);
        setMaxPrice(localMaxPrice);
        setIsFilterOpen(false);
    };

    const filteredProducts = recommendedProducts.filter((product) => {
        const price = product.price - (product.price * (product.discount || 0)) / 100;
        const matchesMin = minPrice === "" || price >= Number(minPrice);
        const matchesMax = maxPrice === "" || price <= Number(maxPrice);
        const isAvailable = (product.stock || 0) > 0;
        const matchesAvail =
            availability === "all" ||
            (availability === "in-stock" && isAvailable) ||
            (availability === "out-of-stock" && !isAvailable);
        return matchesMin && matchesMax && matchesAvail;
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

    const sortLabels = {
        all: "Default",
        "price-asc": "Price: Low",
        "price-desc": "Price: High",
        "name-asc": "A → Z",
        "name-desc": "Z → A",
    };

    // --- Error State ---
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] p-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-10 text-center shadow-sm max-w-sm w-full">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={22} />
                </div>
                <h2 className="text-base font-black text-[var(--text-main)] mb-1">Failed to Load</h2>
                <p className="text-xs text-[var(--text-muted)] mb-5">{error}</p>
                <Button variant="primary" onClick={() => dispatch(fetchRecommendedProducts({ categoryId, excludeId: "" }))} className="w-full py-2 text-xs font-bold">
                    Try Again
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-5" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--text-muted)] mb-5">
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors" onClick={() => navigate('/user/dashboard')}>Home</span>
                    <ChevronRight size={10} className="opacity-40" />
                    <span className="text-[var(--primary)]">{categoryName}</span>
                </nav>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[var(--border-light)]">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                            {loading ? "Loading..." : categoryName}
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                            {loading ? "Fetching products..." : `${filteredProducts.length} products in collection`}
                        </p>
                    </div>

                    {!loading && recommendedProducts.length > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[var(--border-light)] rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
                            >
                                <SlidersHorizontal size={13} />
                                Filter
                            </button>
                            <Dropdown
                                align="right"
                                trigger={
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--border-light)] rounded-lg hover:border-[var(--primary)] transition-all cursor-pointer group shadow-sm">
                                        <ChevronDown size={13} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                                        <span className="text-xs font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors whitespace-nowrap">{sortLabels[sortOption]}</span>
                                    </div>
                                }
                            >
                                <div className="px-3 py-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-light)]">Sort By</div>
                                <DropdownItem onClick={() => setSortOption('all')} className="text-xs py-2.5">Default</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('price-asc')} className="text-xs py-2.5">Price: Low to High</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('price-desc')} className="text-xs py-2.5">Price: High to Low</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('name-asc')} className="text-xs py-2.5">Name: A to Z</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('name-desc')} className="text-xs py-2.5">Name: Z to A</DropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </div>

                {/* Content: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Filter Sidebar */}
                    {!loading && recommendedProducts.length > 0 && (
                        <div className="w-full lg:w-44 shrink-0 lg:sticky lg:top-24">
                            <div className={`${isFilterOpen ? 'fixed inset-0 z-[100] bg-white p-5 overflow-y-auto shadow-2xl' : 'hidden lg:block'} space-y-5`}>

                                {/* Mobile Header */}
                                <div className="flex lg:hidden items-center justify-between pb-3 border-b border-[var(--border-light)]">
                                    <h2 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wide">Filters</h2>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-1.5 bg-[var(--bg-section)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--border-light)] transition-colors">
                                        <X size={15} />
                                    </button>
                                </div>

                                {/* Availability */}
                                <div className="space-y-2.5 pb-5 border-b border-[var(--border-light)]">
                                    <h3 className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Availability</h3>
                                    <div className="space-y-1.5">
                                        {[{ label: 'All Items', val: 'all' }, { label: 'In Stock', val: 'in-stock' }, { label: 'Out of Stock', val: 'out-of-stock' }].map(opt => (
                                            <label key={opt.val} onClick={() => setAvailability(opt.val)} className="flex items-center gap-2 cursor-pointer group">
                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${availability === opt.val ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-light)] group-hover:border-[var(--primary)]'}`}>
                                                    {availability === opt.val && <Check size={8} className="text-white" />}
                                                </div>
                                                <span className={`text-[11px] font-medium ${availability === opt.val ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-muted)]'}`}>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-2.5">
                                    <h3 className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Price Range</h3>
                                    <div className="flex gap-1.5">
                                        <input type="number" placeholder="Min" value={localMinPrice} onChange={e => setLocalMinPrice(e.target.value)}
                                            className="w-full px-2 py-1.5 text-[11px] border border-[var(--border-light)] rounded-lg focus:border-[var(--primary)] outline-none bg-[var(--bg-body)]" />
                                        <span className="text-[var(--text-muted)] text-xs self-center">—</span>
                                        <input type="number" placeholder="Max" value={localMaxPrice} onChange={e => setLocalMaxPrice(e.target.value)}
                                            className="w-full px-2 py-1.5 text-[11px] border border-[var(--border-light)] rounded-lg focus:border-[var(--primary)] outline-none bg-[var(--bg-body)]" />
                                    </div>
                                    <button onClick={handleApplyPrice}
                                        className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide text-white transition-all active:scale-95"
                                        style={{ background: 'var(--gradient-primary)' }}>
                                        Apply
                                    </button>
                                </div>

                                {/* Mobile CTA */}
                                <div className="lg:hidden pt-2">
                                    <Button variant="primary" className="w-full py-2.5 text-xs font-bold" onClick={() => setIsFilterOpen(false)}>
                                        Show {filteredProducts.length} Results
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1 w-full">
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                {Array(10).fill(0).map((_, n) => (
                                    <div key={n} className="bg-white rounded-xl border border-[var(--border-light)] h-[260px] animate-pulse">
                                        <div className="h-44 bg-slate-100 rounded-t-xl" />
                                        <div className="p-3 space-y-2">
                                            <div className="h-2.5 bg-slate-100 rounded w-3/4" />
                                            <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                {sortedProducts.map((product, index) => (
                                    <div key={product._id} className="animate-in fade-in duration-500" style={{ animationDelay: `${index * 30}ms` }}>
                                        <Userproductcardverti product={product} showDetails={true} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-section)] flex items-center justify-center text-[var(--text-muted)] mb-4 border border-[var(--border-light)]">
                                    <PackageX size={28} />
                                </div>
                                <h3 className="text-base font-black text-[var(--text-main)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>No Products Found</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium max-w-xs mb-6">
                                    {recommendedProducts.length === 0
                                        ? `We're restocking this collection. Check back soon.`
                                        : "Try adjusting your filters to see more results."
                                    }
                                </p>
                                <button
                                    onClick={() => { setMinPrice(""); setMaxPrice(""); setLocalMinPrice(""); setLocalMaxPrice(""); setAvailability("all"); }}
                                    className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-all active:scale-95 shadow-md"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categorywiseproduct;