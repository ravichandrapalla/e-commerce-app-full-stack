import { useParams } from "react-router-dom";

import PageContainer from "../components/ui/PageContainer";
import { useAddToCart } from "../hooks/useAddToCart";
import { useProducts } from "../features/product/product.hooks";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();

  const { data, isLoading } = useProducts(id);
  console.log("data", data);
  const product = data?.products[0] || {};

  const addToCart = useAddToCart();

  if (isLoading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product?.imageUrl || ""} className="rounded-xl w-full" />

        <div>
          <h1 className="text-3xl font-bold">{product?.title}</h1>

          <p className="mt-4 text-slate-600">{product?.description}</p>

          <p className="mt-6 text-2xl font-bold">₹{product?.price}</p>

          <button
            onClick={() =>
              addToCart.mutate({
                productId: product?.id,
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
