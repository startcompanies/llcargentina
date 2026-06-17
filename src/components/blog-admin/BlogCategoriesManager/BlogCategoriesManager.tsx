import { CategoryIcon } from '@prisma/client';
import { saveCategoryAction } from '@/app/blog-admin/actions';
import type { BlogAdminAssetOption, BlogAdminCategoryRecord } from '@/lib/blog-admin-types';
import styles from './BlogCategoriesManager.module.css';

type BlogCategoriesManagerProps = {
  categories: BlogAdminCategoryRecord[];
  assets: BlogAdminAssetOption[];
};

const ICON_OPTIONS: Array<{ value: CategoryIcon; label: string }> = [
  { value: CategoryIcon.BUILDING, label: 'Building' },
  { value: CategoryIcon.RECEIPT, label: 'Receipt' },
  { value: CategoryIcon.BANK, label: 'Bank' },
  { value: CategoryIcon.DOCUMENT, label: 'Document' },
  { value: CategoryIcon.GLOBE, label: 'Globe' }
];

function CategoryForm({
  title,
  description,
  defaultValues,
  assets
}: {
  title: string;
  description: string;
  defaultValues?: BlogAdminCategoryRecord;
  assets: BlogAdminAssetOption[];
}) {
  return (
    <form action={saveCategoryAction} className={styles.card}>
      <input type="hidden" name="categoryId" value={defaultValues?.id || ''} />

      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>

      <label className={styles.field}>
        <span>Nombre</span>
        <input type="text" name="name" defaultValue={defaultValues?.name || ''} required />
      </label>

      <label className={styles.field}>
        <span>Slug</span>
        <input type="text" name="slug" defaultValue={defaultValues?.slug || ''} placeholder="se genera desde el nombre si lo dejás vacío" />
      </label>

      <label className={styles.field}>
        <span>Descripción</span>
        <textarea name="description" defaultValue={defaultValues?.description || ''} rows={4} />
      </label>

      <label className={styles.field}>
        <span>Icono</span>
        <select name="icon" defaultValue={defaultValues?.icon || CategoryIcon.DOCUMENT}>
          {ICON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Imagen de card existente</span>
        <select name="cardImageId" defaultValue={defaultValues?.cardImageId || ''}>
          <option value="">Sin imagen seleccionada</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Subir nueva imagen de card</span>
        <input type="file" name="cardImageFile" accept="image/*" />
      </label>

      <label className={styles.field}>
        <span>Alt de la imagen</span>
        <input type="text" name="cardImageAlt" placeholder="Describe la imagen" />
      </label>

      <button type="submit" className={styles.submitButton}>
        {defaultValues ? 'Guardar cambios' : 'Crear categoría'}
      </button>
    </form>
  );
}

export function BlogCategoriesManager({ categories, assets }: BlogCategoriesManagerProps) {
  return (
    <div className={styles.layout}>
      <CategoryForm
        title="Nueva categoría"
        description="Creá categorías del blog con slug, icono e imagen de portada para el índice."
        assets={assets}
      />

      <div className={styles.existing}>
        <div className={styles.sectionHeader}>
          <div className={styles.kicker}>Taxonomía</div>
          <h2 className={styles.title}>Categorías existentes</h2>
        </div>

        {categories.length === 0 ? (
          <div className={styles.empty}>Todavía no hay categorías guardadas.</div>
        ) : (
          <div className={styles.grid}>
            {categories.map((category) => (
              <CategoryForm
                key={category.id}
                title={category.name}
                description={`Slug actual: ${category.slug}`}
                defaultValues={category}
                assets={assets}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
