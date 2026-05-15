import { useProducts } from "../../features/product/product.hooks";

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 50,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="text-left p-4">Title</th>
            <th className="text-left p-4">Price</th>
            <th className="text-left p-4">Stock</th>
          </tr>
        </thead>

        <tbody>
          {data.products.map((product: any) => (
            <tr key={product.id} className="border-b">
              <td className="p-4">{product.title}</td>

              <td className="p-4">₹{product.price}</td>

              <td className="p-4">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
