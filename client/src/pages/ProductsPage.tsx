import ProductCatalog from "../components/catalog/ProductCatalog";
import PageContainer from "../components/ui/PageContainer";

export default function ProductsPage() {
  return (
    <PageContainer className="py-2 sm:py-4">
      <ProductCatalog compactHeader />
    </PageContainer>
  );
}
