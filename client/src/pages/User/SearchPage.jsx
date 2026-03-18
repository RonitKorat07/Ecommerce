import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Userproductcardverti from '../../components/User/Userproductcardverti';
import axiosClient from '../../api/axiosClient';
import API from '../../api/endpoints';
import { Search, ChevronRight, ChevronDown, PackageX, ArrowLeft, Filter, X, Check } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Dropdown, DropdownItem } from '../../components/UI/Dropdown';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");
    const [sortOption, setSortOption] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [availability, setAvailability] = useState("all"); 
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [localMinPrice, setLocalMinPrice] = useState("");
    const [localMaxPrice, setLocalMaxPrice] = useState("");

    useEffect(() => {
        const fetchproduct = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(API.search(query));
                setProducts(res.data.products);
                // Reset filters on new search
                setAvailability("all");
                setMinPrice("");
                setMaxPrice("");
                setLocalMinPrice("");
                setLocalMaxPrice("");
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        if (query) {
            fetchproduct();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [query]);

    const handleApplyFilter = () => {
        setMinPrice(localMinPrice);
        setMaxPrice(localMaxPrice);
        setIsFilterOpen(false);
    };

    const filteredProducts = products.filter((product) => {
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
        if (sortOption === "price-low") return getPrice(a) - getPrice(b);
        if (sortOption === "price-high") return getPrice(b) - getPrice(a);
        return 0; // Default: newest
    });

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-6 transition-premium" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb Navigation - Synchronized */}
                <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 animate-in fade-in duration-500">
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
                    <ChevronRight size={10} className="mx-1.5 opacity-40" />
                    <span className="text-[var(--primary)]">Search Results</span>
                </nav>

                {/* Page Header Area - Tighter Spacing */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-black text-[var(--text-main)] tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                            Results for <span className="text-[var(--primary)]">"{query}"</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-medium uppercase tracking-wider">
                            {loading ? 'Searching our boutiques...' : `Found ${filteredProducts.length} items`}
                        </p>
                    </div>

                    {/* Actions Area */}
                    {!loading && products.length > 0 && (
                        <div className="flex items-center gap-2">
                            {/* Mobile Filter Toggle */}
                            <button 
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border-light)] rounded-md text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] hover:border-[var(--primary)] transition-all shadow-sm"
                            >
                                <Filter size={14} className="text-[var(--text-muted)]" />
                                Filters
                            </button>

                            <Dropdown
                                align="right"
                                trigger={
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border-light)] rounded-md hover:border-[var(--primary)] transition-colors cursor-pointer text-[10px] font-black uppercase tracking-widest group shadow-sm">
                                        <span className="text-[var(--text-muted)]">Sort:</span>
                                        <span className="text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                                            {sortOption === 'newest' ? 'New' : sortOption === 'price-low' ? 'Low' : 'High'}
                                        </span>
                                        <ChevronDown size={12} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={() => setSortOption('newest')} className="text-[11px] font-bold">NEWEST</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('price-low')} className="text-[11px] font-bold">PRICE: LOW-HIGH</DropdownItem>
                                <DropdownItem onClick={() => setSortOption('price-high')} className="text-[11px] font-bold">PRICE: HIGH-LOW</DropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </div>

                {/* Main Content Area: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-8 border-t border-[var(--border-light)] pt-8">
                    
                    {/* Left Sidebar (Filters) */}
                    {!loading && products.length > 0 && (
                        <div className="w-full lg:w-48 shrink-0 lg:sticky lg:top-24">
                            <div className={`${isFilterOpen ? 'fixed inset-0 z-[100] bg-white p-6 overflow-y-auto animate-in slide-in-from-bottom-4 shadow-2xl' : 'hidden lg:block'} space-y-7`}>
                                
                                <div className="flex lg:hidden items-center justify-between mb-6 pb-3 border-b border-[var(--border-light)]">
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">Filters</h2>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-1.5 bg-[var(--bg-section)] rounded-md text-[var(--text-muted)]">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Availability */}
                                <div className="space-y-3 pb-6 border-b border-[var(--border-light)]">
                                    <h3 className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-widest opacity-60">Availability</h3>
                                    <div className="space-y-2">
                                        <label onClick={() => setAvailability("in-stock")} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-3.5 h-3.5 rounded border ${availability === 'in-stock' ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-light)]'} group-hover:border-[var(--primary)] flex items-center justify-center transition-colors`}>
                                                {availability === 'in-stock' && <Check size={8} className="text-white" />}
                                            </div>
                                            <span className={`text-[11px] font-bold ${availability === 'in-stock' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>In Stock</span>
                                        </label>
                                        <label onClick={() => setAvailability("all")} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-3.5 h-3.5 rounded border ${availability === 'all' ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-light)]'} group-hover:border-[var(--primary)] flex items-center justify-center transition-colors`}>
                                                {availability === 'all' && <Check size={8} className="text-white" />}
                                            </div>
                                            <span className={`text-[11px] font-bold ${availability === 'all' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>All Items</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-3 pb-6 border-b border-[var(--border-light)]">
                                    <h3 className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-widest opacity-60">Price Range</h3>
                                    <div className="flex items-center gap-1.5">
                                        <input 
                                            type="number" placeholder="Min" value={localMinPrice} onChange={(e) => setLocalMinPrice(e.target.value)}
                                            className="w-full px-2 py-1.5 text-[10px] border border-[var(--border-light)] rounded-md focus:border-[var(--primary)] outline-none bg-[var(--bg-body)]" 
                                        />
                                        <span className="text-[var(--text-muted)] text-[10px]">-</span>
                                        <input 
                                            type="number" placeholder="Max" value={localMaxPrice} onChange={(e) => setLocalMaxPrice(e.target.value)}
                                            className="w-full px-2 py-1.5 text-[10px] border border-[var(--border-light)] rounded-md focus:border-[var(--primary)] outline-none bg-[var(--bg-body)]" 
                                        />
                                    </div>
                                    <Button 
                                        variant="orange" 
                                        onClick={handleApplyFilter} 
                                        className="w-full py-1.5 h-7 text-[9px] font-black uppercase tracking-widest text-white border-none rounded-md"
                                        style={{ background: 'var(--gradient-accent)' }}
                                    >
                                        Apply
                                    </Button>
                                </div>

                                {/* Tags (Final Symmetry Step) */}
                                <div className="space-y-3 pb-6 border-b border-[var(--border-light)] lg:border-none">
                                    <h3 className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-widest opacity-60">Tags</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Trending', 'New', 'Exclusive', 'Sale'].map((tag, i) => (
                                            <span key={tag} className={`px-2 py-1 bg-[var(--bg-card)] border ${i === 0 ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border-light)] text-[var(--text-muted)]'} rounded-md text-[9px] font-bold hover:border-[var(--primary)] transition-colors cursor-pointer uppercase tracking-tighter`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:hidden pt-4 pb-6">
                                    <Button 
                                        variant="primary" 
                                        className="w-full py-3 text-[10px] font-black uppercase tracking-widest bg-[var(--primary)] text-white shadow-xl shadow-blue-500/20" 
                                        onClick={() => setIsFilterOpen(false)}
                                    >
                                        Show {filteredProducts.length} Results
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right: Grid */}
                    <div className="flex-1 w-full">
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <div key={n} className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] h-[280px] animate-pulse overflow-hidden shadow-sm">
                                        <div className="h-40 bg-slate-100"></div>
                                        <div className="p-3 space-y-2">
                                            <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
                                            <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {sortedProducts.map((product, index) => (
                                    <div key={product._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 30}ms` }}>
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
                                    We couldn't find any products matching your current filters. Try adjusting your price range or keyword.
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

export default SearchPage;