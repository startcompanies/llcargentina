export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

/**
 * Extracts h2 headings from article HTML and injects `id` attributes
 * so that the Table of Contents can link to them.
 */
export function extractHeadings(html: string): { headings: TocHeading[]; html: string } {
  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();

  const processedHtml = html.replace(
    /<(h2)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string | undefined, content: string) => {
      const text = content.replace(/<[^>]+>/g, '').trim();
      if (!text) return match;

      // Already has an id — keep it and record the heading
      if (attrs && /id\s*=/.test(attrs)) {
        const existingId = attrs.match(/id\s*=\s*["']([^"']+)["']/)?.[1];
        if (existingId) {
          headings.push({ id: existingId, text, level: parseInt(tag[1]) });
        }
        return match;
      }

      let id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter++}`;
      }
      usedIds.add(uniqueId);

      headings.push({ id: uniqueId, text, level: parseInt(tag[1]) });

      return `<${tag}${attrs ?? ''} id="${uniqueId}">${content}</${tag}>`;
    }
  );

  return { headings, html: processedHtml };
}
