import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles and insights from ${siteConfig.name}.`,
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
          Blog
        </h1>
        <p className="text-neutral-600 mb-12">
          Tips, insights, and updates from our practice.
        </p>

        {posts.length === 0 ? (
          <p className="text-neutral-500">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-neutral-100 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-neutral-500 mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-neutral-900 hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-accent text-sm font-medium hover:underline"
                >
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
