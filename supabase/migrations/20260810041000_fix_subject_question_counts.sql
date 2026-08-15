UPDATE public.subjects s
SET questions_per_test = t.questions_per_test
FROM (
  SELECT e.slug AS exam_slug, s2.slug AS subject_slug, s2.questions_per_test
  FROM public.exams e
  JOIN public.subjects s2 ON s2.exam_id = e.id
) t
WHERE s.slug = t.subject_slug
  AND s.exam_id IN (
    SELECT id FROM public.exams WHERE slug IN (
      'jee-main-2027',
      'jee-advanced-2027',
      'neet-ug-2027',
      'jnvst-class-6-2027',
      'jnvst-class-9-2027',
      'upsccs-mains-2026',
      'ibps-po-mains-2026',
      'ibps-clerk-prelims-2026',
      'ssc-cpo-paper-1-2026',
      'ibps-rrb-officer-scale-i-prelims-2026',
      'ibps-rrb-office-assistant-prelims-2026'
    )
  );

UPDATE public.subjects
SET questions_per_test = 30
WHERE exam_id IN (
  SELECT id FROM public.exams WHERE slug IN (
    'jee-main-2027',
    'jee-advanced-2027',
    'neet-ug-2027',
    'upsccs-mains-2026',
    'ibps-po-mains-2026'
  )
);

UPDATE public.subjects
SET questions_per_test = 25
WHERE exam_id IN (
  SELECT id FROM public.exams WHERE slug IN (
    'jnvst-class-6-2027',
    'jnvst-class-9-2027',
    'ibps-clerk-prelims-2026',
    'ssc-cpo-paper-1-2026',
    'ibps-rrb-officer-scale-i-prelims-2026',
    'ibps-rrb-office-assistant-prelims-2026'
  )
);
