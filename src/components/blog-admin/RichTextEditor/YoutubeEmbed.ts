import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      setYoutubeEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

export function youtubeToEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  if (/youtube\.com\/embed\//.test(trimmed)) return trimmed;

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const longMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  return null;
}

export const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.video-embed',
        getAttrs: (node) => {
          const el = node as HTMLElement;
          const iframe = el.querySelector('iframe');
          if (!iframe) return false;
          return { src: iframe.getAttribute('src') };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'video-embed' },
      [
        'iframe',
        mergeAttributes({
          src: HTMLAttributes.src,
          frameborder: '0',
          allowfullscreen: 'true',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeEmbed:
        (options: { src: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: options.src },
          });
        },
    };
  },
});
