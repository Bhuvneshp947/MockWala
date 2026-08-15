import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, FileQuestion, Info } from "lucide-react";
import { getExam } from "@/lib/exam.functions";
import { SiteHeader } from "@/components/site-header";
import { useSession } from "@/components/session-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const examQuery = (slug: string) =>
  queryOptions({
    queryKey: ["exam", slug],
    queryFn: () => getExam({ data: { slug } }),
  });

export const Route = createFileRoute("/exam/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(examQuery(params.slug));
    if (!data.exam) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.exam) {
      return {
        meta: [{ title: "Exam not found — PrepSmart" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.exam.name} Mock Tests — PrepSmart`;
    const description = `Subject-wise timed mock tests for ${loaderData.exam.name}. Exam date: ${loaderData.exam.exam_date}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  errorComponent: () => <Fallback title="This exam page could not load" />,
  notFoundComponent: () => <Fallback title="We could not find that exam" />,
  component: ExamPage,
});

function Fallback({ title }: { title: string }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button asChild className="mt-6">
          <Link to="/">Back to all exams</Link>
        </Button>
      </div>
    </div>
  );
}

function ExamPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(examQuery(slug));
  const { session } = useSession();
  const exam = data.exam!;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" /> All exams
          </Link>
          <Badge className="animate-fade-in mt-6 border-0 bg-primary-foreground/15 text-primary-foreground">
            {exam.category}
          </Badge>
          <h1 className="animate-rise mt-4 text-3xl font-bold sm:text-4xl">{exam.name}</h1>
          <p className="animate-rise mt-3 max-w-2xl text-primary-foreground/80">
            {exam.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/12 px-3 py-2">
              <CalendarDays className="size-4" /> {exam.exam_date}
            </span>
            {exam.registration_note ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/12 px-3 py-2">
                <Info className="size-4" /> {exam.registration_note}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold">Choose a subject</h2>
        <p className="mt-2 text-muted-foreground">
          Each mock test is drawn only from the {exam.short_name} question bank for that subject.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.subjects.map((subject, i) => (
            <div
              key={subject.id}
              className="card-hover animate-rise rounded-2xl border border-border bg-card p-6 shadow-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{subject.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
                  <Clock className="size-3.5" /> {subject.duration_minutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
                  <FileQuestion className="size-3.5" /> {subject.questions_per_test} questions
                </span>
              </div>
              <Button asChild className="mt-5 w-full">
                {session ? (
                  <Link to="/test/$subjectId" params={{ subjectId: subject.id }}>
                    Start mock test
                  </Link>
                ) : (
                  <Link to="/auth">Sign in to start</Link>
                )}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
