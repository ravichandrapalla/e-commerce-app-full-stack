import HeroCarousel from "../components/home/HeroCarousel";
import CategoryStrip from "../components/home/CategoryStrip";
import ProductCatalog from "../components/catalog/ProductCatalog";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <HeroCarousel />
      <CategoryStrip />
      <ProductCatalog />
    </div>
  );
}
