import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface PortableTextRendererProps {
  content: PortableTextBlock[]
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText
        value={content}
        components={{
          block: {
            h2: ({ children }) => (
              <h2 className="mb-4 mt-8 text-3xl font-semibold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-3 mt-6 text-2xl font-semibold">{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 border-l-4 border-border pl-6 italic text-foreground-muted">
                {children}
              </blockquote>
            ),
            normal: ({ children }) => (
              <p className="mb-6 leading-relaxed">{children}</p>
            ),
          },
          marks: {
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-sm">
                {children}
              </code>
            ),
            link: ({ value, children }) => (
              <a 
                href={value?.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:no-underline focus-ring"
              >
                {children}
              </a>
            ),
          },
          types: {
            image: ({ value }) => (
              <img
                src={value?.asset?.url}
                alt={value?.alt || ''}
                loading="lazy"
                className="my-6 max-w-full rounded"
              />
            ),
          },
        }}
      />
    </div>
  )
}

