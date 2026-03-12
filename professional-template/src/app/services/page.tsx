import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Explore the services offered by ${siteConfig.name} — ${siteConfig.profession}.`,
};

export default function ServicesPage() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Our Services
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Comprehensive {siteConfig.profession.toLowerCase()} services tailored to your needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-5">{service.icon}</div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">
                {service.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href={siteConfig.ctaLink}
            className="inline-block bg-primary text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {siteConfig.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
