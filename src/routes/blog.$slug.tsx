import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { blogPosts, BlogPost } from "../lib/blogData";
import { api } from "../lib/api";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostDetailPage,
});

function renderMarkdownContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="my-4 list-disc pl-6 space-y-2 text-foreground font-sans">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded text-xs font-mono'>$1</code>")
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline hover:opacity-80'>$1</a>");
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className="text-lg font-bold text-foreground mt-6 mb-3 font-sans">
          {trimmed.replace("### ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h2 key={`h2-${idx}`} className="text-xl font-bold text-primary mt-8 mb-4 font-sans border-b border-border pb-2">
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed === "---") {
      flushList(idx);
      elements.push(<hr key={`hr-${idx}`} className="my-8 border-border" />);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ")) {
      inList = true;
      listItems.push(trimmed.replace(/^[-1234567890\.]+\s+/, ""));
    } else if (trimmed.length > 0) {
      flushList(idx);
      elements.push(
        <p key={`p-${idx}`} className="my-3 leading-[1.8] text-[15px] sm:text-[16px] text-foreground font-sans" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList(lines.length);
  return elements;
}

function BlogPostDetailPage() {
  const { slug } = Route.useParams();
  const fallback = blogPosts.find((p) => p.slug === slug) || blogPosts[0];
  const [post, setPost] = useState<BlogPost>(fallback);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await api.getBlogPostDetail(slug);
        if (res && res.title) {
          setPost({
            slug: res.slug || slug,
            title: res.title,
            excerpt: res.excerpt || "",
            date: "24 July 2026",
            readTime: res.read_time || "5 min read",
            author: res.author || "Shamsuddeen Yusuf",
            category: res.category || "Scam Prevention",
            content: res.content || "",
          });
        }
      } catch (e) {
        // Fallback to static post
      }
    }
    loadDetail();
  }, [slug]);

  const blogArticleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": "2026-07-24T00:00:00Z",
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://github.com/shamsuddeein"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RecruitmentAlert",
      "url": "https://www.recruitmentalert.com.ng"
    }
  };

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
        "name": "Blog",
        "item": "https://www.recruitmentalert.com.ng/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.recruitmentalert.com.ng/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans selection:bg-secondary/25">
      <SeoHead
        title={`${post.title}. RecruitmentAlert`}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        jsonLd={[blogArticleSchema, breadcrumbSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto max-w-[760px] w-full px-4 sm:px-6 py-12 outline-none">
        
        {/* Breadcrumb */}
        <div className="mb-6 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> &rarr; <Link to="/blog" className="hover:text-primary">Blog</Link> &rarr; Guide
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8 text-left">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] px-2.5 py-1 rounded font-bold uppercase">
              {post.category}
            </span>
            <span>&middot;</span>
            <span>{post.readTime}</span>
            <span>&middot;</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            {post.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Article Body */}
        <article className="py-8 font-sans">
          {renderMarkdownContent(post.content)}
        </article>

        {/* Author Bio Footer */}
        <div className="mt-10 rounded-[8px] border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#0a5c38] text-white flex items-center justify-center font-bold text-sm font-mono shrink-0">
              SY
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Written by {post.author}</h4>
              <p className="text-xs text-muted-foreground font-sans">
                Backend developer in Kaduna, Nigeria. Built RecruitmentAlert in July 2026 to protect Nigerian job seekers from recruitment scams.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <Link to="/blog" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-sans">
            &larr; Back to All Blog Guides
          </Link>
          <Link to="/portals" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-sans">
            View 42 Monitored Portals &rarr;
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
