export default function ProductCard({ product }: any) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <img
        src={product.imageUrl || "https://via.placeholder.com/200"}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="mt-2 font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-500 line-clamp-2">
        {product.description}
      </p>
      <p className="mt-2 font-bold">₹{product.price}</p>
    </div>
  );
}
