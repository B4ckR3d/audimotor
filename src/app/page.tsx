import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CarCatalog from '@/components/CarCatalog';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import StatsBar from '@/components/StatsBar';
import CatalogHeader from '@/components/CatalogHeader';
import GallerySection from '@/components/GallerySection';
import PromotionsSection from '@/components/PromotionsSection';
import ShowroomMapSection from '@/components/ShowroomMapSection';
import prisma from '@/lib/prisma';
import { Car } from '@/types';

export const dynamic = 'force-dynamic';

async function getCars(): Promise<Car[]> {
  try {
    const rows = await prisma.car.findMany({
      where: { status: 'available' },
      orderBy: [
        { is_featured: 'desc' },
        { created_at: 'desc' },
      ],
    });
    return rows as unknown as Car[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const cars = await getCars();

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <StatsBar totalUnits={cars.length} brands={[...new Set(cars.map((c) => c.brand))]} />

      {/* Car Catalog */}
      <section id="koleksi" className="section-spacing bg-[var(--surface-1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CatalogHeader />
          <CarCatalog cars={cars} />
        </div>
      </section>

      <PromotionsSection />
      <GallerySection />
      <Testimonials />
      <ShowroomMapSection />
      <Footer />
    </>
  );
}
