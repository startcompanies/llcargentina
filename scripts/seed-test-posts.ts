import { loadEnvConfig } from '@next/env';
import { CategoryIcon, PostSectionType, PostStatus } from '@prisma/client';
import { getDb } from '../src/lib/db';

loadEnvConfig(process.cwd());

const posts = [
  {
    slug: 'como-abrir-una-llc-desde-argentina',
    title: 'Cómo abrir una LLC desde Argentina',
    excerpt: 'Una guía inicial para entender requisitos, pasos y tiempos para operar con una LLC en Estados Unidos desde Argentina.',
    category: { name: 'Abrir LLC', slug: 'abrir-llc', icon: CategoryIcon.BUILDING },
    image: '/img/blog-arg.jpg',
    featuredRank: 1,
    html: `
      <p>Abrir una LLC desde Argentina puede ser una forma simple de facturar internacionalmente, separar el patrimonio personal del negocio y acceder a herramientas financieras en dólares.</p>
      <h2>Qué necesitás para empezar</h2>
      <p>En general, el proceso requiere un pasaporte vigente, definir el estado de constitución, elegir un nombre disponible y contar con un agente registrado.</p>
      <h2>Cuánto tarda</h2>
      <p>La formación de la empresa suele resolverse en pocos días hábiles. Luego se gestiona el EIN y la apertura bancaria según el perfil del negocio.</p>
    `
  },
  {
    slug: 'impuestos-llc-no-residentes',
    title: 'Impuestos de una LLC para no residentes',
    excerpt: 'Puntos clave para entender obligaciones fiscales, formularios y criterios generales para una LLC de un dueño no residente.',
    category: { name: 'Impuestos', slug: 'impuestos', icon: CategoryIcon.RECEIPT },
    image: '/img/blog-tax.jpg',
    featuredRank: 2,
    html: `
      <p>La tributación de una LLC depende de la residencia fiscal del dueño, el tipo de actividad, la fuente de ingresos y la existencia o no de presencia efectiva en Estados Unidos.</p>
      <h2>Formularios frecuentes</h2>
      <p>Muchas LLC de no residentes deben presentar formularios informativos aunque no tengan impuesto federal a pagar. Es importante revisar el caso concreto antes de operar.</p>
      <h2>Orden desde el inicio</h2>
      <p>Separar cuentas, documentar ingresos y conservar comprobantes facilita el cumplimiento anual y reduce riesgos.</p>
    `
  },
  {
    slug: 'cuenta-bancaria-para-llc',
    title: 'Cuenta bancaria para tu LLC: opciones online',
    excerpt: 'Qué revisar antes de elegir una cuenta bancaria para recibir pagos, operar en USD y administrar una LLC desde LATAM.',
    category: { name: 'Banca', slug: 'banca', icon: CategoryIcon.BANK },
    image: '/img/blog-mercury.jpg',
    featuredRank: 3,
    html: `
      <p>Una cuenta bancaria empresarial permite operar con clientes internacionales, recibir pagos en dólares y mantener separado el dinero personal del dinero de la empresa.</p>
      <h2>Qué evalúan los bancos</h2>
      <p>Los bancos suelen revisar documentación de la LLC, identidad del dueño, sitio web, actividad comercial y consistencia del modelo de negocio.</p>
      <h2>Buenas prácticas</h2>
      <p>Preparar una descripción clara del negocio y mantener documentos actualizados mejora la experiencia de apertura y reduce pedidos adicionales.</p>
    `
  }
];

async function main() {
  const db = getDb();
  const now = new Date();

  for (const item of posts) {
    const asset = await db.mediaAsset.upsert({
      where: { storageKey: `seed/${item.slug}.jpg` },
      update: {
        url: item.image,
        alt: item.title,
        mimeType: 'image/jpeg',
        fileName: `${item.slug}.jpg`
      },
      create: {
        storageKey: `seed/${item.slug}.jpg`,
        url: item.image,
        alt: item.title,
        mimeType: 'image/jpeg',
        fileName: `${item.slug}.jpg`
      }
    });

    const category = await db.category.upsert({
      where: { slug: item.category.slug },
      update: {
        name: item.category.name,
        icon: item.category.icon,
        description: `Artículos sobre ${item.category.name.toLowerCase()}.`
      },
      create: {
        name: item.category.name,
        slug: item.category.slug,
        icon: item.category.icon,
        description: `Artículos sobre ${item.category.name.toLowerCase()}.`
      }
    });

    await db.post.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        status: PostStatus.PUBLISHED,
        featuredRank: item.featuredRank,
        heroBadge: item.category.name,
        heroSubtitle: item.excerpt,
        metaTitle: item.title,
        metaDescription: item.excerpt,
        keywords: ['LLC', 'Argentina', item.category.name],
        readingTimeMins: 4,
        publishedAt: now,
        featuredImageId: asset.id,
        openGraphImageId: asset.id,
        categories: { set: [{ id: category.id }] },
        sections: {
          deleteMany: {},
          create: [
            {
              type: PostSectionType.RICH_TEXT,
              position: 0,
              html: item.html
            },
            {
              type: PostSectionType.CTA_CONSULTATION,
              position: 1
            }
          ]
        }
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        status: PostStatus.PUBLISHED,
        featuredRank: item.featuredRank,
        heroBadge: item.category.name,
        heroSubtitle: item.excerpt,
        metaTitle: item.title,
        metaDescription: item.excerpt,
        keywords: ['LLC', 'Argentina', item.category.name],
        readingTimeMins: 4,
        publishedAt: now,
        featuredImageId: asset.id,
        openGraphImageId: asset.id,
        categories: { connect: [{ id: category.id }] },
        sections: {
          create: [
            {
              type: PostSectionType.RICH_TEXT,
              position: 0,
              html: item.html
            },
            {
              type: PostSectionType.CTA_CONSULTATION,
              position: 1
            }
          ]
        }
      }
    });
  }

  console.log(`Seeded ${posts.length} test posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
