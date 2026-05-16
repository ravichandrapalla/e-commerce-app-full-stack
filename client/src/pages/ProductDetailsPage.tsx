import { useParams } from "react-router-dom";

import PageContainer from "../components/ui/PageContainer";
import { useAddToCart } from "../hooks/useAddToCart";

import AddToCart from "../components/ui/AddToCart";
import { useProduct } from "../hooks/useProduct";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();

  const { data, isLoading } = useProduct(id);
  console.log("data", data);
  // const product = data?.products[0] || {};

  const addToCart = useAddToCart();

  if (isLoading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={data?.imageUrl || ""} className="rounded-xl w-full" />

        <div>
          <h1 className="text-3xl font-bold">{data?.title}</h1>

          <p className="mt-4 text-slate-600">{data?.description}</p>

          <p className="mt-6 text-2xl font-bold">₹{data?.price}</p>
          <AddToCart product={data} />
        </div>
      </div>
    </PageContainer>
  );
}
