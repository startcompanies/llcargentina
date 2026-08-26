export const site = {
  name: 'LLC Argentina',
  url: 'https://www.llcargentina.com',
  description: 'Acompanamiento para abrir y ordenar tu LLC en Estados Unidos desde Latinoamerica, de forma remota y con una hoja de ruta clara.',
  email: 'hola@llcargentina.com',
  phone: '+1 786 935-4213',
  address: 'Miami, Florida, Estados Unidos',
  whatsapp: 'https://wa.me/17869354213?text=Hola%2C%20vengo%20de%20LLC%20Argentina%20y%20quiero%20consultar%20por%20la%20apertura%20de%20una%20LLC',
  calendar: 'https://cal.com/startcompanies-businessenusa/calendario-crea-tu-llc-by-start-companies',
  poweredBy: 'https://www.startcompanies.io/',
  startProcess: 'https://panel.startcompanies.io/apertura-llc',
  socials: {
    instagram: 'https://www.instagram.com/startcompanies',
    linkedin: 'https://www.linkedin.com/company/startcompanies/',
    youtube: 'https://www.youtube.com/@AdministracionStartCompanies',
  },
} as const;

export const calParams = (content = 'abrir_llc_cta') => ({
  utm_source: 'llcargentina',
  utm_medium: 'website',
  utm_campaign: 'apertura_llc',
  utm_term: 'abrir_llc',
  utm_content: content,
  source: 'llcargentina',
});

export const calUrl = (content = 'abrir_llc_cta') => {
  const url = new URL(site.calendar);
  Object.entries(calParams(content)).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export const calPath = (content = 'abrir_llc_cta') => `/call/calendario?utm_content=${encodeURIComponent(content)}`;
