INSERT INTO public.exams (
  slug,
  name,
  short_name,
  category,
  exam_date,
  registration_note,
  description,
  accent,
  sort_order
) VALUES
  (
    'rpf-constable-2027',
    'RPF Constable 2027',
    'RPF Constable',
    'Railway',
    '2027 cycle',
    'Recruitment window and official notifications must be verified on RPF official channels.',
    'Railway Protection Force Constable recruitment focusing on General Awareness, Arithmetic, and General Intelligence & Reasoning.',
    'orange',
    21
  ),
  (
    'rpf-si-2027',
    'RPF Sub-Inspector 2027',
    'RPF SI',
    'Railway',
    '2027 cycle',
    'Check the official RPF/Indian Railways notice for application and exam dates.',
    'Sub-Inspector recruitment with advanced General Awareness, Arithmetic, and General Intelligence & Reasoning sections.',
    'amber',
    22
  );

INSERT INTO public.subjects (exam_id, slug, name, description, duration_minutes, questions_per_test, sort_order)
SELECT e.id, s.slug, s.name, s.description, s.duration, s.qcount, s.ord
FROM public.exams e
JOIN (VALUES
  ('rpf-constable-2027','general-awareness','General Awareness','Current affairs, polity, history, Indian constitution, science and culture',90,25,1),
  ('rpf-constable-2027','arithmetic','Arithmetic','Percentage, ratio, profit-loss, time, speed, mensuration and algebra',90,25,2),
  ('rpf-constable-2027','reasoning','General Intelligence & Reasoning','Analogy, series, coding, blood relation, statement and direction reasoning',90,25,3),

  ('rpf-si-2027','general-awareness-si','General Awareness','Advanced current affairs, polity, India’s history, constitution and science',90,25,1),
  ('rpf-si-2027','arithmetic-si','Arithmetic','Higher numerical ability, algebra, geometry, percentages and basic statistics',90,25,2),
  ('rpf-si-2027','reasoning-si','General Intelligence & Reasoning','Analytical reasoning, puzzles, coding-decoding and non-verbal reasoning',90,25,3)
) AS s(exam_slug, slug, name, description, duration, qcount, ord)
ON e.slug = s.exam_slug;

UPDATE public.subjects
SET questions_per_test = 25
WHERE exam_id IN (
  SELECT id FROM public.exams WHERE slug IN (
    'jee-main-2027',
    'jee-advanced-2027',
    'neet-ug-2027',
    'jnvst-class-6-2027',
    'jnvst-class-9-2027',
    'rpf-constable-2027',
    'rpf-si-2027'
  )
);
