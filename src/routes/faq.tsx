import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer } from "../components/layout";
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

interface FaqItem {
  q: string;
  a: string;
}

const faqList: FaqItem[] = [
  {
    q: "What is GovAlert?",
    a: "GovAlert is an independent verification platform that monitors Nigerian federal recruitment portals. Our crawlers check endpoints every 15 minutes, and our analysts cross-verify listings to protect job seekers from widespread recruitment scams.",
  },
  {
    q: "How do you verify if a recruitment portal is authentic?",
    a: "We use a multi-phase audit process: (1) Domain analysis, checking that the portal operates on a registered, secure .gov.ng or verified corporate domain extension; (2) SSL examination, confirming the presence of genuine corporate EV certificates; (3) Cross-referencing announcement details against the national gazette, federal budget allocations, or verified MDA media releases.",
  },
  {
    q: "Is GovAlert affiliated with the Federal Government of Nigeria?",
    a: "No. GovAlert is completely independent. We are not government employees, and we do not influence, represent, or sell employment slots. We function solely as a public utility to assure safety and security in recruitment.",
  },
  {
    q: "Do I have to pay to apply for recruitments posted here?",
    a: "Absolutely not. Official government recruitments are free of charge. If any agency portal, recruiter, or third party demands payment for registration, exams, medical checks, or training kits, it is a scam.",
  },
  {
    q: "What does the Portal Trust Score represent?",
    a: "The trust score indicates portal security compliance. A 100% score means the portal operates on a verified official government domain with secure HTTPS connections, has no security anomalies, and matches checked records. Scores drop if warning flags like non-standard domains, external redirections, or scam logs are found.",
  },
  {
    q: "How do I receive instant alerts via Telegram?",
    a: "Go to your Applicant Dashboard, click the Notifications tab, and click 'Connect Alert Bot'. Follow the instructions to search for @GovAlertBot on Telegram and pair your account using the generated code. You'll receive real-time push alerts on your phone whenever new recruitments are verified.",
  },
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto grid size-10 place-items-center rounded bg-muted border border-border text-primary">
            <HelpCircle className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Get answers on how we track MDA portals, calculate trust scores, and prevent scams.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded border border-border bg-card overflow-hidden shadow-sm transition-colors duration-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-xs hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3.5 bg-muted/10">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
