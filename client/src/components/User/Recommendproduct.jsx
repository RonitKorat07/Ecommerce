import React, { useRef } from 'react';
import Userproductcardverti from "./Userproductcardverti";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../UI/Button";

const Recommendproduct = ({ products }) => {
  const scrollRef = useRef(null);

  const scrollContainer = (direction = 1) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 400,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[var(--bg-body)] rounded-full flex items-center justify-center text-[var(--text-muted)] opacity-50">
          <Sparkles size={32} strokeWidth={1} />
        </div>
        <p className="text-[var(--text-muted)] font-medium">No recommendations available right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--primary-light)] rounded-xl text-[var(--primary)]">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
            You Might <span className="text-[var(--primary)]">Also Like</span>
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 rounded-xl"
            onClick={() => scrollContainer(-1)}
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 rounded-xl"
            onClick={() => scrollContainer(1)}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div 
        className="flex gap-6 overflow-x-auto hide-scrollbar py-4 px-2 -mx-2 scroll-smooth"
        ref={scrollRef}
      >
        {products.map((product) => (
          <div key={product._id} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px]">
            <Userproductcardverti product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendproduct;

