import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-28 pb-20 text-center">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-neutral-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
