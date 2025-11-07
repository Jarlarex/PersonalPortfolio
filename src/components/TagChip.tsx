import Link from 'next/link';

interface TagChipProps {
  tag: string;
  count?: number;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

/**
 * Tag chip component for displaying and filtering by tags
 */
export default function TagChip({
  tag,
  count,
  active = false,
  href,
  onClick,
}: TagChipProps) {
  const className = `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
    active
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
  }`;

  const content = (
    <>
      <span>{tag}</span>
      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs ${
            active
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-pressed={active}
      >
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}

