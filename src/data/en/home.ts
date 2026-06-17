type FaqItem = {
  question: string;
  answer: string;
};

export const heroRotatingTexts = [
  "no residency or travel required.",
  "100% online from anywhere.",
  "bank account included.",
];

export const heroStats = [
  { value: 1000, suffix: "+", label: "LLCs formed" },
  { value: 4.9, suffix: "★", label: "Trustpilot" },
  { value: 7, suffix: " days", label: "Average LLC ready" },
];

export const services = [
  {
    icon: "🏢",
    title: "U.S. LLC",
    description:
      "Single Member LLC in Wyoming, New Mexico, or Florida. Full documentation in 7 business days.",
  },
  {
    icon: "🏦",
    title: "Bank account",
    description:
      "Mercury, Relay, or Lili Bank. 100% online, no SSN or physical visit to the U.S. required.",
  },
  {
    icon: "🔢",
    title: "EIN (Tax ID)",
    description:
      "Federal tax identification number. Required to open a bank account and operate legally.",
  },
  {
    icon: "📄",
    title: "Operating Agreement",
    description:
      "LLC operating contract. Articles of Organization included and apostilled.",
  },
  {
    icon: "📍",
    title: "Registered Agent",
    description:
      "1-year registered agent included. U.S. tax address for your LLC.",
  },
  {
    icon: "💳",
    title: "Stripe & USD payments",
    description:
      "Assistance to activate Stripe, Wise, and international payment systems in dollars.",
  },
];

export const partners = [
  {
    name: "Mercury",
    description: "Leading digital bank for non-resident startups",
    tag: "Recommended",
    logo: "🔵",
  },
  {
    name: "Relay",
    description: "Multi-account with no fees for businesses",
    tag: "Multi-account",
    logo: "🟢",
  },
  {
    name: "Lili Bank",
    description: "Account designed for freelancers and digital businesses",
    tag: "Easy opening",
    logo: "🟡",
  },
  {
    name: "Chase",
    description: "Traditional bank with in-person opening in Miami",
    tag: "In-person",
    logo: "🏦",
  },
];

export const benefits = [
  {
    number: "01",
    title: "Asset protection",
    description:
      "Your business separate from you personally. Limited liability that protects your personal assets from legal contingencies.",
  },
  {
    number: "02",
    title: "Tax efficiency",
    description:
      "As a non-resident with no physical activity in the U.S., you generally pay no U.S. federal income taxes. Legally.",
  },
  {
    number: "03",
    title: "Access to USD banking",
    description:
      "Collect from global clients in dollars. No restrictions, no hidden fees. Mercury and Relay guaranteed.",
  },
  {
    number: "04",
    title: "International credibility",
    description:
      "A U.S. company opens doors: Stripe, PayPal, Amazon, international contracts, and clients worldwide.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Free evaluation",
    description:
      "20-minute video call with an advisor. We analyze your case, choose state and bank.",
    fillTarget: 20,
  },
  {
    step: 2,
    title: "Data form",
    description:
      "Complete an online form in 5 minutes. We prepare all the documentation.",
    fillTarget: 40,
  },
  {
    step: 3,
    title: "State filing",
    description:
      "We submit the formation documents to the chosen state (Wyoming or New Mexico).",
    fillTarget: 60,
  },
  {
    step: 4,
    title: "Approval + EIN",
    description:
      "The state approves your LLC. We handle your EIN with the IRS — you don't have to do anything.",
    fillTarget: 80,
  },
  {
    step: 5,
    title: "LLC ready + Bank account",
    description:
      "You receive all your documents and we guide you to open your bank account.",
    fillTarget: 100,
    done: true,
  },
];

export const elegirReviews = [
  {
    stars: "★★★★★",
    text: "In 7 days I had my LLC approved and my Mercury account active. The whole process was simple and the team was always available.",
    name: "Santiago L.",
    country: "Mexico 🇲🇽",
    role: "E-commerce",
  },
  {
    stars: "★★★★★",
    text: "I had been wanting to open my LLC for months. With LLC Argentina it took one week. Now I invoice in USD without any issues from Argentina.",
    name: "Laura C.",
    country: "Argentina 🇦🇷",
    role: "Digital Consultant",
  },
  {
    stars: "★★★★★",
    text: "I'm from Spain and thought it would be complicated. The team explained everything step by step. Today I have my company in Wyoming operating.",
    name: "Javier P.",
    country: "Spain 🇪🇸",
    role: "SaaS Founder",
  },
  {
    stars: "★★★★★",
    text: "The team answered all my questions the same day. The advisory was honest and direct. I 100% recommend LLC Argentina.",
    name: "Rodrigo V.",
    country: "Colombia 🇨🇴",
    role: "Freelancer",
  },
  {
    stars: "★★★★★",
    text: "I had issues with my YouTube payments to collect and pay my collaborators. With the LLC we solved it — in 7 business days we had the company in the United States and the bank account ready.",
    name: "Matias Bottero",
    country: "Entre Suculentas · Youtuber",
    role: "",
    link: "https://www.instagram.com/matiasbottero",
    linkType: "instagram" as const,
  },
  {
    stars: "★★★★★",
    text: "Excellent professionals. The entire process was super fast and hassle-free. Highly recommended.",
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
      "No. Anyone in the world can open a U.S. LLC without being a resident or citizen. You only need a valid passport and we take care of the rest.",
  },
  {
    question: "How long does the process take?",
    answer:
      "The LLC becomes active in 5–7 business days. The bank account can take an additional 3–10 days depending on the chosen bank (Mercury, Relay, or Lili Bank).",
  },
  {
    question: "What taxes do I pay in the U.S.?",
    answer:
      "As a non-resident with a Single Member LLC and no physical presence or activity in the U.S., you generally pay no U.S. federal income taxes. We advise you on your specific case.",
  },
  {
    question: "Which state do you recommend for the LLC?",
    answer:
      "We primarily work with Wyoming and New Mexico. Both have low costs, no state income tax, and fast processing. During the evaluation call, we recommend the best fit for your case.",
  },
  {
    question: "How much does it cost to open an LLC?",
    answer:
      "Our plans start at $599 USD, including LLC formation, EIN, Registered Agent, and bank account.",
  },
  {
    question: "What about taxes in my home country?",
    answer:
      "That depends on the tax laws of your country of residence. During the evaluation call, we guide you on the tax implications in your specific country.",
  },
];
