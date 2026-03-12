import { siteConfig } from "@/config/site";

export default function Testimonials() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center mb-14">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {siteConfig.testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100"
            >
              <p className="text-neutral-700 mb-4 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-neutral-900">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
