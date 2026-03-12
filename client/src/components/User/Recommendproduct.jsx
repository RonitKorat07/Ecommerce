import Userproductcardverti from "./Userproductcardverti";
import { Sparkles } from "lucide-react";

const Recommendproduct = ({ products }) => {
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--primary-light)] rounded-xl text-[var(--primary)]">
          <Sparkles size={20} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
          You Might <span className="text-[var(--primary)]">Also Like</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.map((product) => (
          <Userproductcardverti key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendproduct;

