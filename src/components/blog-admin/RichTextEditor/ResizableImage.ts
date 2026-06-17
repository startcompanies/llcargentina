import Image from '@tiptap/extension-image';

export const IMAGE_SIZE_OPTIONS = ['100', '80', '66', '50'] as const;
export type ImageSizeOption = (typeof IMAGE_SIZE_OPTIONS)[number];
export const DEFAULT_IMAGE_SIZE: ImageSizeOption = '100';

export function normalizeImageSize(value?: string | null): ImageSizeOption {
  if (!value) {
    return DEFAULT_IMAGE_SIZE;
  }

  return (IMAGE_SIZE_OPTIONS as readonly string[]).includes(value) ? (value as ImageSizeOption) : DEFAULT_IMAGE_SIZE;
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dataSize: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-size'),
        renderHTML: (attributes) => {
          const normalized = normalizeImageSize(typeof attributes.dataSize === 'string' ? attributes.dataSize : null);
          return normalized === DEFAULT_IMAGE_SIZE
            ? {}
            : {
                'data-size': normalized
              };
        }
      }
    };
  }
});
