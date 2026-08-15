import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Check, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startAttempt, submitAttempt } from "@/lib/exam.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Attempt = Awaited<ReturnType<typeof startAttempt>>;

export const Route = createFileRoute("/_authenticated/test/$subjectId")({
  head: () => ({
    meta: [
      { title: "Mock test in progress — PrepSmart" },
      {
        name: "description",
        content: "A live timed mock test drawn from your selected exam and subject question bank.",
      },
      { property: "og:title", content: "Mock test in progress — PrepSmart" },
      { property: "og:description", content: "Timed mock test with auto-submit." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestPage,
});

function format(seconds: number) {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

function TestPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const start = useServerFn(startAttempt);
  const submit = useServerFn(submitAttempt);

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start({ data: { subjectId } })
      .then((data) => {
        setAttempt(data);
        setRemaining(data.durationSeconds);
      })
      .catch((e: Error) => setError(e.message));
  }, [start, subjectId]);

  const finish = useMemo(
    () =>
      async (auto: boolean) => {
        if (!attempt || submittedRef.current) return;
        submittedRef.current = true;
        setSubmitting(true);
        try {
          await submit({
            data: {
              attemptId: attempt.attemptId,
              answers,
              timeTakenSeconds: attempt.durationSeconds - remaining,
            },
          });
          if (auto) toast.info("Time is up — your test was submitted automatically.");
          navigate({ to: "/results/$attemptId", params: { attemptId: attempt.attemptId } });
        } catch (e) {
          submittedRef.current = false;
          setSubmitting(false);
          toast.error((e as Error).message);
        }
      },
    [attempt, answers, remaining, submit, navigate],
  );

  useEffect(() => {
    if (!attempt) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          void finish(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [attempt, finish]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto size-8 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Could not start the test</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
            Back to exams
          </Button>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Preparing your question paper…
      </div>
    );
  }

  const q = attempt.questions[current]!;
  const answered = Object.keys(answers).length;
  const lowTime = remaining <= 60;

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">
              {attempt.exam.shortName} · {attempt.subject.name}
            </p>
            <p className="text-xs text-muted-foreground">
              +{attempt.marking.correct} correct / {attempt.marking.wrong} wrong · {answered} of{" "}
              {attempt.questions.length} answered
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-sm font-semibold tabular-nums ${
                lowTime
                  ? "animate-pulse bg-destructive/12 text-destructive"
                  : "bg-primary-soft text-primary"
              }`}
            >
              <Clock className="size-4" /> {format(remaining)}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" disabled={submitting}>
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null} Submit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit this test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have answered {answered} of {attempt.questions.length} questions. Your
                    report will be generated from these answers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep solving</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void finish(false)}>
                    Submit test
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_260px]">
        <section
          key={q.id}
          className="animate-pop rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Question {q.number}</Badge>
            <Badge variant="outline">{q.topic}</Badge>
            <Badge variant="outline">{q.difficulty}</Badge>
          </div>
          <p className="mt-5 whitespace-pre-line text-base leading-relaxed">{q.body}</p>

          <div className="mt-6 space-y-3">
            {q.options.map((option, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const next = { ...prev };
                      if (next[q.id] === i) delete next[q.id];
                      else next[q.id] = i;
                      return next;
                    })
                  }
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? "border-primary bg-primary-soft shadow-card"
                      : "border-border bg-background hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {selected ? <Check className="size-3.5" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={current === attempt.questions.length - 1}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next question
            </Button>
          </div>
        </section>

        <aside className="h-max rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold">Question palette</h2>
          <div className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-5">
            {attempt.questions.map((item, i) => {
              const isCurrent = i === current;
              const isAnswered = answers[item.id] !== undefined;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`size-9 rounded-lg text-sm font-semibold transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isAnswered
                        ? "bg-success/15 text-success"
                        : "bg-secondary text-muted-foreground hover:bg-border"
                  }`}
                >
                  {item.number}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Tap a selected option again to clear it and leave the question unattempted.
          </p>
        </aside>
      </main>
    </div>
  );
}
