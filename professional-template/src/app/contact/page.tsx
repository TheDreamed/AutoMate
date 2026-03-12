import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}. ${siteConfig.ctaText} today.`,
};

export default function ContactPage() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14">
          {/* Left column - info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Have a question or ready to book? Fill out the form and we&apos;ll
              get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Address</h3>
                <p className="text-neutral-600 text-sm">{siteConfig.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-accent hover:underline text-sm"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-accent hover:underline text-sm"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Hours</h3>
                <p className="text-neutral-600 text-sm">{siteConfig.footer.hours}</p>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
