import { load, type CheerioAPI } from 'cheerio';
import { normalizeBlogHref } from '@/lib/blog-routes';

export type BlogNormalizationStats = {
  removedElementorArtifacts: number;
  removedDuplicateTitles: number;
  removedTableOfContents: number;
  normalizedTables: number;
  normalizedStepLists: number;
  normalizedInternalLinks: number;
  normalizedButtons: number;
  normalizedInfoBoxes: number;
  normalizedWarningBoxes: number;
  unwrappedEmptyAnchors: number;
  removedEmptyNodes: number;
  removedRatingArtifacts: number;
};

export type BlogNormalizationResult = {
  html: string;
  changed: boolean;
  stats: BlogNormalizationStats;
};

type NormalizeOptions = {
  postTitle?: string | null;
};

const EMPTY_STATS: BlogNormalizationStats = {
  removedElementorArtifacts: 0,
  removedDuplicateTitles: 0,
  removedTableOfContents: 0,
  normalizedTables: 0,
  normalizedStepLists: 0,
  normalizedInternalLinks: 0,
  normalizedButtons: 0,
  normalizedInfoBoxes: 0,
  normalizedWarningBoxes: 0,
  unwrappedEmptyAnchors: 0,
  removedEmptyNodes: 0,
  removedRatingArtifacts: 0
};

const TABLE_OF_CONTENTS_PATTERNS = [/^indice del articulo$/i, /^índice del artículo$/i, /^indice del artículo$/i, /^índice del articulo$/i];
const INTERNAL_LINKS_PATTERNS = [
  /tamb[ií]en te puede interesar/i,
  /tambi[eé]n puede interesarte/i,
  /art[ií]culos relacionados/i,
  /seguir leyendo/i
];
const INFO_LABELS = new Set(['dato importante', 'importante', 'nota', 'consejo', 'recomendación', 'recomendacion']);
const WARNING_LABELS = new Set(['cuidado', 'advertencia', 'atención', 'atencion', 'ojo']);
const CTA_HREF_PATTERNS = [/^\/agendar\/?$/i, /^\/precios\/?$/i, /^\/#contact$/i];
const CTA_TEXT_PATTERNS = [
  /agendar/i,
  /ver planes/i,
  /ver precios/i,
  /abrir tu llc/i,
  /llamada/i,
  /contact/i
];

function createStats(): BlogNormalizationStats {
  return { ...EMPTY_STATS };
}

function normalizeText(value: string) {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeComparableText(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim();
}

function isTableOfContentsLabel(value: string) {
  const normalized = normalizeComparableText(value);
  return TABLE_OF_CONTENTS_PATTERNS.some((pattern) => pattern.test(normalized));
}

function unwrapOrRemoveAnchor($: CheerioAPI, element: Parameters<CheerioAPI['html']>[0], stats: BlogNormalizationStats) {
  const anchor = $(element);
  const contents = anchor.contents();

  if (contents.length > 0) {
    anchor.replaceWith(contents);
  } else {
    anchor.remove();
  }

  stats.unwrappedEmptyAnchors += 1;
}

function isMeaningfulElement($: CheerioAPI, element: Parameters<CheerioAPI['html']>[0]) {
  const node = $(element);

  if (node.is('img,iframe,table,ul,ol,blockquote,hr,figure,figcaption')) {
    return true;
  }

  if (node.find('img,iframe,table,ul,ol,blockquote,hr,figure,figcaption').length > 0) {
    return true;
  }

  return normalizeText(node.text()).length > 0;
}

function removeDuplicateTitle($: CheerioAPI, postTitle: string | null | undefined, stats: BlogNormalizationStats) {
  if (!postTitle) {
    return;
  }

  const body = $('body').first();
  const firstHeading = (body.length > 0 ? body.children('h1').first() : $.root().children('h1').first());

  if (firstHeading.length === 0) {
    return;
  }

  const headingText = normalizeComparableText(firstHeading.text());
  const titleText = normalizeComparableText(postTitle);

  if (headingText && titleText && (headingText === titleText || headingText.includes(titleText) || titleText.includes(headingText))) {
    firstHeading.remove();
    stats.removedDuplicateTitles += 1;
  }
}

function removeTableOfContents($: CheerioAPI, stats: BlogNormalizationStats) {
  $('p,div,h2,h3,strong').each((_, element) => {
    const node = $(element);
    const text = normalizeText(node.text());

    if (!text || !isTableOfContentsLabel(text)) {
      return;
    }

    const next = node.next();
    node.remove();
    stats.removedTableOfContents += 1;

    if (next.is('ul,ol')) {
      const hashLinks = next.find('a[href^="#"]');

      if (hashLinks.length > 0 || normalizeText(next.text()).length < 20) {
        next.remove();
        stats.removedTableOfContents += 1;
      }
    }
  });
}

function normalizeTables($: CheerioAPI, stats: BlogNormalizationStats) {
  $('table').each((_, element) => {
    const table = $(element);

    if (!table.hasClass('comparison-table')) {
      table.addClass('comparison-table');
      stats.normalizedTables += 1;
    }

    table.find('th,td').each((__, cellElement) => {
      const cell = $(cellElement);

      if (cell.children().length > 0) {
        return;
      }

      const text = normalizeComparableText(cell.text());

      if (['si', 'sí', 'yes', 'check', 'ok', 'true'].includes(text) || /^(✅|✔|✓)$/.test(normalizeText(cell.text()))) {
        cell.html('<span class="check">Sí</span>');
        return;
      }

      if (['no', 'false'].includes(text) || /^(❌|✘|✖|x)$/.test(normalizeText(cell.text()))) {
        cell.html('<span class="cross">No</span>');
      }
    });
  });
}

function normalizeStepLists($: CheerioAPI, stats: BlogNormalizationStats) {
  $('ol').each((_, element) => {
    const list = $(element);
    const items = list.children('li');

    if (list.hasClass('step-list') || items.length < 3) {
      return;
    }

    if (list.parents('li').length > 0) {
      return;
    }

    list.addClass('step-list');
    stats.normalizedStepLists += 1;

    items.each((__, itemElement) => {
      const item = $(itemElement);

      if (item.children('.step-content').length > 0) {
        return;
      }

      const wrapper = $('<div class="step-content"></div>');
      wrapper.append(item.contents());
      item.append(wrapper);
    });
  });
}

function normalizeInternalLinks($: CheerioAPI, stats: BlogNormalizationStats) {
  $('p,div').each((_, element) => {
    const labelNode = $(element);
    const labelText = normalizeText(labelNode.text());

    if (!labelText || !INTERNAL_LINKS_PATTERNS.some((pattern) => pattern.test(labelText))) {
      return;
    }

    const list = labelNode.next();

    if (!list.is('ul,ol')) {
      return;
    }

    const links = list.find('a[href]').toArray();

    if (links.length === 0) {
      return;
    }

    const box = $('<div class="internal-links"></div>');
    box.append($('<p></p>').text(labelText));

    links.forEach((linkElement) => {
      const sourceLink = $(linkElement);
      const href = sourceLink.attr('href')?.trim();
      const text = normalizeText(sourceLink.text());

      if (!href || !text) {
        return;
      }

      const link = $('<a></a>');
      link.attr('href', href);
      link.text(text);
      box.append(link);
    });

    if (box.find('a').length === 0) {
      return;
    }

    labelNode.replaceWith(box);
    list.remove();
    stats.normalizedInternalLinks += 1;
  });
}

function normalizeButtonLinks($: CheerioAPI, stats: BlogNormalizationStats) {
  $('a[href]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href')?.trim() || '';
    const text = normalizeText(link.text());

    if (!href || !text || link.hasClass('btn-cta')) {
      return;
    }

    const isCtaHref = CTA_HREF_PATTERNS.some((pattern) => pattern.test(href));
    const isCtaText = CTA_TEXT_PATTERNS.some((pattern) => pattern.test(text));

    if (!isCtaHref && !isCtaText) {
      return;
    }

    const parent = link.parent();
    const isStandalone = parent.is('p,div') && normalizeText(parent.text()) === text;

    if (!isStandalone) {
      return;
    }

    link.addClass('btn-cta');
    stats.normalizedButtons += 1;
  });
}

function normalizeCalloutParagraphs($: CheerioAPI, stats: BlogNormalizationStats) {
  $('p').each((_, element) => {
    const paragraph = $(element);

    if (paragraph.parents('.info-box,.warning-box,.winner-box,.cta-box,.internal-links').length > 0) {
      return;
    }

    if (paragraph.find('img,iframe,table,ul,ol').length > 0) {
      return;
    }

    const firstChild = paragraph.contents().first();
    const isStrongLabel =
      firstChild.length > 0 &&
      firstChild[0]?.type === 'tag' &&
      (firstChild[0] as { name?: string }).name &&
      ['strong', 'b'].includes((firstChild[0] as { name?: string }).name as string);

    if (!isStrongLabel) {
      return;
    }

    const labelTextRaw = normalizeText(firstChild.text()).replace(/:\s*$/, '');
    const labelText = normalizeComparableText(labelTextRaw);

    let boxClass: 'info-box' | 'warning-box' | null = null;

    if (WARNING_LABELS.has(labelText)) {
      boxClass = 'warning-box';
      stats.normalizedWarningBoxes += 1;
    } else if (INFO_LABELS.has(labelText)) {
      boxClass = 'info-box';
      stats.normalizedInfoBoxes += 1;
    }

    if (!boxClass) {
      return;
    }

    firstChild.remove();

    const bodyHtml = normalizeText(paragraph.html() || '');

    if (!bodyHtml) {
      return;
    }

    const box = $(`<div class="${boxClass}"></div>`);
    box.append($('<div class="info-box-title"></div>').text(labelTextRaw));
    box.append($('<p></p>').html(paragraph.html() || ''));
    paragraph.replaceWith(box);
  });
}

/**
 * Removes orphaned rating number nodes left by WordPress review plugins (e.g. "4.5" or "9/10").
 * These appear when the plugin's widget HTML is imported but the CSS classes are stripped,
 * leaving just the raw number in a block element with no surrounding context.
 */
function removeRatingArtifacts($: CheerioAPI, stats: BlogNormalizationStats) {
  $('p, div, span').each((_, element) => {
    const node = $(element);

    if (node.children().length > 0) {
      return;
    }

    if (node.parents('.info-box,.warning-box,.winner-box,.cta-box,.internal-links,.comparison-table').length > 0) {
      return;
    }

    const text = normalizeText(node.text());

    // Matches isolated rating numbers: "4.5", "4,5", "9/10", "4.5/5", "9.2/10" etc.
    if (/^\d+([.,]\d+)?(\/\d+)?$/.test(text)) {
      node.remove();
      stats.removedRatingArtifacts += 1;
    }
  });
}

function removeEmptyNodes($: CheerioAPI, stats: BlogNormalizationStats) {
  $('p,div,section,span').each((_, element) => {
    const node = $(element);

    if (node.attr('class')) {
      return;
    }

    if (isMeaningfulElement($, element)) {
      return;
    }

    node.remove();
    stats.removedEmptyNodes += 1;
  });
}

function cleanupHtml(html: string) {
  return html
    // Strip all WordPress shortcodes: [shortcode ...], [/shortcode], [shortcode /]
    .replace(/\[\/?\w[\w-]*[^\]]*\]/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function summarizeNormalizationStats(stats: BlogNormalizationStats) {
  return Object.entries(stats)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
}

export function normalizeBlogRichTextHtml(inputHtml: string, options: NormalizeOptions = {}): BlogNormalizationResult {
  const initialHtml = inputHtml || '';
  const strippedHtml = initialHtml.replace(/\[elementor-template[^\]]*]/gi, '');
  const stats = createStats();

  if (strippedHtml !== initialHtml) {
    stats.removedElementorArtifacts += 1;
  }

  const $ = load(strippedHtml);
  $('a').each((_, element) => {
    const link = $(element);
    const href = normalizeText(link.attr('href') || '');

    if (!href || href === '#') {
      unwrapOrRemoveAnchor($, element, stats);
      return;
    }

    const normalizedHref = normalizeBlogHref(href);

    if (!normalizedHref) {
      unwrapOrRemoveAnchor($, element, stats);
      return;
    }

    if (normalizedHref !== href) {
      link.attr('href', normalizedHref);
    }
  });

  removeDuplicateTitle($, options.postTitle, stats);
  removeTableOfContents($, stats);
  normalizeTables($, stats);
  normalizeStepLists($, stats);
  normalizeInternalLinks($, stats);
  normalizeButtonLinks($, stats);
  normalizeCalloutParagraphs($, stats);
  removeRatingArtifacts($, stats);
  removeEmptyNodes($, stats);

  const bodyHtml = $('body').first().html();
  const html = cleanupHtml(bodyHtml || $.root().html() || '');

  return {
    html,
    changed: html !== cleanupHtml(initialHtml),
    stats
  };
}
