import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type ExamRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  category: string;
  exam_date: string;
  registration_note: string | null;
  description: string;
  accent: string;
  sort_order: number;
};

export type SubjectRow = {
  id: string;
  exam_id: string;
  slug: string;
  name: string;
  description: string;
  duration_minutes: number;
  questions_per_test: number;
  sort_order: number;
};

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const listExams = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const [{ data: exams }, { data: subjects }] = await Promise.all([
    db.from("exams").select("*").order("sort_order"),
    db.from("subjects").select("*").order("sort_order"),
  ]);
  return {
    exams: (exams ?? []) as ExamRow[],
    subjects: (subjects ?? []) as SubjectRow[],
  };
});

export const getExam = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: exam } = await db.from("exams").select("*").eq("slug", data.slug).maybeSingle();
    if (!exam) return { exam: null, subjects: [] as SubjectRow[] };
    const { data: subjects } = await db
      .from("subjects")
      .select("*")
      .eq("exam_id", exam.id)
      .order("sort_order");
    return { exam: exam as ExamRow, subjects: (subjects ?? []) as SubjectRow[] };
  });

function markingScheme(category: string) {
  return category === "School Entrance"
    ? { correct: 1, wrong: 0 }
    : { correct: 4, wrong: -1 };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Starts a fresh timed attempt. Questions are always drawn from the chosen
 *  exam + subject, and questions the student has already seen are skipped
 *  until the pool runs out. */
export const startAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ subjectId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("*, exams(*)")
      .eq("id", data.subjectId)
      .maybeSingle();
    if (subjectError || !subject) throw new Error("Subject not found");

    const exam = subject.exams as unknown as ExamRow;

    const { data: pool, error: poolError } = await supabase
      .from("questions")
      .select("id, body, options, topic, difficulty")
      .eq("subject_id", data.subjectId);
    if (poolError) throw new Error(poolError.message);
    if (!pool || pool.length === 0) throw new Error("No questions available for this subject yet");

    const { data: previous } = await supabase
      .from("attempts")
      .select("question_ids")
      .eq("user_id", userId)
      .eq("subject_id", data.subjectId);

    const seen = new Set<string>();
    for (const row of previous ?? []) for (const id of row.question_ids ?? []) seen.add(id);

    const configuredTarget = Number(subject.questions_per_test) || 20;
    const lowerBound = Math.max(20, Math.min(25, configuredTarget));
    const upperBound = Math.min(Math.max(lowerBound, 25), pool.length);
    const wantedTarget = randomRange(lowerBound, upperBound);
    const wanted = Math.min(wantedTarget, pool.length);
    const fresh = shuffle(pool.filter((q) => !seen.has(q.id)));
    const recycled = shuffle(pool.filter((q) => seen.has(q.id)));
    const picked = [...fresh, ...recycled].slice(0, wanted);

    const durationSeconds = subject.duration_minutes * 60;
    const { data: attempt, error: attemptError } = await supabase
      .from("attempts")
      .insert({
        user_id: userId,
        exam_id: subject.exam_id,
        subject_id: subject.id,
        question_ids: picked.map((q) => q.id),
        duration_seconds: durationSeconds,
        total_questions: picked.length,
        max_score: picked.length * markingScheme(exam.category).correct,
        status: "in_progress",
      })
      .select("id, started_at")
      .single();
    if (attemptError || !attempt) throw new Error(attemptError?.message ?? "Could not start test");

    return {
      attemptId: attempt.id,
      startedAt: attempt.started_at,
      durationSeconds,
      exam: { name: exam.name, shortName: exam.short_name, category: exam.category },
      subject: { name: subject.name, slug: subject.slug },
      marking: markingScheme(exam.category),
      questions: picked.map((q, index) => ({
        id: q.id,
        number: index + 1,
        body: q.body,
        topic: q.topic,
        difficulty: q.difficulty,
        options: q.options as string[],
      })),
    };
  });

export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        attemptId: z.string().uuid(),
        answers: z.record(z.string(), z.number().int().min(0).max(3)),
        timeTakenSeconds: z.number().int().min(0),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: attempt } = await supabase
      .from("attempts")
      .select("*, exams(category)")
      .eq("id", data.attemptId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.status === "submitted") return { attemptId: attempt.id };

    const { data: questions } = await supabase
      .from("questions")
      .select("id, correct_index")
      .in("id", attempt.question_ids);

    const key = new Map((questions ?? []).map((q) => [q.id, q.correct_index]));
    const scheme = markingScheme((attempt.exams as unknown as { category: string }).category);

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    for (const id of attempt.question_ids) {
      const given = data.answers[id];
      if (given === undefined) unattempted += 1;
      else if (given === key.get(id)) correct += 1;
      else wrong += 1;
    }

    const score = correct * scheme.correct + wrong * scheme.wrong;

    const { error } = await supabase
      .from("attempts")
      .update({
        answers: data.answers,
        correct_count: correct,
        wrong_count: wrong,
        unattempted_count: unattempted,
        score,
        time_taken_seconds: data.timeTakenSeconds,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attempt.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    return { attemptId: attempt.id };
  });

export const getReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ attemptId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: attempt } = await supabase
      .from("attempts")
      .select("*, exams(name, short_name, category), subjects(name)")
      .eq("id", data.attemptId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!attempt) throw new Error("Report not found");

    const { data: questions } = await supabase
      .from("questions")
      .select("id, body, options, correct_index, explanation, topic, difficulty")
      .in("id", attempt.question_ids);

    const byId = new Map((questions ?? []).map((q) => [q.id, q]));
    const answers = (attempt.answers ?? {}) as Record<string, number>;

    const rows = attempt.question_ids.map((id, index) => {
      const q = byId.get(id)!;
      const given = answers[id];
      return {
        number: index + 1,
        id,
        body: q.body,
        options: q.options as string[],
        correctIndex: q.correct_index,
        givenIndex: given ?? null,
        status: given === undefined ? "skipped" : given === q.correct_index ? "correct" : "wrong",
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty,
      };
    });

    const topics = new Map<string, { total: number; correct: number }>();
    for (const row of rows) {
      const entry = topics.get(row.topic) ?? { total: 0, correct: 0 };
      entry.total += 1;
      if (row.status === "correct") entry.correct += 1;
      topics.set(row.topic, entry);
    }

    return {
      attempt: {
        id: attempt.id,
        examName: (attempt.exams as unknown as { name: string }).name,
        examCategory: (attempt.exams as unknown as { category: string }).category,
        subjectName: (attempt.subjects as unknown as { name: string }).name,
        total: attempt.total_questions,
        correct: attempt.correct_count,
        wrong: attempt.wrong_count,
        unattempted: attempt.unattempted_count,
        score: Number(attempt.score),
        maxScore: Number(attempt.max_score),
        timeTakenSeconds: attempt.time_taken_seconds,
        durationSeconds: attempt.duration_seconds,
        submittedAt: attempt.submitted_at,
        status: attempt.status,
      },
      topics: [...topics.entries()].map(([topic, v]) => ({
        topic,
        total: v.total,
        correct: v.correct,
        accuracy: Math.round((v.correct / v.total) * 100),
      })),
      questions: rows,
    };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: attempts }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("attempts")
        .select("*, exams(short_name, name), subjects(name)")
        .eq("user_id", userId)
        .eq("status", "submitted")
        .order("submitted_at", { ascending: false })
        .limit(50),
    ]);

    const list = (attempts ?? []).map((a) => ({
      id: a.id,
      examName: (a.exams as unknown as { short_name: string }).short_name,
      subjectName: (a.subjects as unknown as { name: string }).name,
      score: Number(a.score),
      maxScore: Number(a.max_score),
      correct: a.correct_count,
      total: a.total_questions,
      accuracy: a.total_questions ? Math.round((a.correct_count / a.total_questions) * 100) : 0,
      timeTakenSeconds: a.time_taken_seconds,
      submittedAt: a.submitted_at,
    }));

    const totalQuestions = list.reduce((sum, a) => sum + a.total, 0);
    const totalCorrect = list.reduce((sum, a) => sum + a.correct, 0);

    return {
      profile: profile ?? null,
      attempts: list,
      stats: {
        tests: list.length,
        questions: totalQuestions,
        accuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        minutes: Math.round(list.reduce((s, a) => s + a.timeTakenSeconds, 0) / 60),
      },
    };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().trim().min(2).max(80),
        phone: z.string().trim().max(20).optional().or(z.literal("")),
        class_level: z.string().trim().max(30).optional().or(z.literal("")),
        city: z.string().trim().max(60).optional().or(z.literal("")),
        school: z.string().trim().max(120).optional().or(z.literal("")),
        target_exam: z.string().trim().max(60).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone ?? null,
        class_level: data.class_level ?? null,
        city: data.city ?? null,
        school: data.school ?? null,
        target_exam: data.target_exam ?? null,
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
