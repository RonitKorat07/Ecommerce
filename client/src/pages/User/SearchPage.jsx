import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import Userproductcardverti from '../../components/User/Userproductcardverti';
import axiosClient from '../../api/axiosClient';
import API from '../../api/endpoints';
import { Search, ShoppingBag, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import Button from '../../components/UI/Button';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");

    useEffect(() => {
        const fetchproduct = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(API.search(query))
                setProducts(res.data.products)
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }
        if (query) {
            fetchproduct();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [query])

    return (
        <div className="min-h-screen bg-[var(--bg-body)] animate-in fade-in duration-700">
            {/* Header / Meta Info */}
            <div className="bg-white border-b border-[var(--border-light)] py-10">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        <span className="hover:text-[var(--primary)] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                        <div className="h-1 w-1 rounded-full bg-[var(--border-light)]"></div>
                        <span className="text-[var(--primary)]">Search Results</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-5xl font-black text-[var(--text-main)] italic" style={{ fontFamily: 'var(--font-heading)' }}>
                                Results for <span className="text-[var(--primary)]">"{query}"</span>
                            </h1>
                            <p className="text-[var(--text-muted)] font-medium">
                                {loading ? 'Searching our collection...' : `Found ${products.length} exclusive items matching your request.`}
                            </p>
                        </div>

                        {!loading && products.length > 0 && (
                            <div className="flex items-center gap-4">
                                <Button variant="outline" className="h-12 rounded-2xl gap-2 text-xs font-bold border-[var(--border-light)]">
                                    <SlidersHorizontal size={14} />
                                    Filter
                                </Button>
                                <div className="h-10 w-[1px] bg-[var(--border-light)] hidden md:block"></div>
                                <select className="bg-transparent border-none text-xs font-bold text-[var(--text-main)] focus:ring-0 cursor-pointer">
                                    <option>Newest First</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 4, 8].map((n) => (
                            <div key={n} className="aspect-[3/4] bg-white rounded-[2rem] animate-pulse border border-[var(--border-light)]"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div key={product._id} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                                <Userproductcardverti product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-[var(--primary)] shadow-2xl shadow-[var(--primary-light)] ring-1 ring-[var(--border-light)]">
                            <Search size={40} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">No matches found</h3>
                            <p className="text-[var(--text-muted)] font-medium italic leading-relaxed">
                                We couldn't find any products matching <span className="text-[var(--text-main)]">"{query}"</span>. Try adjusting your search or explore our popular categories.
                            </p>
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" onClick={() => navigate('/')} className="flex-1 h-16 rounded-2xl">Go Home</Button>
                            <Button variant="primary" onClick={() => navigate('/')} className="flex-1 h-16 rounded-2xl">Explore Store</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage

