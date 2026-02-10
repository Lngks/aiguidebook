import { useState } from "react";
import { CheckCircle2, XCircle, BookOpen, Quote } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  "I understand the assignment requirements regarding AI use.",
  "I have checked my institution's AI policy for this type of work.",
  "I used AI as a support tool, not to generate my final submission.",
  "I have verified all AI-generated facts against reliable sources.",
  "I can explain and defend every part of my submission in my own words.",
  "I have disclosed my use of AI tools as required.",
  "I have properly cited any AI-assisted content following my institution's citation guidelines.",
  "I have reviewed the output for bias, errors, and hallucinations.",
];

const dos = [
  "Use AI to brainstorm and explore ideas",
  "Verify every AI output with trusted sources",
  "Disclose AI tool usage in your submissions",
  "Use AI to help understand complex concepts",
  "Treat AI as a tutor, not a ghostwriter",
];

const donts = [
  "Submit AI-generated text as your own work",
  "Rely on AI outputs without fact-checking",
  "Share personal data or sensitive info with AI tools",
  "Use AI when your assignment explicitly prohibits it",
  "Assume AI-generated citations are real (they often aren't)",
];

const Guidelines = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
  const completedCount = checked.filter(Boolean).length;
  const progress = (completedCount / checklistItems.length) * 100;
  const allComplete = completedCount === checklistItems.length;

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-fade-in text-4xl font-bold">AI Use Guidelines</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-2xl text-lg opacity-85">
            Clear rules, practical tips, and an interactive checklist to help you use AI responsibly in your academic work.
          </p>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="section-fade-in mb-8 text-center text-3xl font-bold">Do's & Don'ts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="section-fade-in-delay-1 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-success">
              <CheckCircle2 className="h-5 w-5" /> Do
            </h3>
            <ul className="space-y-3">
              {dos.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-card-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="section-fade-in-delay-2 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-destructive">
              <XCircle className="h-5 w-5" /> Don't
            </h3>
            <ul className="space-y-3">
              {donts.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-card-foreground">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Checklist */}
      <section className="border-y border-border bg-muted/50 py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="section-fade-in mb-8 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Before You Submit</h2>
            <p className="mt-2 text-muted-foreground">
              Use this checklist to verify your AI-assisted work meets academic integrity standards.
            </p>
          </div>

          <div className="section-fade-in-delay-1 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-card-foreground">
                  {completedCount} of {checklistItems.length} completed
                </span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2.5" />
            </div>

            <ul className="space-y-4">
              {checklistItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Checkbox
                    id={`check-${i}`}
                    checked={checked[i]}
                    onCheckedChange={() => toggle(i)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`check-${i}`}
                    className={`cursor-pointer text-sm transition-colors ${
                      checked[i] ? "text-muted-foreground line-through" : "text-card-foreground"
                    }`}
                  >
                    {item}
                  </label>
                </li>
              ))}
            </ul>

            {allComplete && (
              <div className="mt-6 rounded-lg bg-sky-light p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
                <p className="font-semibold text-primary">All checks passed!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your work appears to meet academic integrity standards for AI use. Well done!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Citation Guidance */}
      <section className="container mx-auto max-w-2xl px-4 py-16">
        <div className="section-fade-in text-center">
          <Quote className="mx-auto mb-3 h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold">Citing AI-Generated Content</h2>
          <p className="mt-2 text-muted-foreground">
            When you use AI tools, always disclose it. Here's how to cite properly:
          </p>
        </div>
        <div className="section-fade-in-delay-1 mt-8 space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="mb-1 font-bold text-card-foreground">APA Style (7th Edition)</h4>
            <p className="font-mono text-sm text-muted-foreground">
              OpenAI. (2024). ChatGPT (Mar 14 version) [Large language model]. https://chat.openai.com
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="mb-1 font-bold text-card-foreground">In-text Disclosure</h4>
            <p className="text-sm text-muted-foreground">
              "This outline was generated with the assistance of ChatGPT and subsequently revised and verified by the author."
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Guidelines;
