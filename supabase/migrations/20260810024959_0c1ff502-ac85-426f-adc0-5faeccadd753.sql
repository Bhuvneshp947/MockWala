
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  class_level text,
  city text,
  school text,
  target_exam text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, class_level, city, school, target_exam)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'class_level',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'target_exam'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text NOT NULL,
  category text NOT NULL,
  exam_date text NOT NULL,
  registration_note text,
  description text NOT NULL,
  accent text NOT NULL DEFAULT 'primary',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exams TO anon;
GRANT SELECT ON public.exams TO authenticated;
GRANT ALL ON public.exams TO service_role;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exams are public" ON public.exams FOR SELECT USING (true);

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration_minutes int NOT NULL DEFAULT 20,
  questions_per_test int NOT NULL DEFAULT 8,
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (exam_id, slug)
);
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects are public" ON public.subjects FOR SELECT USING (true);

CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic text NOT NULL DEFAULT 'General',
  difficulty text NOT NULL DEFAULT 'medium',
  body text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  explanation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX questions_subject_idx ON public.questions (subject_id);
GRANT SELECT ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions for signed in students" ON public.questions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  question_ids uuid[] NOT NULL DEFAULT '{}',
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  duration_seconds int NOT NULL DEFAULT 0,
  time_taken_seconds int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 0,
  correct_count int NOT NULL DEFAULT 0,
  wrong_count int NOT NULL DEFAULT 0,
  unattempted_count int NOT NULL DEFAULT 0,
  score numeric NOT NULL DEFAULT 0,
  max_score numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);
CREATE INDEX attempts_user_idx ON public.attempts (user_id, started_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;
GRANT ALL ON public.attempts TO service_role;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts read" ON public.attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own attempts insert" ON public.attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own attempts update" ON public.attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own attempts delete" ON public.attempts FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.exams (slug, name, short_name, category, exam_date, registration_note, description, accent, sort_order) VALUES
('jee-main-2027', 'JEE Main 2027 (Session 1)', 'JEE Main', 'Engineering', 'January 2027', 'Conducted by NTA. Registrations usually open in late autumn 2026.', 'National level engineering entrance for NITs, IIITs, GFTIs and the JEE Advanced gateway.', 'blue', 1),
('jee-advanced-2027', 'JEE Advanced 2027', 'JEE Advanced', 'Engineering', 'May / June 2027', 'Only for candidates who qualify JEE Main 2027.', 'The IIT admission test — deeper concepts, multi-step problems and higher difficulty.', 'violet', 2),
('neet-ug-2027', 'NEET UG 2027', 'NEET UG', 'Medical', 'First week of May 2027', 'Single largest medical entrance for MBBS / BDS seats in India.', 'Pen-and-paper medical entrance covering Physics, Chemistry, Botany and Zoology.', 'green', 3),
('jnvst-class-6-2027', 'JNVST Class 6 (2027 Admission)', 'JNVST 6', 'School Entrance', 'November 28, 2026', 'Application correction window: August 11–12, 2026. Admit cards release November 2026.', 'Jawahar Navodaya Vidyalaya selection test for Class 6 — Mental Ability, Arithmetic and Language.', 'amber', 4),
('jnvst-class-9-2027', 'JNVST Class 9 Lateral Entry (2027)', 'JNVST 9', 'School Entrance', 'February 2027', 'Lateral entry test conducted by Navodaya Vidyalaya Samiti.', 'Lateral entry selection test for Class 9 covering Maths, Science, English and Hindi.', 'rose', 5);

INSERT INTO public.subjects (exam_id, slug, name, description, duration_minutes, questions_per_test, sort_order)
SELECT e.id, s.slug, s.name, s.description, s.duration, s.qcount, s.ord
FROM public.exams e
JOIN (VALUES
  ('jee-main-2027','physics','Physics','Mechanics, electrodynamics, modern physics',15,8,1),
  ('jee-main-2027','chemistry','Chemistry','Physical, organic and inorganic chemistry',15,8,2),
  ('jee-main-2027','mathematics','Mathematics','Algebra, calculus, coordinate geometry',15,8,3),
  ('jee-advanced-2027','physics','Physics','Advanced multi-concept physics problems',18,8,1),
  ('jee-advanced-2027','chemistry','Chemistry','Advanced physical and organic chemistry',18,8,2),
  ('jee-advanced-2027','mathematics','Mathematics','Advanced calculus, algebra and vectors',18,8,3),
  ('neet-ug-2027','physics','Physics','NCERT based physics for medical aspirants',15,8,1),
  ('neet-ug-2027','chemistry','Chemistry','NCERT based chemistry for medical aspirants',15,8,2),
  ('neet-ug-2027','botany','Botany','Plant physiology, genetics and ecology',15,8,3),
  ('neet-ug-2027','zoology','Zoology','Human physiology, evolution and animal kingdom',15,8,4),
  ('jnvst-class-6-2027','mental-ability','Mental Ability','Odd-one-out, patterns, figure matching, analogy',20,8,1),
  ('jnvst-class-6-2027','arithmetic','Arithmetic','Number work, fractions, percentage, time and work',20,8,2),
  ('jnvst-class-6-2027','language','Language','Reading comprehension and grammar',15,8,3),
  ('jnvst-class-9-2027','mathematics','Mathematics','Class 8 level algebra, geometry and mensuration',20,8,1),
  ('jnvst-class-9-2027','science','Science','Class 8 level physics, chemistry and biology',20,8,2),
  ('jnvst-class-9-2027','english','English','Grammar, vocabulary and comprehension',15,8,3),
  ('jnvst-class-9-2027','hindi','Hindi','व्याकरण एवं भाषा ज्ञान',15,8,4)
) AS s(exam_slug, slug, name, description, duration, qcount, ord)
ON e.slug = s.exam_slug;
