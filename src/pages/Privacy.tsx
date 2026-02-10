import { Shield, Eye, AlertTriangle, Brain, Lock, Fingerprint } from "lucide-react";

const risks = [
  {
    title: "Data Privacy",
    icon: Eye,
    description: "When you use AI tools, your inputs may be stored, used for training, or shared with third parties.",
    examples: [
      "Pasting personal essays into ChatGPT could mean your text is used to train future models.",
      "Uploading assignment files may expose your work to the AI provider.",
    ],
    tips: [
      "Avoid sharing personal or sensitive information in AI prompts.",
      "Check the tool's privacy policy before use.",
      "Use anonymised data when possible.",
    ],
  },
  {
    title: "Bias in AI",
    icon: Brain,
    description: "AI models can reflect and amplify biases present in their training data, leading to unfair or skewed outputs.",
    examples: [
      "AI research assistants may favour Western-centric sources.",
      "Language models can produce stereotyped responses about cultures, genders, or groups.",
    ],
    tips: [
      "Cross-reference AI outputs with diverse, reputable sources.",
      "Be critical of AI-generated summaries and perspectives.",
      "Report biased outputs when you encounter them.",
    ],
  },
  {
    title: "Hallucinations",
    icon: AlertTriangle,
    description: "AI can generate confident-sounding but completely false information, including fake citations and fabricated facts.",
    examples: [
      "ChatGPT has been known to invent academic papers that don't exist.",
      "AI may produce plausible-looking statistics with no real source.",
    ],
    tips: [
      "Always verify AI-generated facts and citations in original sources.",
      "Never trust an AI-provided reference without checking it exists.",
      "Use AI for ideas, not as a primary source of truth.",
    ],
  },
  {
    title: "Academic Integrity",
    icon: Shield,
    description: "Submitting AI-generated work as your own can constitute academic misconduct and carry serious consequences.",
    examples: [
      "Copying and pasting AI outputs into an essay without disclosure is plagiarism.",
      "Using AI to write code for a programming exam is typically not allowed.",
    ],
    tips: [
      "Always check your course's specific AI use policy.",
      "Disclose AI use transparently.",
      "Use our Guidelines checklist before submitting.",
    ],
  },
];

const protectionTips = [
  { icon: Lock, title: "Use Strong Privacy Settings", text: "Opt out of data sharing and training where available." },
  { icon: Fingerprint, title: "Avoid PII in Prompts", text: "Never enter passwords, student IDs, or personal details." },
  { icon: Shield, title: "Use Institutional Tools", text: "Prefer AI tools provided by your university — they often have better data agreements." },
];

const Privacy = () => {
  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-fade-in text-4xl font-bold">Privacy & Risks</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-2xl text-lg opacity-85">
            Understand the risks of AI tools — from data privacy to hallucinations — and learn how to protect yourself.
          </p>
        </div>
      </section>

      {/* Risk Sections */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          {risks.map((risk, i) => (
            <article
              key={risk.title}
              className={`section-fade-in-delay-${(i % 3) + 1} rounded-xl border border-border bg-card p-6 shadow-sm md:p-8`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-destructive/10 p-2.5 text-destructive">
                  <risk.icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">{risk.title}</h2>
              </div>
              <p className="mb-5 text-muted-foreground">{risk.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-destructive/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-destructive">
                    Real-World Examples
                  </h4>
                  <ul className="space-y-2">
                    {risk.examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-card-foreground">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-sky-light p-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                    How to Protect Yourself
                  </h4>
                  <ul className="space-y-2">
                    {risk.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-card-foreground">
                        <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Tips */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-fade-in mb-8 text-center text-3xl font-bold">Protecting Your Data</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {protectionTips.map((tip, i) => (
              <div
                key={tip.title}
                className={`section-fade-in-delay-${i + 1} rounded-xl border border-border bg-card p-6 text-center shadow-sm`}
              >
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-sky-light p-3 text-accent">
                  <tip.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-card-foreground">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
