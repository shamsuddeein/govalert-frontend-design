import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { blogPosts } from "../lib/blogData";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

function BlogIndexPage() {
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
        title="Nigerian Government Recruitment & Anti-Scam Guides — RecruitmentAlert Blog"
        description="Official guides, verified portal directories, and scam prevention articles for Nigerian job seekers. Learn how to spot fake NNPC, Customs, and EFCC portals."
        canonicalUrl="/blog"
        jsonLd={[breadcrumbSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto max-w-[960px] w-full px-4 sm:px-6 py-12 space-y-10 outline-none">
        
        {/* Header */}
        <div className="border-b border-border pb-8 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0a5c38]/10 dark:bg-[#3fb68e]/15 border border-[#0a5c38]/30 dark:border-[#3fb68e]/30 px-3 py-1 text-xs font-semibold text-[#0a5c38] dark:text-[#3fb68e] font-mono">
            EDUCATIONAL GUIDES & anti-scam INTELLIGENCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
            Recruitment Scam Awareness Blog
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Practical articles written by a Nigerian developer to educate job seekers, clarify federal civil service rules, and expose fake recruitment portals.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-[8px] border border-border bg-card p-6 interactive-card hover:border-[#0a5c38]/50 dark:hover:border-[#3fb68e]/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] px-2 py-0.5 rounded font-semibold">
                    {post.category}
                  </span>
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

        {/* Verification banner */}
        <div className="rounded-[8px] border border-border bg-muted/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-primary font-sans">Have a suspicious job link to check?</h3>
            <p className="text-xs text-muted-foreground font-sans">
              Verify official portal addresses instantly on our Monitored Portals Directory or check live audit timestamps.
            </p>
          </div>
          <Link
            to="/portals"
            className="px-5 py-2.5 bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] text-xs font-semibold rounded-[6px] transition-transform shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Check 42 Portals &rarr;
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
