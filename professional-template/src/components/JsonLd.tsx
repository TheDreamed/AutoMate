import { siteConfig } from "@/config/site";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": siteConfig.seo.schemaType,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.seo.geo.latitude,
      longitude: siteConfig.seo.geo.longitude,
    },
    openingHours: siteConfig.seo.openingHours,
    priceRange: siteConfig.seo.priceRange,
    areaServed: siteConfig.seo.areaServed,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
