import HeroCarousel from "../components/home/HeroCarousel";
import CategoryStrip from "../components/home/CategoryStrip";
import ProductCatalog from "../components/catalog/ProductCatalog";
import PageContainer from "../components/ui/PageContainer";

export default function HomePage() {
  return (
    <PageContainer className="page-stack py-2 sm:py-4">
      <HeroCarousel />
      <CategoryStrip />
      <ProductCatalog />
    </PageContainer>
  );
}
