import { Link } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import AddToCart from "./AddToCart";

export default function ProductCard({ product }: any) {
  const addToCart = useAddToCart();
  return (
    <div className="flex flex-col justify-center border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/200"}
          className="w-full h-40 object-cover rounded"
        />
        <h2 className="mt-2 font-semibold">{product.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 font-bold">₹{product.price}</p>
      </Link>

      {/* <button
          onClick={() =>
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }
        >
          Add to Cart
        </button> */}
      <AddToCart product={product} />
    </div>
  );
}
