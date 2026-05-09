import { Link } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";

export default function ProductCard({ product }: any) {
  const addToCart = useAddToCart();
  return (
    <Link to={`/products/${product.id}`}>
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
        <button
          onClick={() =>
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
