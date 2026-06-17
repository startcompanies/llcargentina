import type { Locale } from '@/i18n/config';
import type { TocHeading } from '@/lib/blog-headings';
import { ShareButtons } from '@/components/blog/ShareButtons/ShareButtons';
import { SidebarCta } from '@/components/blog/SidebarCta/SidebarCta';
import { TableOfContents } from '@/components/blog/TableOfContents/TableOfContents';
import styles from './BlogArticleSidebar.module.css';

type BlogArticleSidebarProps = {
  headings: TocHeading[];
  title: string;
  slug: string;
  locale: Locale;
};

export function BlogArticleSidebar({ headings, title, slug, locale }: BlogArticleSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <TableOfContents headings={headings} locale={locale} />
      <div className={styles.sticky}>
        <SidebarCta locale={locale} />
        <ShareButtons title={title} slug={slug} locale={locale} />
      </div>
    </aside>
  );
}
