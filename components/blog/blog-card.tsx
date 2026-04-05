import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";
import { estimateReadingMinutes, estimateWordCount } from "@/lib/blog/types";

export function BlogCard({ post }: { post: BlogPost }) {
  const words = estimateWordCount(post.contentHtml);
  const mins = estimateReadingMinutes(words);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="card-tech-hover h-full overflow-hidden border-border/80 bg-card/90 transition-all duration-300 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500 to-primary/60 opacity-90 transition-opacity group-hover:opacity-100" />
        <CardContent className="flex h-full flex-col p-6 sm:p-7">
          <div className="flex flex-wrap gap-2">
            {post.keywords.slice(0, 3).map((k) => (
              <Badge key={k} variant="secondary" className="text-[10px] font-normal">
                {k}
              </Badge>
            ))}
          </div>
          <h2 className="mt-4 text-balance text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {post.title}
          </h2>
          <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {post.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3.5 w-3.5" />
              {mins} min
            </span>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Leer artículo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
