import { Bot, Code, Sparkles, Brain, MessageSquare, Image } from "lucide-react";

const tools = [
  {
    name: "ChatGPT",
    provider: "OpenAI",
    icon: MessageSquare,
    description: "General-purpose AI chatbot for writing, research, brainstorming, and explanations.",
    uses: ["Summarising readings", "Explaining concepts", "Drafting outlines", "Practice Q&A"],
    considerations: "May produce hallucinated facts. Always verify claims with primary sources.",
  },
  {
    name: "GitHub Copilot",
    provider: "GitHub / Microsoft",
    icon: Code,
    description: "AI-powered code completion and generation tool built into code editors.",
    uses: ["Auto-completing code", "Generating boilerplate", "Debugging help", "Learning syntax"],
    considerations: "Using Copilot in graded coding assignments may violate academic integrity policies.",
  },
  {
    name: "Google Gemini",
    provider: "Google",
    icon: Sparkles,
    description: "Multimodal AI assistant that can process text, images, and more.",
    uses: ["Research assistance", "Summarising documents", "Multimodal analysis", "Study planning"],
    considerations: "Integrates with Google services — be aware of data sharing across platforms.",
  },
  {
    name: "Claude",
    provider: "Anthropic",
    icon: Brain,
    description: "AI assistant focused on being helpful, harmless, and honest, with long context windows.",
    uses: ["Analysing long documents", "Nuanced discussions", "Writing feedback", "Research summaries"],
    considerations: "Designed with safety in mind, but still requires critical evaluation of outputs.",
  },
  {
    name: "DALL·E / Midjourney",
    provider: "OpenAI / Midjourney",
    icon: Image,
    description: "AI image generators that create visuals from text descriptions.",
    uses: ["Creating illustrations", "Design mockups", "Visual brainstorming", "Presentation graphics"],
    considerations: "Using AI-generated images without disclosure may be considered dishonest in some contexts.",
  },
  {
    name: "Grammarly AI",
    provider: "Grammarly",
    icon: Bot,
    description: "AI-enhanced writing assistant for grammar, tone, and clarity improvements.",
    uses: ["Proofreading essays", "Tone adjustments", "Clarity suggestions", "Citation formatting"],
    considerations: "Generally accepted for proofreading, but AI-rewritten passages may cross integrity lines.",
  },
];

const Tools = () => {
  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-fade-in text-4xl font-bold">AI Tools Overview</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-2xl text-lg opacity-85">
            A curated guide to the AI tools students commonly encounter — what they do, how to use them, and what to watch out for.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <article
              key={tool.name}
              className={`section-fade-in-delay-${(i % 3) + 1} rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-sky-light p-2.5 text-accent">
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground">{tool.provider}</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>
              <div className="mb-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Common Academic Uses
                </h4>
                <ul className="space-y-1">
                  {tool.uses.map((use) => (
                    <li key={use} className="flex items-start gap-2 text-sm text-card-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  ⚠️ {tool.considerations}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Tools;
