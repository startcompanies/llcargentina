type FaqItem = {
  question: string;
  answer: string;
};

export const heroRotatingTexts = [
  "without living or traveling to the U.S.",
  "online from anywhere in LATAM.",
  "with USD banking included.",
];

export const heroStats = [
  { value: 1000, suffix: "+", label: "LLCs formed" },
  { value: 4.9, suffix: "★", label: "Trustpilot" },
  { value: 7, suffix: " days", label: "Average setup time" },
];

export const services = [
  {
    icon: "🏢",
    title: "U.S. LLC",
    description:
      "Single Member LLC in Wyoming, New Mexico, or Florida, with full documents in about one business week.",
  },
  {
    icon: "🏦",
    title: "Bank account",
    description:
      "Mercury, Relay, or Lili Bank. Online setup, no SSN, and no trip to the United States required.",
  },
  {
    icon: "🔢",
    title: "EIN (Tax ID)",
    description:
      "Federal tax identification for banking, invoicing, and operating with the right legal foundation.",
  },
  {
    icon: "📄",
    title: "Operating Agreement",
    description:
      "Your LLC operating contract, with Articles of Organization included and ready to use.",
  },
  {
    icon: "📍",
    title: "Registered Agent",
    description:
      "Registered agent included for the first year, plus a U.S. tax address for your company.",
  },
  {
    icon: "💳",
    title: "Stripe & USD payments",
    description:
      "Support to activate Stripe, Wise, and international payment tools in USD.",
  },
];

export const partners = [
  {
    name: "Mercury",
    description: "Digital bank preferred by non-resident founders and startups",
    tag: "Recommended",
    logo: "🔵",
  },
  {
    name: "Relay",
    description: "Multi-account banking built for business operations",
    tag: "Multi-account",
    logo: "🟢",
  },
  {
    name: "Lili Bank",
    description: "Account designed for freelancers, creators, and digital businesses",
    tag: "Easy opening",
    logo: "🟡",
  },
  {
    name: "Chase",
    description: "Traditional bank for in-person account opening in Miami",
    tag: "In-person",
    logo: "🏦",
  },
];

export const benefits = [
  {
    number: "01",
    title: "Asset protection",
    description:
      "Keep your business activity separate from you personally, with limited liability around your personal assets.",
  },
  {
    number: "02",
    title: "Tax efficiency",
    description:
      "With the right structure, a non-resident with no physical U.S. activity can legally optimize their tax exposure.",
  },
  {
    number: "03",
    title: "Access to USD banking",
    description:
      "Collect from global clients in dollars through banks and platforms built for international business.",
  },
  {
    number: "04",
    title: "International credibility",
    description:
      "A U.S. company improves access to Stripe, PayPal, Amazon, global contracts, and international clients.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Free evaluation",
    description:
      "Short video call with an advisor to review your case and choose the state, bank, and next steps.",
    fillTarget: 20,
  },
  {
    step: 2,
    title: "Data form",
    description:
      "Submit your details through an online form and our team prepares the documentation.",
    fillTarget: 40,
  },
  {
    step: 3,
    title: "State filing",
    description:
      "We file the formation documents with the selected state.",
    fillTarget: 60,
  },
  {
    step: 4,
    title: "Approval + EIN",
    description:
      "Once the LLC is approved, we handle the EIN request with the IRS for you.",
    fillTarget: 80,
  },
  {
    step: 5,
    title: "LLC ready + Bank account",
    description:
      "You receive the final documents and we guide you through the banking setup.",
    fillTarget: 100,
    done: true,
  },
];

export const elegirReviews = [
  {
    stars: "★★★★★",
    text: "Within days my LLC was approved and my Mercury account was working. The process was clear and the team stayed available.",
    name: "Santiago L.",
    country: "Mexico 🇲🇽",
    role: "E-commerce",
  },
  {
    stars: "★★★★★",
    text: "I had postponed opening my LLC for months. LLC Argentina made it fast, and now I invoice in USD from Argentina.",
    name: "Laura C.",
    country: "Argentina 🇦🇷",
    role: "Digital Consultant",
  },
  {
    stars: "★★★★★",
    text: "I thought doing it from Spain would be complicated, but they guided me step by step. My Wyoming company is now operating.",
    name: "Javier P.",
    country: "Spain 🇪🇸",
    role: "SaaS Founder",
  },
  {
    stars: "★★★★★",
    text: "They answered my questions clearly and quickly. The advisory was direct, honest, and very easy to recommend.",
    name: "Rodrigo V.",
    country: "Colombia 🇨🇴",
    role: "Freelancer",
  },
  {
    stars: "★★★★★",
    text: "I needed to organize YouTube collections and payments to collaborators. The LLC helped us solve it and get the company and bank account ready.",
    name: "Matias Bottero",
    country: "Entre Suculentas · Youtuber",
    role: "",
    link: "https://www.instagram.com/matiasbottero",
    linkType: "instagram" as const,
  },
  {
    stars: "★★★★★",
    text: "A very professional team. The process was fast, organized, and free of unnecessary friction.",
    name: "Martin Poblet",
    country: "Argentina 🇦🇷",
    role: "Entrepreneur",
    link: "https://www.linkedin.com/in/martinpoblet/",
    linkType: "linkedin" as const,
  },
];

export const pricingHighlights = [
  { label: "LLC formed", included: true },
  { label: "EIN included", included: true },
  { label: "Bank account", included: true },
  { label: "Operating Agreement", included: true },
  { label: "Registered Agent 1 year", included: true },
  { label: "24/7 Support", included: true },
];

export const homeFaqItems: FaqItem[] = [
  {
    question: "Do I need to be a U.S. resident to open an LLC?",
    answer:
      "No. You can open a U.S. LLC without residency or citizenship. A valid passport is enough to start.",
  },
  {
    question: "How long does the process take?",
    answer:
      "The LLC is usually active in 5 to 7 business days. Banking may take a few additional days depending on the provider.",
  },
  {
    question: "What taxes do I pay in the U.S.?",
    answer:
      "It depends on your structure and tax residency. In many cases, a non-resident Single Member LLC with no physical U.S. activity does not pay federal tax on foreign-source income.",
  },
  {
    question: "Which state do you recommend for the LLC?",
    answer:
      "Wyoming and New Mexico are often strong options for cost, privacy, and maintenance. We choose the best fit during the evaluation call.",
  },
  {
    question: "How much does it cost to open an LLC?",
    answer:
      "Plans start at $599 USD and include LLC formation, EIN, Registered Agent, and banking support.",
  },
  {
    question: "What about taxes in my home country?",
    answer:
      "That depends on your tax residency and local rules. During the evaluation, we review the main points for your country.",
  },
];
