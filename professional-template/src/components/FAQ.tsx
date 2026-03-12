"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center mb-14">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {siteConfig.faq.map((item, i) => (
            <div key={i} className="border border-neutral-200 rounded-lg">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.question}
                <svg
                  className={`w-5 h-5 text-neutral-500 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-neutral-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
