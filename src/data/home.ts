type FaqItem = {
  question: string;
  answer: string;
};

export const heroRotatingTexts = [
  "sin vivir ni viajar a EE.UU.",
  "online desde cualquier país de LATAM.",
  "con banco en dólares incluido.",
];

export const heroStats = [
  { value: 1000, suffix: "+", label: "LLCs creadas" },
  { value: 4.9, suffix: "★", label: "Trustpilot" },
  { value: 7, suffix: " días", label: "Promedio de apertura" },
];

export const services = [
  {
    icon: "🏢",
    title: "LLC en EE.UU.",
    description:
      "Single Member LLC en Wyoming, Nuevo México o Florida, con documentación completa en una semana hábil.",
  },
  {
    icon: "🏦",
    title: "Cuenta bancaria",
    description:
      "Mercury, Relay o Lili Bank. Apertura online, sin SSN y sin viajar a Estados Unidos.",
  },
  {
    icon: "🔢",
    title: "EIN (Tax ID)",
    description:
      "Identificación fiscal federal para abrir cuenta bancaria, facturar y operar con respaldo legal.",
  },
  {
    icon: "📄",
    title: "Operating Agreement",
    description:
      "Acuerdo operativo de la LLC, junto con artículos de organización incluidos y listos para usar.",
  },
  {
    icon: "📍",
    title: "Registered Agent",
    description:
      "Agente registrado incluido durante el primer año, con dirección fiscal en EE.UU. para tu sociedad.",
  },
  {
    icon: "💳",
    title: "Stripe y cobros en USD",
    description:
      "Acompañamiento para habilitar Stripe, Wise y herramientas de cobro internacional en USD.",
  },
];

export const partners = [
  {
    name: "Mercury",
    description: "Banco digital preferido por startups y founders no residentes",
    tag: "Recomendado",
    logo: "🔵",
  },
  {
    name: "Relay",
    description: "Cuentas múltiples y operación simple para negocios",
    tag: "Multi-cuenta",
    logo: "🟢",
  },
  {
    name: "Lili Bank",
    description: "Cuenta pensada para freelancers, creadores y negocios digitales",
    tag: "Fácil apertura",
    logo: "🟡",
  },
  {
    name: "Chase",
    description: "Banco tradicional para quienes prefieren apertura presencial en Miami",
    tag: "Presencial",
    logo: "🏦",
  },
];

export const benefits = [
  {
    number: "01",
    title: "Protección patrimonial",
    description:
      "Separá tu actividad comercial de tu persona, con responsabilidad limitada para proteger tu patrimonio personal.",
  },
  {
    number: "02",
    title: "Eficiencia fiscal",
    description:
      "Con la estructura correcta, un no residente sin actividad física en EE.UU. puede optimizar su carga fiscal de forma legal.",
  },
  {
    number: "03",
    title: "Acceso a bancos en USD",
    description:
      "Cobrale a clientes globales en dólares con bancos y plataformas preparados para negocios internacionales.",
  },
  {
    number: "04",
    title: "Credibilidad internacional",
    description:
      "Una compañía estadounidense mejora tu acceso a Stripe, PayPal, Amazon, contratos y clientes internacionales.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Evaluación gratuita",
    description:
      "Videollamada breve con un asesor para entender tu caso y definir estado, banco y próximos pasos.",
    fillTarget: 20,
  },
  {
    step: 2,
    title: "Formulario de datos",
    description:
      "Cargás tus datos en un formulario online y nuestro equipo prepara la documentación.",
    fillTarget: 40,
  },
  {
    step: 3,
    title: "Presentación al estado",
    description:
      "Presentamos la documentación de formación ante el estado elegido.",
    fillTarget: 60,
  },
  {
    step: 4,
    title: "Aprobación + EIN",
    description:
      "Cuando la LLC queda aprobada, gestionamos el EIN ante el IRS por vos.",
    fillTarget: 80,
  },
  {
    step: 5,
    title: "LLC lista + Cuenta bancaria",
    description:
      "Recibís tus documentos finales y te acompañamos en la apertura bancaria.",
    fillTarget: 100,
    done: true,
  },
];

export const elegirReviews = [
  {
    stars: "★★★★★",
    text: "En pocos días tenía la LLC aprobada y la cuenta en Mercury funcionando. El proceso fue claro y el equipo respondió siempre.",
    name: "Santiago L.",
    country: "México 🇲🇽",
    role: "E-commerce",
  },
  {
    stars: "★★★★★",
    text: "Venía postergando la apertura de mi LLC. Con LLC Argentina lo resolví rápido y hoy facturo en USD desde Argentina.",
    name: "Laura C.",
    country: "Argentina 🇦🇷",
    role: "Consultora Digital",
  },
  {
    stars: "★★★★★",
    text: "Pensé que desde España iba a ser complicado, pero me guiaron paso a paso. Hoy mi empresa en Wyoming está operativa.",
    name: "Javier P.",
    country: "España 🇪🇸",
    role: "SaaS Founder",
  },
  {
    stars: "★★★★★",
    text: "Me respondieron las dudas con claridad y sin vueltas. La asesoría fue directa, honesta y muy recomendable.",
    name: "Rodrigo V.",
    country: "Colombia 🇨🇴",
    role: "Freelancer",
  },
  {
    stars: "★★★★★",
    text: "Necesitaba ordenar cobros de YouTube y pagos a colaboradores. Con la LLC pudimos resolverlo y dejar empresa y cuenta listas.",
    name: "Matias Bottero",
    country: "Entre Suculentas · Youtuber",
    role: "",
    link: "https://www.instagram.com/matiasbottero",
    linkType: "instagram" as const,
  },
  {
    stars: "★★★★★",
    text: "Muy buen equipo profesional. El proceso fue rápido, ordenado y sin complicaciones innecesarias.",
    name: "Martin Poblet",
    country: "Argentina 🇦🇷",
    role: "Emprendedor",
    link: "https://www.linkedin.com/in/martinpoblet/",
    linkType: "linkedin" as const,
  },
];

export const pricingHighlights = [
  { label: "LLC formada", included: true },
  { label: "EIN incluido", included: true },
  { label: "Cuenta bancaria", included: true },
  { label: "Operating Agreement", included: true },
  { label: "Registered Agent 1 año", included: true },
  { label: "Soporte 24/7", included: true },
];

export const homeFaqItems: FaqItem[] = [
  {
    question: "¿Necesito ser residente en EE.UU. para abrir una LLC?",
    answer:
      "No. Podés abrir una LLC en EE.UU. sin residencia ni ciudadanía. Con tu pasaporte vigente alcanza para iniciar el proceso.",
  },
  {
    question: "¿Cuánto tiempo tarda el proceso?",
    answer:
      "La LLC suele quedar activa en 5 a 7 días hábiles. La apertura bancaria puede sumar algunos días según el banco elegido.",
  },
  {
    question: "¿Qué impuestos pago en EE.UU.?",
    answer:
      "Depende de tu estructura y residencia fiscal. En muchos casos, una Single Member LLC de no residente sin actividad física en EE.UU. no paga impuesto federal sobre renta de fuente extranjera.",
  },
  {
    question: "¿Qué estado me recomiendan para abrir la LLC?",
    answer:
      "Wyoming y Nuevo México suelen ser buenas opciones por costos, privacidad y mantenimiento. En la llamada definimos cuál encaja mejor con tu caso.",
  },
  {
    question: "¿Cuánto cuesta abrir la LLC?",
    answer:
      "Los planes comienzan en $599 USD e incluyen formación de la LLC, EIN, Registered Agent y acompañamiento bancario.",
  },
  {
    question: "¿Qué pasa con mis impuestos en mi país?",
    answer:
      "Depende de tu residencia fiscal y de las reglas locales. En la evaluación revisamos los puntos principales para tu país.",
  },
];
