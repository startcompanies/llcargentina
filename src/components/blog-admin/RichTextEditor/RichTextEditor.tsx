'use client';

import { useEffect, useState } from 'react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { DEFAULT_IMAGE_SIZE, IMAGE_SIZE_OPTIONS, normalizeImageSize, ResizableImage, type ImageSizeOption } from './ResizableImage';
import { YoutubeEmbed, youtubeToEmbedUrl } from './YoutubeEmbed';
import styles from './RichTextEditor.module.css';

type RichTextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
};

function ToolbarButton({ label, onClick, isActive }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={isActive ? `${styles.toolbarButton} ${styles.toolbarButtonActive}` : styles.toolbarButton}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ value, placeholder = 'Escribí el contenido…', onChange }: RichTextEditorProps) {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSizeOption>(DEFAULT_IMAGE_SIZE);
  const [imageToolbarPosition, setImageToolbarPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Link.configure({
        openOnClick: false
      }),
      ResizableImage,
      YoutubeEmbed,
      Placeholder.configure({
        placeholder
      })
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (currentHtml !== value) {
      editor.commands.setContent(value || '', {
        emitUpdate: false
      });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateImageToolbar = () => {
      const selectedImage = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null;
      const active = editor.isActive('image') && Boolean(selectedImage);

      setIsImageSelected(active);
      setSelectedImageSize(normalizeImageSize(editor.getAttributes('image').dataSize));

      if (!active || !selectedImage) {
        return;
      }

      const rect = selectedImage.getBoundingClientRect();
      const toolbarWidth = 308;
      const top = rect.top > 84 ? rect.top - 58 : rect.bottom + 12;
      const left = Math.min(Math.max(16, rect.left), Math.max(16, window.innerWidth - toolbarWidth - 16));

      setImageToolbarPosition({
        top,
        left
      });
    };

    const syncImageSelection = () => {
      updateImageToolbar();
    };

    syncImageSelection();
    editor.on('selectionUpdate', syncImageSelection);
    editor.on('transaction', syncImageSelection);
    window.addEventListener('scroll', syncImageSelection, { passive: true });
    window.addEventListener('resize', syncImageSelection);

    return () => {
      editor.off('selectionUpdate', syncImageSelection);
      editor.off('transaction', syncImageSelection);
      window.removeEventListener('scroll', syncImageSelection);
      window.removeEventListener('resize', syncImageSelection);
    };
  }, [editor]);

  if (!editor) {
    return <div className={styles.loading}>Cargando editor…</div>;
  }

  const applyImageSize = (nextSize: ImageSizeOption) => {
    setSelectedImageSize(nextSize);
    editor.chain().focus().updateAttributes('image', { dataSize: nextSize === DEFAULT_IMAGE_SIZE ? null : nextSize }).run();
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <ToolbarButton label="P" onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} />
        <ToolbarButton label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
        <ToolbarButton label="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} />
        <ToolbarButton label="B" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
        <ToolbarButton label="I" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
        <ToolbarButton label="UL" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
        <ToolbarButton label="OL" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
        <ToolbarButton label="Cita" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
        <ToolbarButton
          label="Link"
          isActive={editor.isActive('link')}
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || '';
            const url = window.prompt('Pegá la URL del link', previousUrl);

            if (url === null) {
              return;
            }

            if (!url.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
          }}
        />
        <ToolbarButton
          label="Video"
          onClick={() => {
            const url = window.prompt('Pegá la URL de YouTube (ej: https://www.youtube.com/watch?v=...)');
            if (!url?.trim()) return;
            const embedUrl = youtubeToEmbedUrl(url.trim());
            if (!embedUrl) {
              window.alert('URL de YouTube no válida. Usá el formato https://www.youtube.com/watch?v=ID');
              return;
            }
            editor.chain().focus().setYoutubeEmbed({ src: embedUrl }).run();
          }}
        />
      </div>

      {isImageSelected ? (
        <div
          className={styles.imageControlsFloating}
          style={{
            top: `${imageToolbarPosition.top}px`,
            left: `${imageToolbarPosition.left}px`
          }}
        >
          <div>
            <div className={styles.imageControlsLabel}>Imagen seleccionada</div>
            <div className={styles.imageControlsHint}>El tamaño se guarda en el HTML y afecta el post publicado.</div>
          </div>

          <div className={styles.imageButtons}>
            {IMAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className={selectedImageSize === size ? `${styles.imageSizeButton} ${styles.imageSizeButtonActive}` : styles.imageSizeButton}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyImageSize(size)}
              >
                {size}%
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} className={styles.content} />
    </div>
  );
}
