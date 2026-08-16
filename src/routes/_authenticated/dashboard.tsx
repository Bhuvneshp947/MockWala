import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, CheckCircle2, Clock, FileText, Loader2, Target } from "lucide-react";
import { getDashboard } from "@/lib/exam.functions";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My dashboard — PrepSmart" },
      {
        name: "description",
        content: "Track your mock test scores, accuracy and time spent across every attempt.",
      },
      { property: "og:title", content: "My dashboard — PrepSmart" },
      { property: "og:description", content: "Your mock test history and performance stats." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        {isPending ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your dashboard…
          </div>
        ) : isError || !data ? (
          <p className="text-destructive">We could not load your dashboard. Please refresh.</p>
        ) : (
          <>
            <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Hello, {data.profile?.full_name?.split(" ")[0] ?? "student"}
                </h1>
                <p className="mt-1.5 text-muted-foreground">
                  {data.profile?.target_exam
                    ? `Preparing for ${data.profile.target_exam}`
                    : "Pick an exam and start a mock test."}
                </p>
              </div>
              <Button asChild>
                <Link to="/">Take a new test</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={FileText} label="Tests taken" value={String(data.stats.tests)} />
              <Stat icon={Target} label="Questions solved" value={String(data.stats.questions)} />
              <Stat icon={CheckCircle2} label="Overall accuracy" value={`${data.stats.accuracy}%`} />
              <Stat icon={Clock} label="Time practised" value={`${data.stats.minutes} min`} />
            </div>

            <h2 className="mt-12 text-xl font-bold">Test history</h2>
            {data.attempts.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
                <BarChart3 className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No tests yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your first report will appear here right after you submit a mock test.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/">Browse exams</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {data.attempts.map((a) => (
                  <Link
                    key={a.id}
                    to="/results/$attemptId"
                    params={{ attemptId: a.id }}
                    className="card-hover flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{a.examName}</Badge>
                        <span className="font-semibold">{a.subjectName}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {a.submittedAt ? new Date(a.submittedAt).toLocaleString("en-IN") : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {a.score}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{a.maxScore}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">score</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{a.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">accuracy</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="animate-pop rounded-2xl border border-border bg-card p-5 shadow-card">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
