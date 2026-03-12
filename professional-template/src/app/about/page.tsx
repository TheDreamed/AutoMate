import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.name} — ${siteConfig.profession} in ${siteConfig.seo.areaServed}.`,
};

export default function AboutPage() {
  const { about } = siteConfig;

  return (
    <section className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">
          {about.heading}
        </h1>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Bio */}
          <div className="md:col-span-3 space-y-4">
            {about.bio.map((paragraph, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
              <h2 className="font-bold text-neutral-900 mb-4">
                Credentials & Qualifications
              </h2>
              <ul className="space-y-3">
                {about.credentials.map((cred, i) => (
                  <li key={i} className="flex gap-2 text-sm text-neutral-600">
                    <span className="text-accent mt-0.5 shrink-0">&#10003;</span>
                    {cred}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
