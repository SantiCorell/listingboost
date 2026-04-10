import type { BlogPost } from "./types";
import { article01 } from "./articles/article-01";
import { article02 } from "./articles/article-02";
import { article03 } from "./articles/article-03";
import { article04 } from "./articles/article-04";
import { article05 } from "./articles/article-05";
import { article06 } from "./articles/article-06";
import { article07 } from "./articles/article-07";
import { article08 } from "./articles/article-08";
import { article09 } from "./articles/article-09";
import { article10 } from "./articles/article-10";
import { article11 } from "./articles/article-11";
import { pillarBatchA } from "./articles/pillars-batch-a";
import { pillarBatchB } from "./articles/pillars-batch-b";
import { PILLAR_LONG_APPENDIX } from "./articles/pillar-long-appendix";
import { PILLAR_LONG_APPENDIX_PART2 } from "./articles/pillar-long-appendix-part2";
import { PILLAR_LONG_APPENDIX_PART3 } from "./articles/pillar-long-appendix-part3";

function withPillarAppendix(post: BlogPost): BlogPost {
  const extra = [
    PILLAR_LONG_APPENDIX[post.slug],
    PILLAR_LONG_APPENDIX_PART2[post.slug],
    PILLAR_LONG_APPENDIX_PART3[post.slug],
  ]
    .filter(Boolean)
    .join("\n");
  if (!extra) return post;
  return { ...post, contentHtml: `${post.contentHtml}\n${extra}` };
}

/** Todos los artículos, más recientes primero. */
export const BLOG_POSTS: BlogPost[] = [
  article01,
  article02,
  article03,
  article04,
  article05,
  article06,
  article07,
  article08,
  article09,
  article10,
  article11,
  ...pillarBatchA.map(withPillarAppendix),
  ...pillarBatchB.map(withPillarAppendix),
].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export const BLOG_POSTS_PER_PAGE = 4;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsPage(requestedPage: number): {
  posts: BlogPost[];
  totalPages: number;
  page: number;
} {
  const totalPages = Math.max(1, Math.ceil(BLOG_POSTS.length / BLOG_POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * BLOG_POSTS_PER_PAGE;
  return {
    posts: BLOG_POSTS.slice(start, start + BLOG_POSTS_PER_PAGE),
    totalPages,
    page,
  };
}
