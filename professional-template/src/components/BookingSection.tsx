import { siteConfig } from "@/config/site";

export default function BookingSection() {
  return (
    <section id="booking" className="py-20 bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-neutral-600 mb-8 max-w-xl mx-auto">
          Book a free consultation and let us know how we can help.
        </p>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe
            src={`https://cal.com/${siteConfig.calLink}?embed=true`}
            className="w-full border-0"
            style={{ height: "600px" }}
            title="Book an appointment"
          />
        </div>
      </div>
    </section>
  );
}
