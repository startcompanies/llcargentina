type ArrowIconProps = {
  direction?: 'right' | 'left';
  size?: number;
};

export function ArrowIcon({ direction = 'right', size = 14 }: ArrowIconProps) {
  const d = direction === 'right' ? 'M5 12h14M12 5l7 7-7 7' : 'M19 12H5M12 19l-7-7 7-7';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
}
