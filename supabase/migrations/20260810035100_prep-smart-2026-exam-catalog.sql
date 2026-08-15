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
    'upsccs-mains-2026',
    'UPSC Civil Services (Mains) 2026',
    'UPSC CSE',
    'Civil Services',
    '21 August 2026',
    'Mains cycle starts from 21 August 2026. Verify dates on the UPSC calendar.',
    'Bureaucracy, governance, history, geography, and specialized optional elective subjects for IAS, IPS and IFS recruitment.',
    'blue',
    6
  ),
  (
    'ibps-po-mains-2026',
    'IBPS PO (Mains) 2026',
    'IBPS PO',
    'Banking',
    '4 October 2026',
    'Officer-scale vacancies across major public-sector Indian banks.',
    'Reasoning, quantitative aptitude, English language and general bank awareness for officer-scale recruitment.',
    'purple',
    7
  ),
  (
    'ibps-clerk-prelims-2026',
    'IBPS Clerk (Prelims) 2026',
    'IBPS Clerk',
    'Banking',
    '10 October and 11 October 2026',
    'Over 11,000 customer service associate posts.',
    'Numerical ability, English proficiency and reasoning logic for clerical banking recruitment.',
    'amber',
    8
  ),
  (
    'ssc-cpo-paper-1-2026',
    'SSC CPO (Paper 1) 2026',
    'SSC CPO',
    'SSC',
    'Scheduled across October – November 2026',
    'Paper I schedule is issued by SSC examination calendar.',
    'General intelligence, general awareness, quantitative aptitude and English comprehension for Sub-Inspector recruitment.',
    'rose',
    9
  ),
  (
    'ibps-rrb-officer-scale-i-prelims-2026',
    'IBPS RRB Officer Scale I (Prelims) 2026',
    'IBPS RRB Scale I',
    'Banking',
    '21 November and 22 November 2026',
    'Scale-I officer recruitment in regional rural banks.',
    'Logic reasoning and quantitative calculations for officer-scale rural banking recruitment.',
    'green',
    10
  ),
  (
    'ibps-rrb-office-assistant-prelims-2026',
    'IBPS RRB Office Assistant (Prelims) 2026',
    'IBPS RRB Office Assistant',
    'Banking',
    '6 December, 12 December and 13 December 2026',
    'Clerical and multi-purpose staff recruitment across rural banking branches.',
    'Quantitative mathematics and analytical reasoning for office assistant recruitment in regional rural banks.',
    'orange',
    11
  );

INSERT INTO public.subjects (exam_id, slug, name, description, duration_minutes, questions_per_test, sort_order)
SELECT e.id, s.slug, s.name, s.description, s.duration, s.qcount, s.ord
FROM public.exams e
JOIN (VALUES
  ('upsccs-mains-2026','governance-and-constitution','Governance & Constitution','Public administration, polity, constitutional bodies and governance systems',30,25,1),
  ('upsccs-mains-2026','history-and-society','History & Society','Modern India, freedom movement, socio-political themes and culture',30,25,2),
  ('upsccs-mains-2026','geography-and-environment','Geography & Environment','Physical geography, resources, ecology and climate',30,25,3),
  ('upsccs-mains-2026','optional-elective','Optional Elective','Subject-specific optional elective practice and paper strategy',30,25,4),

  ('ibps-po-mains-2026','reasoning-ability','Reasoning Ability','Logical arrangement, coding, decision-making and input-output practice',20,30,1),
  ('ibps-po-mains-2026','quantitative-aptitude','Quantitative Aptitude','Arithmetic, data interpretation and speed calculation',20,30,2),
  ('ibps-po-mains-2026','english-language','English Language','Reading, grammar, vocabulary and comprehension',20,25,3),
  ('ibps-po-mains-2026','banking-awareness','General Bank Awareness','Banking, economy, financial terminology and current awareness',20,25,4),

  ('ibps-clerk-prelims-2026','numerical-ability','Numerical Ability','Arithmetic, simplification, DI and computation practice',20,25,1),
  ('ibps-clerk-prelims-2026','english-proficiency','English Proficiency','Grammar, para-jumbles, comprehension and vocabulary',20,25,2),
  ('ibps-clerk-prelims-2026','reasoning-logic','Reasoning Logic','Seating, blood relation, coding, puzzles and analogy',20,25,3),

  ('ssc-cpo-paper-1-2026','general-intelligence','General Intelligence','Analogies, series, coding, classification and logical reasoning',20,25,1),
  ('ssc-cpo-paper-1-2026','general-awareness','General Awareness','Static GK, economy, polity, science and current affairs',20,25,2),
  ('ssc-cpo-paper-1-2026','quantitative-mathematics','Quantitative Mathematics','Arithmetic, algebra, geometry and data interpretation',20,25,3),
  ('ssc-cpo-paper-1-2026','english-comprehension','English Comprehension','Grammar, vocabulary, cloze, error spotting and comprehension',20,25,4),

  ('ibps-rrb-officer-scale-i-prelims-2026','logic-reasoning','Logic Reasoning','Puzzle, syllogism, seating, coding, direction and ranking',20,25,1),
  ('ibps-rrb-officer-scale-i-prelims-2026','quantitative-calculations','Quantitative Calculations','Speed math, arithmetic and DI drill',20,25,2),

  ('ibps-rrb-office-assistant-prelims-2026','quantitative-mathematics','Quantitative Mathematics','Arithmetic, simplification and problem solving',20,25,1),
  ('ibps-rrb-office-assistant-prelims-2026','analytical-reasoning','Analytical Reasoning','Reasoning patterns, logic sequences and data-based logic',20,25,2)
) AS s(exam_slug, slug, name, description, duration, qcount, ord)
ON e.slug = s.exam_slug;
