import { useParams } from "react-router-dom";
import { useProduct } from "../features/product/product.hooks";
import PageContainer from "../components/PageContainer";
import { useAddToCart } from "../features/cart/cart.hooks";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();

  const { data, isLoading } = useProduct(id);

  const addToCart = useAddToCart();

  if (isLoading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={data.imageUrl || "https://via.placeholder.com/400"}
          className="rounded-xl w-full"
        />

        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>

          <p className="mt-4 text-slate-600">{data.description}</p>

          <p className="mt-6 text-2xl font-bold">₹{data.price}</p>

          <button
            onClick={() =>
              addToCart.mutate({
                productId: data.id,
                quantity: 1,
              })
            }
            className="mt-6 border px-5 py-3 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
