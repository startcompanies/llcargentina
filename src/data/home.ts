type FaqItem = {
  question: string;
  answer: string;
};

export const heroRotatingTexts = [
  "sin residencia ni viajes.",
  "100% online desde LATAM.",
  "con cuenta bancaria incluida.",
];

export const heroStats = [
  { value: 1000, suffix: "+", label: "LLCs creadas" },
  { value: 4.9, suffix: "★", label: "Trustpilot" },
  { value: 7, suffix: " días", label: "Promedio LLC activa" },
];

export const services = [
  {
    icon: "🏢",
    title: "LLC en EE.UU.",
    description:
      "Single Member LLC en Wyoming, Nuevo México o Florida. Documentos completos en 7 días hábiles.",
  },
  {
    icon: "🏦",
    title: "Cuenta bancaria",
    description:
      "Mercury, Relay o Lili Bank. 100% online, sin SSN ni visita física a EE.UU.",
  },
  {
    icon: "🔢",
    title: "EIN (Tax ID)",
    description:
      "Número impositivo federal. Necesario para abrir la cuenta bancaria y operar legalmente.",
  },
  {
    icon: "📄",
    title: "Operating Agreement",
    description:
      "Contrato operativo de la LLC. Artículos de organización incluidos y apostillados.",
  },
  {
    icon: "📍",
    title: "Registered Agent",
    description:
      "Agente registrado por 1 año incluido. Dirección fiscal en EE.UU. para tu LLC.",
  },
  {
    icon: "💳",
    title: "Stripe y cobros en USD",
    description:
      "Asistencia para activar Stripe, Wise y sistemas de cobro internacional en dólares.",
  },
];

export const partners = [
  {
    name: "Mercury",
    description: "Banco digital líder para startups no residentes",
    tag: "Recomendado",
    logo: "🔵",
  },
  {
    name: "Relay",
    description: "Multi-cuenta sin comisiones para negocios",
    tag: "Multi-cuenta",
    logo: "🟢",
  },
  {
    name: "Lili Bank",
    description: "Cuenta diseñada para freelancers y negocios digitales",
    tag: "Fácil apertura",
    logo: "🟡",
  },
  {
    name: "Chase",
    description: "Banco tradicional con apertura presencial en Miami",
    tag: "Presencial",
    logo: "🏦",
  },
];

export const benefits = [
  {
    number: "01",
    title: "Protección patrimonial",
    description:
      "Tu negocio separado de tu persona. Responsabilidad limitada que protege tu patrimonio personal ante contingencias legales.",
  },
  {
    number: "02",
    title: "Eficiencia fiscal",
    description:
      "Como no residente sin actividad física en EE.UU., generalmente no pagás impuestos federales norteamericanos. Legalmente.",
  },
  {
    number: "03",
    title: "Acceso a bancos en USD",
    description:
      "Cobrás de clientes globales en dólares. Sin restricciones, sin comisiones ocultas. Mercury y Relay garantizados.",
  },
  {
    number: "04",
    title: "Credibilidad internacional",
    description:
      "Una empresa en EE.UU. abre puertas: Stripe, PayPal, Amazon, contratos internacionales y clientes en todo el mundo.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Evaluación gratuita",
    description:
      "Videollamada de 20 min con un asesor. Analizamos tu caso, elegimos estado y banco.",
    fillTarget: 20,
  },
  {
    step: 2,
    title: "Formulario de datos",
    description:
      "Completás un formulario online en 5 minutos. Nosotros preparamos toda la documentación.",
    fillTarget: 40,
  },
  {
    step: 3,
    title: "Presentación al estado",
    description:
      "Enviamos los documentos de formación al estado elegido (Wyoming o Nuevo México).",
    fillTarget: 60,
  },
  {
    step: 4,
    title: "Aprobación + EIN",
    description:
      "El estado aprueba la LLC. Gestionamos tu EIN ante el IRS sin que tengas que hacer nada.",
    fillTarget: 80,
  },
  {
    step: 5,
    title: "LLC lista + Cuenta bancaria",
    description:
      "Recibís todos tus documentos y te guiamos para abrir tu cuenta bancaria.",
    fillTarget: 100,
    done: true,
  },
];

export const elegirReviews = [
  {
    stars: "★★★★★",
    text: "En 7 días tuve mi LLC aprobada y mi cuenta en Mercury activa. Todo el proceso fue simple y el equipo estuvo siempre disponible.",
    name: "Santiago L.",
    country: "México 🇲🇽",
    role: "E-commerce",
  },
  {
    stars: "★★★★★",
    text: "Llevaba meses queriendo abrir mi LLC. Con LLC Argentina fue en una semana. Ahora facturo en USD sin problema desde Argentina.",
    name: "Laura C.",
    country: "Argentina 🇦🇷",
    role: "Consultora Digital",
  },
  {
    stars: "★★★★★",
    text: "Soy de España y pensé que sería complicado. El equipo me explicó todo paso a paso. Hoy tengo mi empresa en Wyoming operando.",
    name: "Javier P.",
    country: "España 🇪🇸",
    role: "SaaS Founder",
  },
  {
    stars: "★★★★★",
    text: "El equipo respondió todas mis dudas el mismo día. La asesoría fue honesta y directa. Recomiendo 100% a LLC Argentina.",
    name: "Rodrigo V.",
    country: "Colombia 🇨🇴",
    role: "Freelancer",
  },
  {
    stars: "★★★★★",
    text: "Tenía problemas con mis pagos de YouTube para cobrar y pagarle a mis colaboradores. Con la LLC lo resolvimos — en 7 días hábiles teníamos la empresa en Estados Unidos y la cuenta bancaria lista.",
    name: "Matias Bottero",
    country: "Entre Suculentas · Youtuber",
    role: "",
    link: "https://www.instagram.com/matiasbottero",
    linkType: "instagram" as const,
  },
  {
    stars: "★★★★★",
    text: "Excelentes profesionales. El proceso fue súper rápido y sin complicaciones. Totalmente recomendable.",
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
      "No. Cualquier persona en el mundo puede abrir una LLC en EE.UU. sin ser residente ni ciudadano. Solo necesitás tu pasaporte vigente y nosotros nos encargamos del resto.",
  },
  {
    question: "¿Cuánto tiempo tarda el proceso?",
    answer:
      "La LLC queda activa en 5-7 días hábiles. La cuenta bancaria puede tardar entre 3 y 10 días adicionales según el banco elegido (Mercury, Relay o Lili Bank).",
  },
  {
    question: "¿Qué impuestos pago en EE.UU.?",
    answer:
      "Como no residente con una Single Member LLC sin presencia física ni actividad en EE.UU., generalmente no pagás impuestos federales norteamericanos. Te asesoramos en tu caso específico.",
  },
  {
    question: "¿Qué estado me recomiendan para abrir la LLC?",
    answer:
      "Trabajamos principalmente con Wyoming y Nuevo México. Ambos tienen costos bajos, sin impuesto estatal y procesos rápidos. En la llamada de evaluación te recomendamos el que mejor se adapta a tu caso.",
  },
  {
    question: "¿Cuánto cuesta abrir la LLC?",
    answer:
      "Nuestros planes arrancan en $599 USD, incluyendo la formación de la LLC, EIN, Registered Agent y cuenta bancaria.",
  },
  {
    question: "¿Qué pasa con mis impuestos en mi país?",
    answer:
      "Eso depende de las leyes fiscales de tu país de residencia. En la llamada de evaluación te orientamos sobre las implicancias fiscales en tu país específico.",
  },
];
