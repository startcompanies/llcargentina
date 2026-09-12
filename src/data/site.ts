export const site = {
  name: 'LLC Argentina',
  url: 'https://www.llcargentina.com',
  description: 'Acompanamiento para abrir y ordenar tu LLC en Estados Unidos desde Latinoamerica, de forma remota y con una hoja de ruta clara.',
  email: 'hola@llcargentina.com',
  phone: '+1 786 935-4213',
  address: 'Miami, Florida, Estados Unidos',
  whatsapp: 'https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC%20desde%20Argentina%20%5BSC%3Allcargentina%5D',
  calendar: 'https://cal.com/startcompanies-businessenusa/calendario-crea-tu-llc-by-start-companies',
  poweredBy: 'https://www.startcompanies.io/',
  startProcess: 'https://panel.startcompanies.io/apertura-llc',
  socials: {
    instagram: 'https://www.instagram.com/startcompanies',
    linkedin: 'https://www.linkedin.com/company/startcompanies/',
    youtube: 'https://www.youtube.com/@AdministracionStartCompanies',
  },
} as const;

export const calParams = (_content = 'abrir_llc_cta') => ({
  'metadata[origen]': 'satelite-llcargentina',
});

export const calUrl = (content = 'abrir_llc_cta') => {
  const url = new URL(site.calendar);
  Object.entries(calParams(content)).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export const calPath = (content = 'abrir_llc_cta') => `/call/calendario?utm_content=${encodeURIComponent(content)}`;
