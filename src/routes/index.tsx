import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesCombined,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Award,
  Zap,
  Users,
  Flame,
} from "lucide-react";
import { listExams, type ExamRow, type SubjectRow } from "@/lib/exam.functions";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const examsQuery = queryOptions({
  queryKey: ["exams"],
  queryFn: () => listExams(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(examsQuery),
  head: () => ({
    meta: [
      { title: "MockWala — Mock Tests for Competitive Exams" },
      {
        name: "description",
        content:
          "Free timed mock tests for UPSC, IBPS, SSC, RRB, JEE, NEET and School entrance exams. Pick your exam, pick a subject, get a real performance report.",
      },
      { property: "og:title", content: "MockWala — Mock Tests for Competitive Exams" },
      {
        property: "og:description",
        content:
          "Exam-specific question banks, a real countdown timer and a detailed report after every mock test.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: BookOpenCheck,
    title: "Exam-specific question bank",
    text: "Questions are tagged to your exam and subject. A JEE Main Physics test never pulls a NEET question.",
  },
  {
    icon: Timer,
    title: "Real countdown timer",
    text: "Every mock test runs on a live timer and auto-submits the moment the clock hits zero.",
  },
  {
    icon: BarChart3,
    title: "Honest performance report",
    text: "Score, accuracy, time used and topic-wise strength — computed from your actual answers.",
  },
  {
    icon: ShieldCheck,
    title: "Fresh set every attempt",
    text: "We remember what you have already solved and serve unseen questions first.",
  },
  {
    icon: Award,
    title: "Achievement Badges",
    text: "Earn achievements for consistency, accuracy, and mastery across different subjects.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    text: "Maintain daily practice streaks and watch your preparation momentum build.",
  },
  {
    icon: Users,
    title: "Leaderboards",
    text: "Compete with fellow aspirants and see where you stand among the community.",
  },
  {
    icon: Zap,
    title: "Smart Analytics",
    text: "AI-powered insights to identify weak areas and personalized study recommendations.",
  },
];

const subjectHighlights = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "English",
  "Reasoning",
  "Banking",
  "UPSC",
  "SSC",
  "RRB",
  "JEE",
  "NEET",
];

function Home() {
  const { data } = useSuspenseQuery(examsQuery);
  const subjectsFor = (exam: ExamRow) =>
    data.subjects.filter((s: SubjectRow) => s.exam_id === exam.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/25 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-6 size-96 -translate-x-1/2 rounded-full border border-white/30 bg-white/8 blur-2xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <Badge className="animate-fade-in border-0 bg-primary-foreground/15 text-primary-foreground backdrop-blur">
                Upcoming Indian exams · 2026–27 cycle
              </Badge>
              <h1 className="animate-rise mt-6 max-w-3xl text-4xl font-bold leading-[1.08] sm:text-6xl">
                MockWala for your next government exam.
              </h1>
              <p
                className="animate-rise mt-5 max-w-xl text-base/relaxed text-primary-foreground/80 sm:text-lg"
                style={{ animationDelay: "80ms" }}
              >
                Choose UPSC, IBPS, SSC, RRB or school entrance exam categories. Select a subject,
                solve a timed mock test drawn from that exam&apos;s question pool, and review a full report.
              </p>
              <div
                className="animate-rise mt-9 flex flex-wrap gap-3"
                style={{ animationDelay: "160ms" }}
              >
                <Button asChild size="lg" variant="secondary">
                  <a href="#exams">
                    Browse exams
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/auth">Create student account</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/85">
                  <Sparkles className="size-4" /> Live analytics
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/85">
                  <Target className="size-4" /> Exam-specific learning
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/85">
                  <TrendingUp className="size-4" /> Report-first practice
                </span>
              </div>
            </div>

            <aside className="hidden lg:flex lg:justify-end">
              <div className="hero-image-wrap">
                <div className="hero-orb hero-orb-one" />
                <div className="hero-orb hero-orb-two" />
                <img
                  src="/image.png"
                  alt="PrepSmart learner community"
                  className="hero-image object-cover"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="scroll-marquee border-y border-border/80 bg-card/55">
        <div className="marquee-track">
          {subjectHighlights.concat(subjectHighlights).map((t, index) => (
            <span key={`${t}-${index}`} className="marquee-chip">
              <Sparkles className="size-3.5" /> {t}
            </span>
          ))}
        </div>
      </section>



      <section id="exams" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Upcoming exams</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Dates below are the currently announced or expected schedules. Select an exam to see its
              subjects and start a mock test.
            </p>
          </div>
          <span className="rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {data.exams.length} active tracks
          </span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.exams.map((exam: ExamRow, i: number) => (
            <Link
              key={exam.id}
              to="/exam/$slug"
              params={{ slug: exam.slug }}
              className="card-hover animate-rise group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">{exam.category}</Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  {subjectsFor(exam).length} subjects
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{exam.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{exam.description}</p>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-sm font-medium text-primary">
                <CalendarDays className="size-4" />
                {exam.exam_date}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-transform group-hover:translate-x-1">
                Start practising <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Why MockWala?</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Experience the most comprehensive and interactive mock test platform designed specifically for Indian competitive exams.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div 
              key={f.title} 
              className="animate-slide-in-up group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-lift transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent-gradient text-accent-foreground shadow-card group-hover:animate-glow">
                <f.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl mb-12">Community Achievements</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Students", value: "50K+", icon: "👥" },
              { label: "Mock Tests Completed", value: "500K+", icon: "✅" },
              { label: "Questions in Bank", value: "10K+", icon: "📚" },
              { label: "Exam Categories", value: "20+", icon: "🎯" },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="animate-bounce-gentle rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary-foreground">{stat.value}</div>
                <p className="mt-2 text-primary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl mb-8">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { 
              step: "01", 
              title: "Choose Your Exam", 
              desc: "Select from 20+ competitive exams including JEE, NEET, UPSC, SSC, Banking and more."
            },
            { 
              step: "02", 
              title: "Pick a Subject", 
              desc: "Each exam has multiple subjects with 20-30 fresh questions every single attempt."
            },
            { 
              step: "03", 
              title: "Get Smart Insights", 
              desc: "Complete detailed reports showing your score, accuracy, and personalized weak areas."
            },
          ].map((item, i) => (
            <div 
              key={item.step}
              className="animate-slide-in-down rounded-2xl border border-border bg-card p-8 hover:shadow-lift transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-center size-16 rounded-full bg-accent/20 text-accent font-bold text-2xl mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>