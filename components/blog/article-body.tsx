/** Contenido editorial fijo (HTML generado en servidor). */
export function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="blog-article-body space-y-5 text-base leading-relaxed text-muted-foreground [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-balance [&_h2]:border-b [&_h2]:border-border/60 [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:first:mt-0 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-pretty [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_figure]:my-8 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-border/70 [&_table]:text-sm [&_th]:border-b [&_th]:border-border/70 [&_th]:bg-muted/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_td]:border-b [&_td]:border-border/50 [&_td]:px-3 [&_td]:py-2 [&_details]:my-3 [&_details]:rounded-lg [&_details]:border [&_details]:border-border/60 [&_details]:bg-muted/15 [&_details]:px-3 [&_details]:py-2 [&_summary]:cursor-pointer [&_summary]:select-none [&_summary]:font-semibold [&_summary]:text-foreground [&_details_p]:mt-2 [&_details_ul]:mt-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
