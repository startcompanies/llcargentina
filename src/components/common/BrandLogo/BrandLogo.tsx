import Image from 'next/image';
import styles from './BrandLogo.module.css';

type BrandLogoProps = {
  className?: string;
  tone?: 'dark' | 'light' | 'full-white';
  alt?: string;
  priority?: boolean;
};

const toneToSrc = {
  dark: '/brand/llc-argentina-white-text.svg',
  light: '/brand/llc-argentina-white-text.svg',
  'full-white': '/brand/llc-argentina-white-text.svg'
} as const;

export function BrandLogo({ className = '', tone = 'dark', alt = 'LLC Argentina', priority = false }: BrandLogoProps) {
  return (
    <span className={`${styles.root} ${className}`.trim()}>
      <Image className={styles.image} src={toneToSrc[tone]} alt={alt} width={520} height={120} unoptimized priority={priority} />
    </span>
  );
}
