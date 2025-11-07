'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown renderer with GitHub Flavored Markdown and syntax highlighting
 * Uses Tailwind Typography (prose) for beautiful styling
 */
export default function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-pink-600 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-lg dark:prose-a:text-blue-400 dark:prose-code:text-pink-400 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom rendering for links to handle external URLs
          a: ({ node, children, href, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          // Add responsive classes to images
          img: ({ node, ...props }) => (
            <img
              className="mx-auto"
              loading="lazy"
              {...props}
              alt={props.alt || 'Image'}
            />
          ),
          // Add custom styling to tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
