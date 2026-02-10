import { Link } from "react-router-dom";
import { BookOpen, Shield, Wrench, AlertTriangle, ArrowRight } from "lucide-react";

const overviewCards = [
  {
    title: "AI Tools",
    description: "Explore popular AI tools, what they do, and how to use them in your studies.",
    icon: Wrench,
    path: "/tools",
    color: "bg-sky-light text-accent",
  },
  {
    title: "Guidelines",
    description: "Learn the rules for responsible AI use and check your work with our interactive checklist.",
    icon: BookOpen,
    path: "/guidelines",
    color: "bg-muted text-primary",
  },
  {
    title: "Privacy & Risks",
    description: "Understand AI risks including data privacy, bias, hallucinations, and academic integrity.",
    icon: Shield,
    path: "/privacy",
    color: "bg-secondary text-navy-light",
  },
];

const stats = [
  { value: "86%", label: "of students have used AI tools in coursework" },
  { value: "67%", label: "feel unsure about what's allowed" },
  { value: "1 in 3", label: "universities lack clear AI use policies" },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(199_89%_48%/0.15),transparent_60%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="section-fade-in">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest opacity-70">
              Your Guide to Responsible AI Use
            </p>
            <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Navigate AI in Your Studies with Confidence
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-85 md:text-xl">
              AIGuidebook gives university students simple, trustworthy guidance on using AI tools safely,
              responsibly, and with academic integrity.
            </p>
            <Link
              to="/guidelines"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="section-fade-in mb-10 text-center text-3xl font-bold text-foreground">
          What You'll Find Here
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {overviewCards.map((card, i) => (
            <Link
              key={card.path}
              to={card.path}
              className={`section-fade-in-delay-${i + 1} group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
            >
              <div className={`mb-4 inline-flex rounded-lg p-3 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-primary">
                Learn more <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="border-y border-border bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="section-fade-in mb-10 text-center">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-warning" />
            <h2 className="text-3xl font-bold text-foreground">Why This Matters</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              AI is transforming education fast. Students, teachers, and institutions all need clear guidance.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`section-fade-in-delay-${i + 1} rounded-xl bg-card p-6 text-center shadow-sm`}
              >
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
