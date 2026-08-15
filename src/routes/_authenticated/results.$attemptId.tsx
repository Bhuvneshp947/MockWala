import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle, Clock, Loader2, Target, XCircle } from "lucide-react";
import { getReport } from "@/lib/exam.functions";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/results/$attemptId")({
  head: () => ({
    meta: [
      { title: "Test report — PrepSmart" },
      {
        name: "description",
        content: "Your mock test report: score, accuracy, topic strengths and full solutions.",
      },
      { property: "og:title", content: "Test report — PrepSmart" },
      { property: "og:description", content: "Score, accuracy and solutions for your mock test." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function mmss(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function ResultPage() {
  const { attemptId } = Route.useParams();
  const fetchReport = useServerFn(getReport);
  const { data, isPending, isError } = useQuery({
    queryKey: ["report", attemptId],
    queryFn: () => fetchReport({ data: { attemptId } }),
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        {isPending ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Generating your report…
          </div>
        ) : isError || !data ? (
          <p className="text-destructive">We could not load this report.</p>
        ) : (
          <>
            <div className="animate-rise">
              <Badge variant="secondary">{data.attempt.examName}</Badge>
              <h1 className="mt-3 text-3xl font-bold">{data.attempt.subjectName} — Test report</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {data.attempt.submittedAt
                  ? new Date(data.attempt.submittedAt).toLocaleString("en-IN")
                  : ""}
              </p>
            </div>

            <div className="animate-pop mt-8 rounded-2xl bg-hero-gradient p-8 text-primary-foreground shadow-elevated">
              <p className="text-sm text-primary-foreground/75">Final score</p>
              <p className="mt-1 text-5xl font-bold">
                {data.attempt.score}
                <span className="text-2xl font-normal text-primary-foreground/70">
                  {" "}
                  / {data.attempt.maxScore}
                </span>
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <Mini icon={CheckCircle2} label="Correct" value={data.attempt.correct} />
                <Mini icon={XCircle} label="Wrong" value={data.attempt.wrong} />
                <Mini icon={Circle} label="Skipped" value={data.attempt.unattempted} />
                <Mini
                  icon={Clock}
                  label="Time used"
                  value={mmss(data.attempt.timeTakenSeconds)}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-primary" /> Accuracy
                </h2>
                <p className="mt-3 text-3xl font-bold">
                  {data.attempt.total
                    ? Math.round((data.attempt.correct / data.attempt.total) * 100)
                    : 0}
                  %
                </p>
                <Progress
                  className="mt-3"
                  value={
                    data.attempt.total ? (data.attempt.correct / data.attempt.total) * 100 : 0
                  }
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  {data.attempt.correct} of {data.attempt.total} questions correct.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-sm font-semibold">Topic-wise strength</h2>
                <div className="mt-4 space-y-3">
                  {data.topics.map((t) => (
                    <div key={t.topic}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t.topic}</span>
                        <span className="text-muted-foreground">
                          {t.correct}/{t.total}
                        </span>
                      </div>
                      <Progress className="mt-1.5" value={t.accuracy} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="mt-12 text-xl font-bold">Solutions</h2>
            <div className="mt-4 space-y-4">
              {data.questions
                .filter((q) => q.status === "correct")
                .map((q) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-border bg-card p-6 shadow-card"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Q{q.number}</Badge>
                      <Badge
                        variant="outline"
                        className={
                          q.status === "correct"
                            ? "border-success/40 text-success"
                            : q.status === "wrong"
                              ? "border-destructive/40 text-destructive"
                              : ""
                        }
                      >
                        {q.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{q.topic}</span>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{q.body}</p>
                    <div className="mt-4 space-y-2">
                      {q.options.map((option, i) => {
                        const isCorrect = i === q.correctIndex;
                        const isGiven = i === q.givenIndex;
                        return (
                          <div
                            key={i}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              isCorrect
                                ? "border-success/40 bg-success/10"
                                : isGiven
                                  ? "border-destructive/40 bg-destructive/10"
                                  : "border-border"
                            }`}
                          >
                            <span className="mr-2 font-semibold">
                              {String.fromCharCode(65 + i)}.
                            </span>
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation ? (
                      <p className="mt-4 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Solution: </span>
                        {q.explanation}
                      </p>
                    ) : null}
                  </div>
                ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/">Take another test</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 p-4">
      <Icon className="size-4 text-primary-foreground/70" />
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );
}
