import { CategoryIcon, PostSectionType, type PostSection } from '@prisma/client';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { normalizeBlogHref } from '@/lib/blog-routes';

const INTERNAL_WORDPRESS_HOSTS = new Set(['businessenusa.com', 'www.businessenusa.com']);

type RenderableSection = Pick<PostSection, 'type' | 'html'>;

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeImportedUrl(value: string) {
  try {
    const url = new URL(value);

    if (INTERNAL_WORDPRESS_HOSTS.has(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return value;
  } catch {
    return value;
  }
}

// CSS classes that are styled in BlogArticleContent.module.css and should survive sanitization.
const ALLOWED_CLASSES = new Set([
  'info-box', 'info-box-title',
  'warning-box',
  'winner-box',
  'comparison-table', 'check', 'cross',
  'step-list', 'step-content',
  'internal-links',
  'cta-box', 'cta-box-inner', 'cta-box-kicker', 'cta-box-copy',
  'cta-box-actions', 'cta-box-footnote', 'cta-box-icon',
  'cta-box-consultation',
  'btn-cta', 'btn-cta-primary', 'btn-cta-secondary',
  'tax-timeline', 'tax-timeline-item', 'tax-timeline-date', 'tax-timeline-text',
  'bank-cards', 'bank-card', 'bank-name', 'bank-tag', 'featured',
  'rejection-list', 'reject-icon', 'reject-content',
  'tip-list',
  'state-cards', 'state-card', 'state-card-label', 'recommended',
  'use-case-grid', 'use-case-item', 'icon',
  'faq-item',
  'faq-section', 'faq-question', 'faq-answer',
  'video-embed',
]);

export function sanitizePostHtml(inputHtml: string) {
  const $ = load(inputHtml || '');

  $('style, script, link, meta').remove();
  $('*[style]').removeAttr('style');

  // Preserve whitelisted classes, strip the rest
  $('*[class]').each((_, element) => {
    const el = $(element);
    const classes = (el.attr('class') || '').split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
    if (classes.length > 0) {
      el.attr('class', classes.join(' '));
    } else {
      el.removeAttr('class');
    }
  });

  $('*[id]').removeAttr('id');

  $('a').each((_, element) => {
    const href = $(element).attr('href');

    if (typeof href !== 'string' || !href.trim()) {
      $(element).removeAttr('href');
      return;
    }

    const normalizedHref = normalizeBlogHref(normalizeImportedUrl(href.trim()));

    if (!normalizedHref) {
      $(element).removeAttr('href');
      return;
    }

    $(element).attr('href', normalizedHref);
  });

  $('img').each((_, element) => {
    const src = $(element).attr('src');

    if (typeof src !== 'string' || !src.trim()) {
      $(element).removeAttr('src');
      return;
    }

    $(element).attr('src', normalizeImportedUrl(src.trim()));
    $(element).removeAttr('srcset');
    $(element).removeAttr('sizes');
    $(element).removeAttr('loading');
  });

  return sanitizeHtml($.root().html() ?? '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'iframe',
      'hr'
    ]),
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'data-size'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
      '*': ['colspan', 'rowspan', 'class']
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
    transformTags: {
      a: (tagName, attribs) => {
        const sanitizedAttribs: Record<string, string> = {};
        const rawHref = typeof attribs.href === 'string' ? attribs.href.trim() : '';
        const href = rawHref ? normalizeBlogHref(normalizeImportedUrl(rawHref)) || '' : '';
        const isExternal = Boolean(href && /^https?:\/\//i.test(href));

        for (const [key, value] of Object.entries(attribs)) {
          if (typeof value === 'string' && value.trim()) {
            sanitizedAttribs[key] = value.trim();
          }
        }

        if (href) {
          sanitizedAttribs.href = href;
        } else {
          delete sanitizedAttribs.href;
        }

        if (isExternal) {
          sanitizedAttribs.rel = 'noopener noreferrer';
          sanitizedAttribs.target = '_blank';
        }

        // Strip nofollow from all links — internal links imported from WordPress
        // may carry rel="nofollow" which should not be present on our own content.
        if (sanitizedAttribs.rel) {
          const cleanRel = sanitizedAttribs.rel
            .split(/\s+/)
            .filter((v) => v !== 'nofollow')
            .join(' ')
            .trim();
          if (cleanRel) {
            sanitizedAttribs.rel = cleanRel;
          } else {
            delete sanitizedAttribs.rel;
          }
        }

        return {
          tagName,
          attribs: sanitizedAttribs
        };
      },
      img: (tagName, attribs) => {
        const sanitizedAttribs: Record<string, string> = {};

        for (const [key, value] of Object.entries(attribs)) {
          if (typeof value === 'string' && value.trim()) {
            sanitizedAttribs[key] = value.trim();
          }
        }

        if (!sanitizedAttribs.src) {
          delete sanitizedAttribs.src;
        }

        return {
          tagName,
          attribs: sanitizedAttribs
        };
      }
    }
  }).trim();
}

export function estimateReadingTimeFromHtml(html: string) {
  const plainText = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function extractFirstImageFromHtml(html: string) {
  const $ = load(html || '');
  const firstImage = $('img[src]').first();
  const src = firstImage.attr('src')?.trim();
  const alt = firstImage.attr('alt')?.trim();

  if (!src) {
    return null;
  }

  return {
    src,
    alt: alt || undefined
  };
}

export type FaqItem = { question: string; answer: string };

export function extractFaqItems(html: string | null | undefined): FaqItem[] {
  try {
    const items = JSON.parse(html || '[]');
    if (!Array.isArray(items)) return [];
    return items.filter((item) => item && typeof item.question === 'string' && typeof item.answer === 'string');
  } catch {
    return [];
  }
}

export function buildFaqSchemaJson(items: FaqItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  });
}

export function renderFaqSection(html: string | null | undefined): string {
  const items = extractFaqItems(html);
  if (!items.length) return '';
  const itemsHtml = items
    .map(
      (item) =>
        `<div class="faq-item"><h3 class="faq-question">${escapeHtml(item.question)}</h3><div class="faq-answer"><p>${escapeHtml(item.answer)}</p></div></div>`
    )
    .join('\n');
  return `<section class="faq-section">${itemsHtml}</section>`;
}

export function renderCtaSection(type: PostSectionType | 'CTA_CONSULTATION' | 'CTA_PRICING') {
  if (type === 'CTA_PRICING') {
    return `
      <div class="cta-box">
        <h2>¿Querés ver planes y precios claros?</h2>
        <p>Compará opciones, entendé qué incluye cada pack y elegí la estructura correcta para tu negocio.</p>
        <a class="btn-cta" href="/#precios">Ver planes y precios</a>
      </div>
    `;
  }

  return `
    <div class="cta-box cta-box-consultation">
      <div class="cta-box-inner">
        <p class="cta-box-kicker">Empezá hoy</p>
        <h2>¿Querés abrir tu LLC sin complicaciones?</h2>
        <p class="cta-box-copy">Nuestro equipo de contadores y tributaristas internacionales te acompaña en todo el proceso. LLC activa en 7 días hábiles.</p>
        <div class="cta-box-actions">
          <a class="btn-cta btn-cta-primary" href="https://panel.llcargentina.io/apertura-llc">
            <span>Abrir mi LLC — desde $599</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            class="btn-cta btn-cta-secondary"
            href="https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC"
          >
            <span class="cta-box-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="4" y="5" width="16" height="15" rx="3"></rect>
                <path d="M8 3.5v3M16 3.5v3M4 9h16"></path>
              </svg>
            </span>
            <span>Consulta gratuita</span>
          </a>
        </div>
        <p class="cta-box-footnote">
          Atendemos por WhatsApp:
          <a href="https://wa.me/17869354213">+1 (786) 935-4213</a>
        </p>
      </div>
    </div>
  `;
}

function youtubeToEmbedUrl(url: string): string | null {
  if (/youtube\.com\/embed\//.test(url)) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return null;
}

function convertYoutubeLinks(html: string): string {
  const $ = load(html);

  $('p').each((_, el) => {
    const p = $(el);
    const children = p.children();
    if (children.length !== 1 || (children[0] as { name?: string }).name !== 'a') return;

    const a = children.first();
    const href = a.attr('href') || '';
    const embedUrl = youtubeToEmbedUrl(href);
    if (!embedUrl) return;

    // Only auto-convert if the link text is the bare URL (not a human-written label)
    const text = a.text().trim();
    if (text !== href && !youtubeToEmbedUrl(text)) return;

    p.replaceWith(
      `<div class="video-embed"><iframe src="${embedUrl}" frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`
    );
  });

  return $.root().html() ?? html;
}

export function renderPostSectionsHtml(sections: RenderableSection[]) {
  return sections
    .map((section) => {
      if (section.type === 'RICH_TEXT') {
        return `<section class="legal-section">${convertYoutubeLinks(section.html ?? '')}</section>`;
      }

      if (section.type === 'CTA_CONSULTATION') {
        return renderCtaSection('CTA_CONSULTATION');
      }

      if (section.type === 'FAQ_MODULE') {
        return renderFaqSection(section.html);
      }

      return renderCtaSection('CTA_PRICING');
    })
    .join('\n');
}

export function mapCategoryIcon(icon: CategoryIcon | null | undefined) {
  switch (icon) {
    case 'BUILDING':
      return 'building' as const;
    case 'RECEIPT':
      return 'receipt' as const;
    case 'BANK':
      return 'bank' as const;
    case 'GLOBE':
      return 'globe' as const;
    case 'DOCUMENT':
    default:
      return 'document' as const;
  }
}

const PUBLISHED_DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export function formatPublishedDate(date: Date) {
  return PUBLISHED_DATE_FORMATTER.format(date);
}
