/** Contenido editorial fijo (HTML generado en servidor). */
export function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="blog-article-body space-y-5 text-base leading-relaxed text-muted-foreground [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-balance [&_h2]:border-b [&_h2]:border-border/60 [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:first:mt-0 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-pretty [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
