import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { blogPosts as fallbackPosts, BlogPost } from "../lib/blogData";
import { api } from "../lib/api";
import { safeFormatDateTime } from "../lib/formatDate";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await api.getBlogPosts();
        if (res && res.results && res.results.length > 0) {
          const mapped: BlogPost[] = res.results.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: safeFormatDateTime(p.created_at, "24 July 2026"),
            readTime: p.read_time || "5 min read",
            author: p.author || "Shamsuddeen Yusuf",
            category: p.category || "Scam Prevention",
            content: p.content,
          }));
          setPosts(mapped);
        }
      } catch (e) {
        // Fallback to static articles
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.recruitmentalert.com.ng"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Scam Awareness Blog",
        "item": "https://www.recruitmentalert.com.ng/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans selection:bg-secondary/25">
      <SeoHead
        title="Recruitment Guides and Tech Tutorials — RecruitmentAlert Blog"
        description="Practical articles on spotting fake Nigerian recruitment portals and software development tutorials by Shamsuddeen Yusuf."
        canonicalUrl="/blog"
        jsonLd={[breadcrumbSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto max-w-[960px] w-full px-4 sm:px-6 py-12 space-y-10 outline-none">
        
        <div className="border-b border-border pb-8 space-y-3 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
            Recruitment Scam Awareness Blog
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Guides on spotting fake portals, understanding how real federal recruitment works, and what to do if you have already paid.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-[8px] border border-border bg-card p-6 interactive-card hover:border-[#0a5c38]/50 dark:hover:border-[#3fb68e]/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-end text-xs font-mono text-muted-foreground">
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{post.date}</span>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold hover:underline"
                >
                  Read article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          Spot a suspicious portal?{" "}
          <Link to="/portals" className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold hover:underline">
            Check the 42 monitored portals directory &rarr;
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
