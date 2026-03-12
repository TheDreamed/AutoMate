import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="pt-28 pb-20 bg-gradient-to-br from-primary-light to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3">
          {siteConfig.profession}
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
          {siteConfig.tagline}
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
          {siteConfig.heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={siteConfig.ctaLink}
            className="bg-primary text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-primary-dark transition-colors text-lg"
          >
            {siteConfig.ctaText}
          </Link>
          <Link
            href="/services"
            className="border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-lg hover:bg-primary hover:text-white transition-colors text-lg"
          >
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
