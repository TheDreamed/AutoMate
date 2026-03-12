import { siteConfig } from "@/config/site";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Our Services
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Comprehensive care tailored to your needs.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => (
            <div
              key={service.title}
              className="bg-neutral-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-neutral-100"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
