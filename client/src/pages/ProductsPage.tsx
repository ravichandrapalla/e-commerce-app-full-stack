import ProductCatalog from "../components/catalog/ProductCatalog";

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <ProductCatalog compactHeader />
    </div>
  );
}
