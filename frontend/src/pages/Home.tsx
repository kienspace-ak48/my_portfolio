import NewsSection from "../components/NewsSection";
import DiscoveryCategories from "../components/home/DiscoveryCategories";
import FaqSection from "../components/home/FaqSection";
import FeaturedProjects from "../components/home/FeaturedProjects";
import HomeCta from "../components/home/HomeCta";
import StatsSection from "../components/home/StatsSection";
import TechStackCarousel from "../components/home/TechStackCarousel";

function Home() {
  return (
    <div className="space-y-12 pb-4 sm:space-y-14 lg:space-y-16">
      <NewsSection />

      <DiscoveryCategories />
      <FeaturedProjects />
      <StatsSection />
      <TechStackCarousel />
      <FaqSection />
      <HomeCta />
    </div>
  );
}

export default Home;
