'use client';

import { PostSectionType, PostStatus } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaqEditor } from '@/components/blog-admin/FaqEditor/FaqEditor';
import { RichTextEditor } from '@/components/blog-admin/RichTextEditor/RichTextEditor';
import { getPublishValidationErrors } from '@/lib/blog-publish-validation';
import { slugify } from '@/lib/slug';
import type { BlogAdminAssetOption, BlogAdminCategoryOption, BlogAdminPostEditorData, BlogAdminPostSectionInput } from '@/lib/blog-admin-types';
import styles from './PostEditorForm.module.css';

type PostEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialPost: BlogAdminPostEditorData;
  categories: BlogAdminCategoryOption[];
  assets: BlogAdminAssetOption[];
  redirectTo: string;
  previewUrl?: string;
  submitLabel?: string;
};

const SECTION_LABELS: Record<PostSectionType, string> = {
  RICH_TEXT: 'Texto enriquecido',
  CTA_CONSULTATION: 'CTA Consulta',
  CTA_PRICING: 'CTA Precios',
  FAQ_MODULE: 'FAQs'
};

function defaultSection(type: PostSectionType = PostSectionType.RICH_TEXT): BlogAdminPostSectionInput {
  return {
    type,
    html: type === PostSectionType.FAQ_MODULE ? '[]' : ''
  };
}

function SectionSummary({ type }: { type: PostSectionType }) {
  if (type === PostSectionType.CTA_PRICING) {
    return <p className={styles.sectionHint}>Este bloque insertará el CTA curado hacia la página de precios.</p>;
  }

  if (type === PostSectionType.CTA_CONSULTATION) {
    return <p className={styles.sectionHint}>Este bloque insertará el CTA curado hacia la agenda de consulta.</p>;
  }

  if (type === PostSectionType.FAQ_MODULE) {
    return null;
  }

  return <p className={styles.sectionHint}>Usá este bloque para el contenido principal del artículo.</p>;
}

type FloatingActionsProps = {
  previewUrl?: string;
  submitLabel: string;
  isPublishing: boolean;
  publishValidationErrors: string[];
  clientError: string | null;
};

function FloatingActions({ previewUrl, submitLabel, isPublishing, publishValidationErrors, clientError }: FloatingActionsProps) {
  const { pending } = useFormStatus();
  const isReadyToPublish = isPublishing && publishValidationErrors.length === 0;

  return (
    <div className={styles.floatingActions}>
      <div className={styles.floatingActionsInner}>
        <div className={styles.floatingSummary}>
          <p className={styles.floatingEyebrow}>{isPublishing ? 'Modo publicación' : 'Guardado rápido'}</p>
          <h3 className={styles.floatingTitle}>
            {pending ? 'Guardando cambios...' : isPublishing ? (isReadyToPublish ? 'Listo para publicar' : 'Faltan datos para publicar') : 'Podés guardar sin subir hasta arriba'}
          </h3>

          {clientError ? <p className={styles.floatingError}>{clientError}</p> : null}

          {!clientError && isPublishing && publishValidationErrors.length > 0 ? (
            <ul className={styles.floatingChecklist}>
              {publishValidationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          {!clientError && (!isPublishing || publishValidationErrors.length === 0) ? (
            <p className={styles.floatingHint}>
              {isPublishing ? 'El post ya cumple los campos mínimos para quedar publicado.' : 'Seguí editando tranquilo: la barra queda fija durante todo el scroll.'}
            </p>
          ) : null}
        </div>

        <div className={styles.floatingButtons}>
          {previewUrl ? (
            <Link href={previewUrl} target="_blank" rel="noreferrer" className={styles.previewLink}>
              Ver preview
            </Link>
          ) : null}

          <button type="submit" className={styles.submitButton} disabled={pending}>
            {pending ? 'Guardando...' : isPublishing ? 'Guardar y publicar' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PostEditorForm({
  action,
  initialPost,
  categories,
  assets,
  redirectTo,
  previewUrl,
  submitLabel = 'Guardar post'
}: PostEditorFormProps) {
  const [title, setTitle] = useState(initialPost.title);
  const [slug, setSlug] = useState(initialPost.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost.slug));
  const [excerpt, setExcerpt] = useState(initialPost.excerpt);
  const [status, setStatus] = useState<PostStatus>(initialPost.status);
  const [heroSubtitle, setHeroSubtitle] = useState(initialPost.heroSubtitle);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialPost.categoryIds);
  const [featuredImageId, setFeaturedImageId] = useState(initialPost.featuredImageId);
  const [hasFeaturedImageUpload, setHasFeaturedImageUpload] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [sections, setSections] = useState<BlogAdminPostSectionInput[]>(
    initialPost.sections.length ? initialPost.sections : [defaultSection()]
  );

  const sectionsJson = useMemo(() => JSON.stringify(sections), [sections]);
  const publishValidationErrors = useMemo(
    () =>
      getPublishValidationErrors({
        status,
        title,
        slug,
        excerpt,
        heroSubtitle,
        categoryIds,
        featuredImageId,
        hasFeaturedImageUpload,
        sections
      }),
    [categoryIds, excerpt, featuredImageId, hasFeaturedImageUpload, heroSubtitle, sections, slug, status, title]
  );
  const isPublishing = status === PostStatus.PUBLISHED;

  const clearClientError = () => {
    if (clientError) {
      setClientError(null);
    }
  };

  return (
    <form
      action={action}
      className={styles.form}
      onSubmit={(event) => {
        setClientError(null);

        if (isPublishing && publishValidationErrors.length > 0) {
          event.preventDefault();
          setClientError(`Faltan datos para publicar: ${publishValidationErrors.join(', ')}.`);
        }
      }}
    >
      <input type="hidden" name="postId" value={initialPost.id || ''} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <input type="hidden" name="sectionsJson" value={sectionsJson} />

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Contenido</h2>
            <p>Configurá el artículo, su estructura y el contenido editable del post.</p>
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Título</span>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(event) => {
                  clearClientError();
                  const nextTitle = event.target.value;
                  setTitle(nextTitle);

                  if (!slugTouched) {
                    setSlug(slugify(nextTitle));
                  }
                }}
                placeholder="Cómo abrir tu LLC en EE.UU."
                required
              />
            </label>

            <label className={styles.field}>
              <span>Slug</span>
              <input
                type="text"
                name="slug"
                value={slug}
                onChange={(event) => {
                  clearClientError();
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                placeholder="como-abrir-tu-llc"
                required
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Excerpt</span>
            <textarea
              name="excerpt"
              value={excerpt}
              onChange={(event) => {
                clearClientError();
                setExcerpt(event.target.value);
              }}
              rows={4}
              placeholder="Resumen breve para cards y SEO secundario."
            />
          </label>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Badge del hero</span>
              <input type="text" name="heroBadge" defaultValue={initialPost.heroBadge} placeholder="Guía para no residentes" />
            </label>

            <label className={styles.field}>
              <span>Subtítulo del hero</span>
              <input
                type="text"
                name="heroSubtitle"
                value={heroSubtitle}
                onChange={(event) => {
                  clearClientError();
                  setHeroSubtitle(event.target.value);
                }}
                placeholder="Explicamos cada paso y el impacto fiscal."
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Título hero con HTML simple</span>
            <textarea
              name="heroTitleHtml"
              defaultValue={initialPost.heroTitleHtml}
              rows={3}
              placeholder="Permitimos &lt;br&gt;, &lt;strong&gt; y &lt;em&gt; para controlar el hero."
            />
          </label>

          <div className={styles.sectionsHeader}>
            <div>
              <h3>Secciones del artículo</h3>
              <p>Texto enriquecido y CTAs curados. Sin bloques arbitrarios.</p>
            </div>

            <div className={styles.sectionActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  clearClientError();
                  setSections((current) => [...current, defaultSection()]);
                }}
              >
                + Texto
              </button>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  clearClientError();
                  setSections((current) => [...current, defaultSection(PostSectionType.CTA_CONSULTATION)]);
                }}
              >
                + CTA consulta
              </button>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  clearClientError();
                  setSections((current) => [...current, defaultSection(PostSectionType.CTA_PRICING)]);
                }}
              >
                + CTA precios
              </button>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  clearClientError();
                  setSections((current) => [...current, defaultSection(PostSectionType.FAQ_MODULE)]);
                }}
              >
                + FAQs
              </button>
            </div>
          </div>

          <div className={styles.sectionsList}>
            {sections.map((section, index) => (
              <div key={`${section.type}-${index}`} className={styles.sectionCard}>
                <div className={styles.sectionToolbar}>
                  <label className={styles.inlineField}>
                    <span>Tipo</span>
                    <select
                      value={section.type}
                      onChange={(event) => {
                        const nextType = event.target.value as PostSectionType;
                        clearClientError();

                        setSections((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  type: nextType,
                                  html: nextType === PostSectionType.RICH_TEXT ? item.html
                                       : nextType === PostSectionType.FAQ_MODULE ? '[]'
                                       : ''
                                }
                              : item
                          )
                        );
                      }}
                    >
                      {Object.entries(SECTION_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className={styles.sectionOrder}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => {
                        clearClientError();
                        setSections((current) => {
                          if (index === 0) {
                            return current;
                          }

                          const next = [...current];
                          const previous = next[index - 1];
                          next[index - 1] = next[index];
                          next[index] = previous;
                          return next;
                        });
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => {
                        clearClientError();
                        setSections((current) => {
                          if (index === current.length - 1) {
                            return current;
                          }

                          const next = [...current];
                          const following = next[index + 1];
                          next[index + 1] = next[index];
                          next[index] = following;
                          return next;
                        });
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={styles.iconButtonDanger}
                      onClick={() => {
                        clearClientError();
                        setSections((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : [defaultSection()]));
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <SectionSummary type={section.type} />

                {section.type === PostSectionType.RICH_TEXT ? (
                  <RichTextEditor
                    value={section.html}
                    onChange={(nextHtml) => {
                      clearClientError();
                      setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, html: nextHtml } : item)));
                    }}
                  />
                ) : section.type === PostSectionType.FAQ_MODULE ? (
                  <FaqEditor
                    value={section.html}
                    onChange={(nextHtml) => {
                      clearClientError();
                      setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, html: nextHtml } : item)));
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Publicación</h2>
              <p>Definí estado, fecha, categorías y assets del artículo.</p>
            </div>

            <label className={styles.field}>
              <span>Estado</span>
              <select
                name="status"
                value={status}
                onChange={(event) => {
                  clearClientError();
                  setStatus(event.target.value as PostStatus);
                }}
              >
                <option value={PostStatus.DRAFT}>Borrador</option>
                <option value={PostStatus.PUBLISHED}>Publicado</option>
                <option value={PostStatus.ARCHIVED}>Archivado</option>
              </select>
            </label>

            {isPublishing ? (
              <div className={publishValidationErrors.length === 0 ? styles.publishReady : styles.publishChecklist}>
                <p className={styles.publishChecklistTitle}>
                  {publishValidationErrors.length === 0 ? 'Listo para publicar' : 'Completá estos datos antes de publicar'}
                </p>

                {publishValidationErrors.length > 0 ? (
                  <ul className={styles.publishChecklistList}>
                    {publishValidationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.publishChecklistHint}>El post ya tiene los mínimos editoriales para quedar público.</p>
                )}
              </div>
            ) : null}

            <label className={styles.field}>
              <span>Publicar en</span>
              <input type="datetime-local" name="publishedAt" defaultValue={initialPost.publishedAt} />
            </label>

            <label className={styles.field}>
              <span>Featured rank</span>
              <input type="number" min="1" step="1" name="featuredRank" defaultValue={initialPost.featuredRank} placeholder="1" />
            </label>

            <fieldset className={styles.fieldset}>
              <legend>Categorías</legend>
              <div className={styles.checkboxList}>
                {categories.map((category) => (
                  <label key={category.id} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={category.id}
                      checked={categoryIds.includes(category.id)}
                      onChange={(event) => {
                        clearClientError();
                        setCategoryIds((current) =>
                          event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id)
                        );
                      }}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <input type="hidden" name="featuredImageId" value={featuredImageId} />

            {featuredImageId ? (
              <div className={styles.imagePreview}>
                <span className={styles.imagePreviewLabel}>Imagen destacada</span>
                {(() => {
                  const asset = assets.find((a) => a.id === featuredImageId);
                  return asset ? (
                    <Image
                      src={asset.url}
                      alt={asset.alt || ''}
                      width={720}
                      height={360}
                      unoptimized
                      className={styles.imagePreviewImg}
                    />
                  ) : null;
                })()}
              </div>
            ) : null}

            <label className={styles.field}>
              <span>Subir nueva imagen destacada</span>
              <input
                type="file"
                name="featuredImageFile"
                accept="image/*"
                onChange={(event) => {
                  clearClientError();
                  setHasFeaturedImageUpload(Boolean(event.target.files?.length));
                }}
              />
            </label>

            <label className={styles.field}>
              <span>Alt de la imagen destacada</span>
              <input type="text" name="featuredImageAlt" placeholder="Describe la imagen" />
            </label>

            <input type="hidden" name="openGraphImageId" value={initialPost.openGraphImageId || ''} />

            <p className={styles.ogImageNote}>
              Se usa la imagen destacada en redes sociales. Subí una imagen diferente solo si necesitás un aspecto distinto para Open Graph.
            </p>

            <label className={styles.field}>
              <span>Subir nueva imagen Open Graph</span>
              <input type="file" name="openGraphImageFile" accept="image/*" />
            </label>

            <label className={styles.field}>
              <span>Alt de la imagen Open Graph</span>
              <input type="text" name="openGraphImageAlt" placeholder="Describe la imagen para redes" />
            </label>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>SEO</h2>
              <p>Campos manuales para título, descripción y canonical.</p>
            </div>

            <label className={styles.field}>
              <span>Meta title</span>
              <input type="text" name="metaTitle" defaultValue={initialPost.metaTitle} placeholder="Título SEO" />
            </label>

            <label className={styles.field}>
              <span>Meta description</span>
              <textarea name="metaDescription" defaultValue={initialPost.metaDescription} rows={4} placeholder="Descripción SEO" />
            </label>

            <label className={styles.field}>
              <span>Canonical URL</span>
              <input type="url" name="canonicalUrl" defaultValue={initialPost.canonicalUrl} placeholder="https://llcargentina.com/blog/slug" />
            </label>

            <label className={styles.field}>
              <span>Keywords</span>
              <textarea name="keywords" defaultValue={initialPost.keywords} rows={3} placeholder="llc, impuestos, no residentes" />
            </label>
          </section>

        </aside>
      </div>

      <FloatingActions
        previewUrl={previewUrl}
        submitLabel={submitLabel}
        isPublishing={isPublishing}
        publishValidationErrors={publishValidationErrors}
        clientError={clientError}
      />
    </form>
  );
}
