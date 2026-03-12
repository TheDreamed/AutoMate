// ============================================================
// SITE CONFIGURATION
// Edit this file to repurpose the template for any professional.
// All content, branding, and integrations are controlled here.
// ============================================================

export const siteConfig = {
  // --- Branding ---
  name: "Dr. Jane Smith",
  title: "Dr. Jane Smith | Family Dentist in Austin, TX",
  description:
    "Trusted family dentistry in Austin, TX. Offering general, cosmetic, and restorative dental care. Book your appointment today.",
  url: "https://www.drjanesmith.com",
  ogImage: "/og-image.jpg",

  // --- Professional Info ---
  profession: "Family Dentist",
  tagline: "Healthy Smiles for the Whole Family",
  heroDescription:
    "Providing compassionate, high-quality dental care for patients of all ages in Austin, TX. From routine cleanings to complete smile makeovers.",
  ctaText: "Book an Appointment",
  ctaLink: "#booking",

  // --- Contact ---
  email: "hello@drjanesmith.com",
  phone: "(512) 555-0123",
  address: "123 Main Street, Suite 200, Austin, TX 78701",

  // --- Integrations ---
  formspreeId: "{your-formspree-id}", // Replace with your Formspree form ID
  calLink: "drjanesmith/consultation", // Cal.com username/event-slug

  // --- Social ---
  social: {
    facebook: "https://facebook.com/drjanesmith",
    instagram: "https://instagram.com/drjanesmith",
    linkedin: "https://linkedin.com/in/drjanesmith",
    twitter: "",
    youtube: "",
  },

  // --- Navigation ---
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  // --- SEO / Structured Data ---
  seo: {
    schemaType: "Dentist" as const, // "Dentist" | "Physician" | "Attorney" | "AccountingService" | "ProfessionalService"
    priceRange: "$$",
    openingHours: "Mo-Fr 08:00-17:00",
    areaServed: "Austin, TX",
    geo: {
      latitude: 30.2672,
      longitude: -97.7431,
    },
  },

  // --- About Page ---
  about: {
    heading: "About Dr. Jane Smith",
    bio: [
      "Dr. Jane Smith has been serving families in Austin for over 15 years. She graduated from the University of Texas Health Science Center and completed her residency at Dell Children's Medical Center.",
      "She is passionate about making dental visits comfortable and stress-free for patients of all ages. Her practice uses the latest technology to provide efficient, effective care.",
      "When she's not in the office, Dr. Smith enjoys hiking, cooking, and spending time with her two kids.",
    ],
    image: "/about-photo.jpg",
    credentials: [
      "DDS, University of Texas Health Science Center",
      "Member, American Dental Association",
      "Board Certified, Texas State Board of Dental Examiners",
      "15+ years of clinical experience",
    ],
  },

  // --- Services ---
  services: [
    {
      title: "General Dentistry",
      description:
        "Routine exams, cleanings, fillings, and preventive care to keep your smile healthy.",
      icon: "🦷",
    },
    {
      title: "Cosmetic Dentistry",
      description:
        "Teeth whitening, veneers, and bonding to enhance the appearance of your smile.",
      icon: "✨",
    },
    {
      title: "Restorative Care",
      description:
        "Crowns, bridges, implants, and dentures to restore function and aesthetics.",
      icon: "🔧",
    },
    {
      title: "Pediatric Dentistry",
      description:
        "Gentle, kid-friendly dental care including sealants and fluoride treatments.",
      icon: "👶",
    },
    {
      title: "Emergency Dental Care",
      description:
        "Same-day appointments for toothaches, broken teeth, and other dental emergencies.",
      icon: "🚑",
    },
    {
      title: "Orthodontics",
      description:
        "Invisalign and clear aligners for straighter teeth without traditional braces.",
      icon: "😁",
    },
  ],

  // --- Testimonials ---
  testimonials: [
    {
      name: "Sarah M.",
      role: "Patient for 5 years",
      quote:
        "Dr. Smith and her team are incredible. My kids actually look forward to their dental visits now!",
    },
    {
      name: "James T.",
      role: "New Patient",
      quote:
        "I was nervous about getting veneers, but Dr. Smith walked me through every step. The results are amazing.",
    },
    {
      name: "Linda K.",
      role: "Patient for 10 years",
      quote:
        "The best dental practice in Austin. Professional, caring, and always on time.",
    },
  ],

  // --- FAQ ---
  faq: [
    {
      question: "Do you accept insurance?",
      answer:
        "Yes, we accept most major dental insurance plans including Delta Dental, Cigna, Aetna, and MetLife. Contact us to verify your specific plan.",
    },
    {
      question: "What should I expect at my first visit?",
      answer:
        "Your first visit includes a comprehensive exam, digital X-rays, a cleaning, and a personalized treatment plan. Please arrive 15 minutes early to complete paperwork.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes, we offer flexible payment plans through CareCredit and in-house financing options to make dental care affordable.",
    },
    {
      question: "How often should I visit the dentist?",
      answer:
        "We recommend a checkup and cleaning every six months. Patients with specific conditions may need more frequent visits.",
    },
  ],

  // --- Footer ---
  footer: {
    tagline: "Your trusted dental care provider in Austin, TX.",
    hours: "Monday – Friday: 8:00 AM – 5:00 PM",
  },
};

export type SiteConfig = typeof siteConfig;
