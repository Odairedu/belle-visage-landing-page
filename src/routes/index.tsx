import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { Benefits } from "@/components/Benefits";
import { AboutBrand } from "@/components/AboutBrand";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Belle Visage — Spray facial anti-acne" },
      {
        name: "description",
        content:
          "Belle Visage é um spray facial com niacinamida e ácido salicílico que seca espinhas, reduz vermelhidão e controla a oleosidade. Para todos os tipos de pele.",
      },
      { property: "og:title", content: "Belle Visage — Spray facial anti-acne" },
      {
        property: "og:description",
        content: "Diga adeus às espinhas. Spray prático, rápido e eficaz.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <ProductSection />
        <Benefits />
        <AboutBrand />
      </main>
      <Footer />
    </div>
  );
}
