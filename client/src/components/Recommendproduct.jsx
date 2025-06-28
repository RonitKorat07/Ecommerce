import Userproductcardverti from "./Userproductcardverti";

const Recommendproduct = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 mt-6">No recommendations found.</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Userproductcardverti key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendproduct;
