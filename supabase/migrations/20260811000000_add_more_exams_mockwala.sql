-- Add more competitive exams for MockWala
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
    'jee-main-2026',
    'JEE Main 2026',
    'JEE Main',
    'Engineering',
    '1 February 2026 – 8 February 2026',
    'Registration deadline: Verify on NTA official website.',
    'Physics, Chemistry, and Mathematics for undergraduate engineering admission across Indian institutes.',
    'cyan',
    1
  ),
  (
    'jee-advanced-2026',
    'JEE Advanced 2026',
    'JEE Advanced',
    'Engineering',
    'June 2026',
    'Only top 2,50,000 JEE Main qualifiers can appear for JEE Advanced.',
    'Advanced level Physics, Chemistry, and Mathematics for IIT undergraduate admissions.',
    'indigo',
    2
  ),
  (
    'neet-ug-2026',
    'NEET UG 2026',
    'NEET UG',
    'Medical',
    '4 May 2026',
    'Application window: Verify on NTA official website.',
    'Physics, Chemistry, and Biology for undergraduate medical and dental admissions nationwide.',
    'red',
    3
  ),
  (
    'neet-pg-2026',
    'NEET PG 2026',
    'NEET PG',
    'Medical',
    'August 2026',
    'Postgraduate medical admission test. Only MBBS graduates eligible.',
    'Internal Medicine, Surgery, Pediatrics and 150+ medical specializations.',
    'pink',
    4
  ),
  (
    'upsc-prelims-2026',
    'UPSC Prelims 2026',
    'UPSC Prelims',
    'Civil Services',
    '31 May 2026',
    'Registration deadline: Verify on UPSC official notification.',
    'General Studies and CSAT (Aptitude) for IAS, IPS and IFS preliminary examination.',
    'amber',
    5
  ),
  (
    'ssc-cgl-2026',
    'SSC CGL 2026',
    'SSC CGL',
    'SSC',
    'Tier I: December 2026',
    'Combined Graduate Level recruitment for Central Government departments.',
    'General Intelligence, English, Quantitative Aptitude and General Awareness for Group-B and C posts.',
    'lime',
    12
  ),
  (
    'ssc-chsl-2026',
    'SSC CHSL 2026',
    'SSC CHSL',
    'SSC',
    'Tier I: August 2026',
    'Combined Higher Secondary Level recruitment for postal, income tax and customs departments.',
    'Reasoning, Quantitative Aptitude, English Language for LDC, DEO and HSL posts.',
    'teal',
    13
  ),
  (
    'ssc-stenographer-2026',
    'SSC Stenographer 2026',
    'SSC Stenographer',
    'SSC',
    'October 2026',
    'Stenographer Grade-B and Grade-C recruitment in Central Government offices.',
    'Reasoning, English, General Awareness and Stenography skill test.',
    'violet',
    14
  ),
  (
    'dsssb-teacher-2026',
    'DSSSB Teacher 2026',
    'DSSSB Teacher',
    'School Entrance',
    'Multiple cycles across 2026',
    'Delhi Subordinate Services Selection Board teacher recruitment.',
    'Subject expertise, Teaching methodology, Pedagogy and language proficiency for various school subjects.',
    'fuchsia',
    15
  ),
  (
    'kvs-prt-2026',
    'KVS PRT 2026',
    'KVS Teacher',
    'School Entrance',
    'February 2026',
    'Kendriya Vidyalaya Sangathan Primary Teacher recruitment.',
    'Child Development, Pedagogy, Language and General Knowledge for primary teacher positions.',
    'sky',
    16
  ),
  (
    'rrb-ntpc-2026',
    'RRB NTPC 2026',
    'RRB NTPC',
    'RRB',
    'Tier I: November 2026',
    'Non-Technical Popular Categories recruitment in Indian Railways.',
    'Reasoning, Mathematics, General Awareness and Current Events for Grade-A and Grade-B positions.',
    'slate',
    17
  ),
  (
    'rrb-je-2026',
    'RRB JE 2026',
    'RRB JE',
    'Engineering',
    'Tier I: December 2026',
    'Junior Engineer recruitment in Indian Railways across civil, mechanical and electrical disciplines.',
    'Technical subject expertise, General Awareness and aptitude for railway infrastructure engineering roles.',
    'stone',
    18
  ),
  (
    'bank-po-sbi-2026',
    'SBI PO 2026',
    'SBI PO',
    'Banking',
    'Prelims: April 2026, Mains: May 2026',
    'State Bank of India Probationary Officer recruitment.',
    'Reasoning, Quantitative Aptitude, English, Banking and General Awareness for officer cadre.',
    'bronze',
    19
  ),
  (
    'bank-clerk-rbi-2026',
    'RBI Grade-B Officer 2026',
    'RBI Grade-B',
    'Banking',
    'Phase I: October 2026',
    'Reserve Bank of India officer recruitment for policy formulation and regulatory roles.',
    'Economics, Banking, Finance, General Awareness and analytical reasoning for RBI officer positions.',
    'gold',
    20
  );

-- Add subjects for new exams
INSERT INTO public.subjects (exam_id, slug, name, description, duration_minutes, questions_per_test, sort_order)
SELECT e.id, s.slug, s.name, s.description, s.duration, s.qcount, s.ord
FROM public.exams e
JOIN (VALUES
  ('jee-main-2026','physics-jee','Physics','Mechanics, thermodynamics, waves, electricity and modern physics',90,25,1),
  ('jee-main-2026','chemistry-jee','Chemistry','Inorganic, organic and physical chemistry fundamentals',90,25,2),
  ('jee-main-2026','mathematics-jee','Mathematics','Algebra, trigonometry, calculus and coordinate geometry',90,25,3),

  ('jee-advanced-2026','physics-advanced','Physics Advanced','Advanced mechanics, quantum mechanics and wave phenomena',180,30,1),
  ('jee-advanced-2026','chemistry-advanced','Chemistry Advanced','Advanced organic, inorganic and physical chemistry',180,30,2),
  ('jee-advanced-2026','mathematics-advanced','Mathematics Advanced','Advanced calculus, matrices and complex analysis',180,30,3),

  ('neet-ug-2026','physics-neet','Physics','Motion, thermodynamics, optics and modern physics for medical',180,25,1),
  ('neet-ug-2026','chemistry-neet','Chemistry','Chemical bonding, coordination compounds and organic reactions',180,25,2),
  ('neet-ug-2026','biology-neet','Biology','Botany and Zoology - cell biology, genetics and physiology',180,25,3),

  ('neet-pg-2026','internal-medicine','Internal Medicine','Clinical cases and management protocols for medical specialists',120,30,1),
  ('neet-pg-2026','surgery','Surgery','Surgical procedures, diagnosis and therapeutic techniques',120,30,2),
  ('neet-pg-2026','pathology','Pathology','Tissue diagnosis, autopsy findings and laboratory interpretation',120,25,3),

  ('upsc-prelims-2026','general-studies-prelims','General Studies','History, geography, economy, politics and social schemes',120,30,1),
  ('upsc-prelims-2026','csat-aptitude','CSAT Aptitude','Logic, reasoning, data interpretation and decision making',120,25,2),

  ('ssc-cgl-2026','general-intelligence-cgl','General Intelligence','Series, analogies, classification and matrix reasoning',75,25,1),
  ('ssc-cgl-2026','english-cgl','English Language','Grammar, synonyms, antonyms and reading comprehension',90,25,2),
  ('ssc-cgl-2026','quantitative-aptitude-cgl','Quantitative Aptitude','Arithmetic, algebra and data interpretation',90,25,3),
  ('ssc-cgl-2026','general-awareness-cgl','General Awareness','Current events, geography, economics and science',90,25,4),

  ('ssc-chsl-2026','reasoning-chsl','Reasoning','Logical sequences, coding and pattern matching',60,20,1),
  ('ssc-chsl-2026','arithmetic-chsl','Arithmetic','Basic calculations, percentages and interest',60,20,2),
  ('ssc-chsl-2026','english-chsl','English','Grammar, vocabulary and error detection',60,20,3),

  ('ssc-stenographer-2026','english-steno','English Language','Grammar, comprehension and written communication',90,25,1),
  ('ssc-stenographer-2026','general-knowledge-steno','General Knowledge','Current affairs, history and science fundamentals',90,25,2),

  ('dsssb-teacher-2026','child-development','Child Development & Pedagogy','Learning theories, child psychology and educational practices',60,20,1),
  ('dsssb-teacher-2026','english-subject','English Subject','Literature, grammar and communication skills',60,20,2),
  ('dsssb-teacher-2026','mathematics-subject','Mathematics','Number systems, algebra and geometry fundamentals',60,20,3),

  ('kvs-prt-2026','pedagogy','Child Pedagogy','Child development, learning and classroom management',60,20,1),
  ('kvs-prt-2026','language','Language Skills','Hindi and English proficiency for primary education',60,20,2),
  ('kvs-prt-2026','kvs-awareness','KVS Awareness','Institutional knowledge and general awareness',60,20,3),

  ('rrb-ntpc-2026','reasoning-ntpc','Reasoning','Puzzles, arrangements and logical deduction',90,25,1),
  ('rrb-ntpc-2026','mathematics-ntpc','Mathematics','Percentages, profit-loss and number systems',90,25,2),
  ('rrb-ntpc-2026','general-knowledge-ntpc','General Knowledge','Current affairs, geography and historical events',90,25,3),

  ('rrb-je-2026','technical-je','Technical Subjects','Civil, Mechanical and Electrical engineering concepts',120,30,1),
  ('rrb-je-2026','general-awareness-je','General Awareness','Current events and railway-specific knowledge',60,20,2),

  ('bank-po-sbi-2026','reasoning-sbi','Reasoning','Logical reasoning, puzzles and arrangement problems',60,25,1),
  ('bank-po-sbi-2026','quantitative-sbi','Quantitative Aptitude','Data interpretation and speed calculations',60,25,2),
  ('bank-po-sbi-2026','english-sbi','English Language','Reading comprehension and grammar',40,20,3),
  ('bank-po-sbi-2026','banking-sbi','Banking & GA','Current banking policies and general knowledge',40,20,4),

  ('bank-clerk-rbi-2026','economics-rbi','Economics & Finance','Monetary policy, banking regulations and finance',120,30,1),
  ('bank-clerk-rbi-2026','rbi-awareness','RBI Structure & Function','Central banking, financial systems and regulations',120,30,2),
  ('bank-clerk-rbi-2026','general-studies-rbi','General Studies','Polity, economics and current international affairs',120,25,3)
) AS s(exam_slug, slug, name, description, duration, qcount, ord)
ON e.slug = s.exam_slug;
