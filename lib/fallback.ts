import type { Branch, Course, SiteSettings } from "./types";

// Built-in seed content. Used when no Sanity project is connected yet (or a
// query returns nothing), so the site is fully functional on first run. Once
// real content exists in Sanity, that data takes over automatically.
//
// PLACEHOLDERS to replace in Sanity later: branch street addresses, exact fee
// figures, and any branch-specific phone numbers. One shared phone is used
// everywhere for now: +91 97028 36946.

const SHARED_PHONE = "+91 97028 36946";

export const fallbackSettings: SiteSettings = {
  orgName: "ABS Educational Solution",
  tagline: "D.Pharm, Nursing & Paramedical Admissions — Mumbai, since 2009",
  description:
    "ABS Educational Solution helps students get admission into D.Pharm, B.Pharm, Nursing and Paramedical courses across Mumbai. Trusted for 16+ years, with 6 branches, 16,000+ students enrolled and 88,000+ counselling sessions — free admission guidance.",
  domain: "abscareer.com",
  foundingYear: "2009",
  phone: SHARED_PHONE,
  whatsappNumber: "919702836946",
  email: "info@abscareer.com",
  address: "6 branches across Mumbai — Thane, Kurla, Malad, Bhayandar, Nalasopara, Andheri",
  socials: {},
  // E-E-A-T byline. Replace with a real named counsellor for a stronger trust signal.
  reviewerName: "ABS Admissions Counselling Team",
  reviewerCredential: "Guiding Mumbai students into pharmacy, nursing & paramedical colleges since 2009",
  // Add real student testimonials here (real names only — never fabricate reviews).
  testimonials: [],
};

// Each branch has unique local content (real Mumbai geography) so the pages are
// genuinely distinct, not duplicate. Street addresses are placeholders — update
// the real address + map embed per branch in the admin.
export const fallbackBranches: Branch[] = [
  {
    name: "Thane",
    slug: "thane",
    area: "Thane West — opposite Thane Railway Station",
    address:
      "Platform No. 1, Bal Ganesh Tower, 112, 1st floor, opp. Thane Railway Station, Thane West, Thane, Maharashtra 400601",
    postalCode: "400601",
    mapsUrl: "https://share.google/tw672KptfDfVA3rL9",
    phone: SHARED_PHONE,
    order: 1,
    intro:
      "Our Thane branch is one of our busiest centres. We help students from Thane and nearby areas get admission into D.Pharm, B.Pharm, Nursing and Paramedical courses — with free, friendly counselling close to home.",
    localities: [
      "Naupada",
      "Wagle Estate",
      "Ghodbunder Road",
      "Majiwada",
      "Kopri",
      "Kalwa & Mumbra",
      "Mulund (nearby)",
      "Dombivli & Kalyan (nearby)",
    ],
    transport:
      "Easy to reach from Thane railway station (Central & Trans-Harbour lines) and the Thane bus depot.",
    faqs: [
      {
        question: "Which courses can I get admission for at the Thane branch?",
        answer: "D.Pharm, B.Pharm, GNM, B.Sc Nursing, ANM and DMLT — with free counselling for each.",
      },
      {
        question: "Is the Thane branch near the station?",
        answer:
          "Yes, our Thane office is easy to reach from Thane railway station. Call us and we will guide you with directions.",
      },
    ],
  },
  {
    name: "Kurla",
    slug: "kurla",
    area: "Kurla West — Station Road",
    address:
      "2nd Floor, Kurla W Sta Rd, next to Rammahal Hotel / Modern Dairy, opp. Yogesh Footwear, Brahmanwadi, Kurla, Mumbai, Maharashtra 400070",
    postalCode: "400070",
    mapsUrl: "https://share.google/DzkGoDNyZ2d2o1Nmw",
    phone: SHARED_PHONE,
    order: 2,
    intro:
      "Our Kurla branch is a central, easy-to-reach centre for students across central Mumbai. We guide you into D.Pharm, B.Pharm, Nursing and Paramedical courses with honest, free counselling.",
    localities: [
      "Kurla West & East",
      "Nehru Nagar",
      "Chunabhatti",
      "Tilak Nagar",
      "Chembur (nearby)",
      "Ghatkopar (nearby)",
      "Sion (nearby)",
      "Vidyavihar",
    ],
    transport:
      "Right in the Kurla hub — reachable from Kurla railway station (Central & Harbour lines) and LTT terminus.",
    faqs: [
      {
        question: "Where is the ABS Kurla branch?",
        answer:
          "We are located in the Kurla area, close to Kurla station. Call us for the exact address and directions.",
      },
      {
        question: "Can students from Chembur or Ghatkopar visit the Kurla branch?",
        answer:
          "Yes. The Kurla branch is convenient for students from Chembur, Ghatkopar, Sion and nearby areas.",
      },
    ],
  },
  {
    name: "Malad",
    slug: "malad",
    area: "Malad East — Manchubhai Road",
    address:
      "Office No. 5, 1st floor, Ayambil Bhavan, Manchubhai Rd, above Indian Handloom, opp. Surabhi Sweets, Malad East, Mumbai, Maharashtra 400097",
    postalCode: "400097",
    mapsUrl: "https://share.google/IZNvl5Y9jFzgOMj0p",
    phone: SHARED_PHONE,
    order: 3,
    intro:
      "Our Malad branch serves students across the western suburbs. Get free guidance for D.Pharm, B.Pharm, Nursing and Paramedical admissions, close to home.",
    localities: [
      "Malad West & East",
      "Malvani",
      "Mindspace",
      "Marve Road",
      "Goregaon (nearby)",
      "Kandivali (nearby)",
      "Borivali (nearby)",
    ],
    transport: "Easy to reach from Malad railway station on the Western line.",
    faqs: [
      {
        question: "Which areas does the Malad branch cover?",
        answer: "Malad, Goregaon, Kandivali, Borivali and nearby western-suburb areas.",
      },
      {
        question: "Do I need an appointment to visit the Malad branch?",
        answer:
          "No appointment needed — just call or WhatsApp us and visit for free counselling.",
      },
    ],
  },
  {
    name: "Bhayandar",
    slug: "bhayandar",
    area: "Bhayandar East — BP Road",
    address:
      "Mini Market Building, 104-106, BP Rd, beside Bassein Catholic Bank, Venkateshwar Nagar, Bhayandar East, Mira Bhayandar, Maharashtra 401105",
    postalCode: "401105",
    mapsUrl: "https://share.google/XBoU327ti29IrZOII",
    phone: SHARED_PHONE,
    order: 4,
    intro:
      "Our Bhayandar branch makes admission guidance easy for students in the Mira-Bhayandar area. We help with D.Pharm, B.Pharm, Nursing and Paramedical courses — free counselling, close by.",
    localities: [
      "Bhayandar West & East",
      "Mira Road (nearby)",
      "Uttan",
      "Naya Nagar",
      "Naigaon (nearby)",
    ],
    transport: "Easy to reach from Bhayandar railway station on the Western line.",
    faqs: [
      {
        question: "Can Mira Road students use the Bhayandar branch?",
        answer:
          "Yes. The Bhayandar branch is convenient for students from Mira Road, Naigaon and nearby areas.",
      },
      {
        question: "Which courses are available through the Bhayandar branch?",
        answer: "D.Pharm, B.Pharm, GNM, B.Sc Nursing, ANM and DMLT.",
      },
    ],
  },
  {
    name: "Nalasopara",
    slug: "nalasopara",
    area: "Nalasopara East — Moregaon Talao",
    address:
      "Sai Vibhuti Apartment, B-403, above Maurya Dairy, Nala Sopara, Moregaon Talao, Nalasopara East, Vasai-Virar, Maharashtra 401209",
    postalCode: "401209",
    mapsUrl: "https://share.google/gO6W6GZD617Fkj5n5",
    phone: SHARED_PHONE,
    order: 5,
    intro:
      "Our Nalasopara branch supports students across the Vasai-Virar belt. Get free, friendly guidance for D.Pharm, B.Pharm, Nursing and Paramedical admissions without travelling far.",
    localities: [
      "Nalasopara West & East",
      "Vasai (nearby)",
      "Virar (nearby)",
      "Naigaon (nearby)",
    ],
    transport: "Easy to reach from Nalasopara railway station on the Western line.",
    faqs: [
      {
        question: "Is there an ABS branch near Vasai or Virar?",
        answer:
          "Yes — our Nalasopara branch is convenient for students from Vasai, Virar and Naigaon.",
      },
      {
        question: "Can I get D.Pharm admission guidance at Nalasopara?",
        answer:
          "Yes. We guide Nalasopara-area students for D.Pharm and all our other courses, free of cost.",
      },
    ],
  },
  {
    name: "Andheri",
    slug: "andheri",
    area: "Andheri East — Vertex Vikas",
    address: "B-Wing, Vertex Vikas, B-503/504, Andheri East, Mumbai, Maharashtra 400069",
    postalCode: "400069",
    mapsUrl: "https://share.google/arq1wXC65Z1biHClB",
    phone: SHARED_PHONE,
    order: 6,
    intro:
      "Our Andheri branch is a major centre for students across the western suburbs. Get expert, free guidance for D.Pharm, B.Pharm, Nursing and Paramedical admissions in one of Mumbai's busiest hubs.",
    localities: [
      "Andheri West & East",
      "Lokhandwala",
      "Versova",
      "JB Nagar",
      "Marol & MIDC",
      "Jogeshwari (nearby)",
      "Vile Parle (nearby)",
      "Goregaon (nearby)",
    ],
    transport:
      "Very easy to reach — Andheri station connects the Western line, Harbour line and the Metro.",
    faqs: [
      {
        question: "Where is the ABS Andheri branch?",
        answer:
          "We are in the Andheri area, close to Andheri station. Call us for the exact address and directions.",
      },
      {
        question: "Is the Andheri branch good for Jogeshwari or Vile Parle students?",
        answer:
          "Yes. Andheri is a central hub, convenient for students from Jogeshwari, Vile Parle, Goregaon and nearby areas.",
      },
    ],
  },
];

export const fallbackCourses: Course[] = [
  // ---------- D.Pharm (flagship) ----------
  {
    title: "D Pharma Admission 2026 in Mumbai",
    slug: "d-pharma-admission-2026",
    courseShortName: "D.Pharm",
    highlights: [
      "2-year diploma — start your pharmacy career early.",
      "No NEET needed — only 12th Science required.",
      "Become a registered pharmacist (PCI registration).",
      "You can open your own medical store after registration.",
      "Approved by PCI and MSBTE.",
      "Good demand in India and abroad.",
    ],
    subjects: [
      "Pharmaceutics — how medicines are made.",
      "Pharmacology — how medicines work in the body.",
      "Pharmaceutical Chemistry.",
      "Pharmacognosy — medicines from plants.",
      "Human Anatomy & Physiology.",
      "Hospital & Clinical Pharmacy.",
      "Drug Store & Business Management.",
    ],
    jobRoles: [
      "Registered Pharmacist",
      "Medical Store Owner",
      "Hospital Pharmacist",
      "Pharmacy Assistant",
      "Medical Representative (MR)",
    ],
    workAreas: [
      "Hospitals and clinics",
      "Retail medical stores",
      "Pharma manufacturing companies",
      "Drug distribution and wholesale",
      "Government health departments",
    ],
    salaryRange:
      "Starting salary is usually ₹15,000–₹25,000 per month. You can earn much more with your own medical store or with experience.",
    higherStudies: [
      "B.Pharm — direct second-year entry is possible after D.Pharm.",
      "Then M.Pharm or an MBA in pharma management.",
    ],
    documentsRequired: [
      "10th and 12th marksheets",
      "School leaving / transfer certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste certificate (if applicable)",
      "Domicile certificate (if asked)",
    ],
    shortDescription:
      "D Pharma admission in Mumbai 2026 — Diploma in Pharmacy is a 2-year course after 12th, no NEET. ABS helps you get into approved Mumbai colleges across 6 branches.",
    openingAnswer:
      "D Pharma admission in Mumbai for 2026 is open now. D.Pharm (Diploma in Pharmacy) is a 2-year course you can do right after 12th — no NEET needed. ABS Educational Solution helps you get D Pharma admission in approved PCI / MSBTE colleges across Mumbai, with free counselling and honest fee guidance at all 6 branches.",
    whatIs:
      "D.Pharm stands for Diploma in Pharmacy. It is a 2-year course you can join right after 12th. After D.Pharm you can become a registered pharmacist and open your own medical store, or work in hospitals and pharma companies. It is one of the most popular and safe career choices after 12th science. In Mumbai, D Pharma is one of the most in-demand courses after 12th — ABS guides you to the right PCI / MSBTE-approved college near you.",
    quickFacts: {
      duration: "2 years",
      eligibility: "12th with PCB / PCM",
      approvedBy: "PCI / MSBTE",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th with Science (Physics, Chemistry, Biology or Maths).",
      "Minimum marks are usually 45–50% (relaxation for reserved categories).",
      "NEET is NOT required for D.Pharm admission.",
      "Students who failed once or have a gap year can also apply.",
    ],
    admissionSteps: [
      "Call or WhatsApp ABS — tell us your marks and preferred branch.",
      "Free counselling — we suggest the best approved colleges for you.",
      "We help you fill the admission form and arrange your documents.",
      "Confirm your seat and complete the fee process.",
      "Start your D.Pharm classes for the 2026 batch.",
    ],
    feesInfo:
      "D Pharma fees in Mumbai vary by college and management quota. We share the honest, current 2026 fee range during free counselling — no hidden charges. (Confirm exact fees with our counsellor.)",
    feesRange: "₹15,000 – ₹1,00,000 per year (approx.)",
    officialBodies: [
      { name: "Pharmacy Council of India (PCI)", url: "https://www.pci.nic.in/" },
      { name: "MSBTE", url: "https://msbte.org.in/" },
    ],
    careerScope:
      "After D.Pharm you can register as a pharmacist, open your own medical store, work in hospitals, or join pharma companies. You can also study further with B.Pharm. Salaries start around ₹15,000–₹25,000/month and grow with experience.",
    faqs: [
      {
        question: "Is D.Pharm admission open for 2026?",
        answer: "Yes. Admission for the 2026 batch is open. Contact ABS early — good colleges fill fast.",
      },
      {
        question: "Can I do D.Pharm without NEET?",
        answer: "Yes. NEET is not needed for D.Pharm. You only need to pass 12th with Science.",
      },
      {
        question: "What is the D.Pharm course fees in Mumbai?",
        answer:
          "Fees depend on the college and quota. We share the real, current 2026 fee range during free counselling so you can plan properly.",
      },
      {
        question: "Which are the best D Pharma colleges in Mumbai?",
        answer:
          "There are many PCI and MSBTE-approved D Pharma colleges across Mumbai — in the western, central and harbour suburbs. During free counselling we shortlist the best approved colleges near your branch, based on your 12th marks and budget.",
      },
      {
        question: "How can I get D Pharma admission in Mumbai for 2026?",
        answer:
          "Call or WhatsApp ABS with your 12th marks and preferred area. We guide you on approved Mumbai colleges, help you fill the form and arrange documents, and confirm your seat for the 2026 batch — all free of cost.",
      },
      {
        question: "How do I get admission through ABS?",
        answer:
          "Just call or WhatsApp us on " +
          SHARED_PHONE +
          ". We guide you from enquiry to final admission, free of cost.",
      },
      {
        question: "Can I do D.Pharm after a gap year or failing once?",
        answer: "Yes. Students with a gap year or one attempt can still apply. We will guide you.",
      },
      {
        question: "What can I do after D.Pharm?",
        answer:
          "You can become a pharmacist, open a medical store, work in hospitals, or do B.Pharm for higher growth.",
      },
    ],
    seo: {
      title: "D Pharma Admission 2026 in Mumbai | Fees, Eligibility | ABS",
      description:
        "D.Pharm admission 2026 in Mumbai — eligibility, fees and approved colleges. No NEET needed. Free counselling at 6 ABS branches. Call now.",
    },
  },

  // ---------- B.Pharm ----------
  {
    title: "B Pharma Admission 2026 in Mumbai",
    slug: "b-pharma-admission-2026",
    courseShortName: "B.Pharm",
    highlights: [
      "4-year degree — higher growth than a diploma.",
      "Approved by PCI and AICTE.",
      "Strong career in the pharmaceutical industry.",
      "Clear path to M.Pharm, MBA or research.",
      "Jobs available in India and abroad.",
    ],
    subjects: [
      "Pharmaceutics.",
      "Pharmaceutical Chemistry.",
      "Pharmacology.",
      "Pharmacognosy.",
      "Pharmaceutical Analysis.",
      "Biochemistry & Microbiology.",
      "Pharmaceutical Industrial Management.",
    ],
    jobRoles: [
      "Pharmacist",
      "Production / Quality Control Officer",
      "Drug Inspector (through a government exam)",
      "Clinical Research Associate",
      "Pharma Marketing / Brand Manager",
    ],
    workAreas: [
      "Pharmaceutical manufacturing companies",
      "Hospitals",
      "Research & development labs",
      "Drug regulatory bodies",
      "Pharma marketing and sales",
    ],
    salaryRange:
      "Starting salary is usually ₹20,000–₹35,000 per month. Senior and specialised roles pay much more.",
    higherStudies: [
      "M.Pharm — specialise in your chosen area.",
      "MBA in Pharma / Healthcare Management.",
      "Pharm.D or research (PhD).",
    ],
    documentsRequired: [
      "10th and 12th marksheets",
      "Entrance scorecard (MHT-CET, if your college needs it)",
      "School leaving / transfer certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste / domicile certificate (if applicable)",
    ],
    shortDescription:
      "B Pharma admission in Mumbai 2026 — Bachelor of Pharmacy is a 4-year degree after 12th. ABS guides you into approved Mumbai colleges across 6 branches.",
    openingAnswer:
      "B Pharma admission in Mumbai for 2026 is open. B.Pharm (Bachelor of Pharmacy) is a 4-year degree you can do after 12th Science. ABS Educational Solution helps you get B Pharma admission into approved pharmacy colleges across Mumbai — with free counselling.",
    whatIs:
      "B.Pharm stands for Bachelor of Pharmacy. It is a 4-year degree course after 12th. It gives you deeper knowledge than D.Pharm and better job and salary growth. After B.Pharm you can work in pharma companies, hospitals, or research, and even study M.Pharm later.",
    quickFacts: {
      duration: "4 years",
      eligibility: "12th with PCB / PCM",
      approvedBy: "PCI / AICTE",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th with Science (PCB or PCM).",
      "Minimum marks are usually around 45–50% (relaxation for reserved categories).",
      "Some colleges accept MHT-CET or other entrance scores — we explain what your college needs.",
    ],
    admissionSteps: [
      "Contact ABS with your 12th marks and preferred location.",
      "Get free counselling on the best B.Pharm colleges for you.",
      "We help with the form, documents and entrance details.",
      "Confirm your seat and complete the fees.",
      "Begin your B.Pharm degree in the 2026 batch.",
    ],
    feesInfo:
      "B.Pharm fees are higher than D.Pharm and vary by college. We give you an honest fee range during counselling. (Confirm exact fees with our counsellor.)",
    feesRange: "₹40,000 – ₹1,50,000 per year (approx.)",
    officialBodies: [
      { name: "Pharmacy Council of India (PCI)", url: "https://www.pci.nic.in/" },
      { name: "AICTE", url: "https://www.aicte-india.org/" },
    ],
    careerScope:
      "After B.Pharm you can work in pharmaceutical companies, hospitals, drug control, marketing, or research. You can also do M.Pharm or MBA. It offers strong long-term salary growth.",
    faqs: [
      {
        question: "Is B.Pharm better than D.Pharm?",
        answer:
          "B.Pharm is a 4-year degree with wider jobs and higher salary. D.Pharm is a faster 2-year diploma. We help you choose based on your goals and budget.",
      },
      {
        question: "Is B.Pharm admission open for 2026?",
        answer: "Yes. The 2026 admission process is open. Contact ABS to start early.",
      },
      {
        question: "Do I need an entrance exam for B.Pharm?",
        answer:
          "Some colleges ask for MHT-CET or similar. We tell you exactly what your chosen college needs.",
      },
      {
        question: "What is the scope after B.Pharm?",
        answer:
          "Pharma companies, hospitals, research, marketing, drug inspector roles, and higher studies like M.Pharm.",
      },
    ],
    seo: {
      title: "B Pharma Admission 2026 in Mumbai | Fees, Eligibility | ABS",
      description:
        "B.Pharm admission 2026 in Mumbai — eligibility, fees and approved colleges. Free counselling at 6 ABS branches. Call ABS today.",
    },
  },

  // ---------- GNM ----------
  {
    title: "GNM Nursing Admission 2026 in Mumbai",
    slug: "gnm-nursing-admission-2026",
    courseShortName: "GNM",
    highlights: [
      "3-year nursing course plus a 6-month internship.",
      "Open to students from any stream.",
      "Become a working nurse faster.",
      "Strong demand in India and the Gulf.",
      "You can upgrade to B.Sc Nursing later.",
    ],
    subjects: [
      "Anatomy & Physiology.",
      "Nursing Foundations.",
      "Medical-Surgical Nursing.",
      "Child Health Nursing.",
      "Mental Health Nursing.",
      "Midwifery & Gynaecology.",
      "Community Health Nursing.",
    ],
    jobRoles: [
      "Staff Nurse",
      "Midwife",
      "Community Health Nurse",
      "ICU / Ward Nurse",
      "Home Care Nurse",
    ],
    workAreas: [
      "Government and private hospitals",
      "Nursing homes and clinics",
      "Community health centres",
      "Abroad (after experience and required exams)",
    ],
    salaryRange:
      "Starting salary is usually ₹15,000–₹30,000 per month, and higher abroad.",
    higherStudies: [
      "Post Basic B.Sc Nursing.",
      "Specialisation courses (ICU, dialysis, and more).",
    ],
    documentsRequired: [
      "10th and 12th marksheets",
      "School leaving / transfer certificate",
      "Medical fitness certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste / domicile certificate (if applicable)",
    ],
    shortDescription:
      "GNM nursing admission in Mumbai 2026 — a 3-year nursing course after 12th. ABS guides you into recognised Mumbai colleges across 6 branches.",
    openingAnswer:
      "GNM nursing admission in Mumbai for 2026 is open. GNM (General Nursing and Midwifery) is a 3-year nursing course you can do after 12th. ABS helps you get admission into recognised nursing colleges across Mumbai — with free counselling.",
    whatIs:
      "GNM stands for General Nursing and Midwifery. It is a 3-year course (plus 6 months internship). It trains you to care for patients in hospitals. After GNM you become a nurse and can work in India or abroad. Students from any stream can apply.",
    quickFacts: {
      duration: "3 years + 6 months internship",
      eligibility: "12th pass (any stream, Science preferred)",
      approvedBy: "INC / State Nursing Council",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th — Science is preferred, but other streams are accepted by many colleges.",
      "Minimum marks are usually around 40–45%.",
      "Age is usually 17 years or above.",
    ],
    admissionSteps: [
      "Call or WhatsApp ABS with your 12th details.",
      "Free counselling — we shortlist recognised GNM colleges near you.",
      "We help with the form and documents.",
      "Confirm your seat and fees.",
      "Start your GNM course in the 2026 batch.",
    ],
    feesInfo:
      "GNM fees vary by college. We share the honest fee range in counselling so there are no surprises. (Confirm exact fees with our counsellor.)",
    feesRange: "₹25,000 – ₹1,00,000 per year (approx.)",
    officialBodies: [
      { name: "Indian Nursing Council (INC)", url: "https://www.indiannursingcouncil.gov.in/" },
    ],
    careerScope:
      "After GNM you can work as a staff nurse, midwife, or community health nurse in hospitals and clinics. You can also upgrade to B.Sc Nursing later. Demand for nurses is high in India and abroad.",
    faqs: [
      {
        question: "Can non-science students do GNM?",
        answer:
          "Yes. Many colleges accept Arts and Commerce students for GNM. We tell you which colleges accept your stream.",
      },
      {
        question: "Is GNM admission open for 2026?",
        answer: "Yes. The 2026 GNM admission is open. Apply early through ABS for better college choice.",
      },
      {
        question: "GNM vs ANM — which is better?",
        answer:
          "GNM is a 3-year course with more job options. ANM is shorter (2 years). We help you pick the right one.",
      },
      {
        question: "Can I work abroad after GNM?",
        answer: "Yes. Many GNM nurses work in the Gulf and other countries after gaining experience.",
      },
    ],
    seo: {
      title: "GNM Nursing Admission 2026 Mumbai | Eligibility, Fees | ABS",
      description:
        "GNM admission 2026 in Mumbai — eligibility for all streams, fees and recognised colleges. Free counselling at 6 ABS branches.",
    },
  },

  // ---------- B.Sc Nursing ----------
  {
    title: "B.Sc Nursing Admission 2026 in Mumbai",
    slug: "bsc-nursing-admission-2026",
    courseShortName: "B.Sc Nursing",
    highlights: [
      "4-year full nursing degree.",
      "Best choice for a long-term nursing career.",
      "High demand abroad — UK, Gulf, Australia.",
      "Path to M.Sc Nursing and teaching.",
      "Higher posts and salary than a diploma.",
    ],
    subjects: [
      "Anatomy, Physiology & Biochemistry.",
      "Nursing Foundations.",
      "Medical-Surgical Nursing.",
      "Obstetrics & Gynaecology.",
      "Child Health Nursing.",
      "Community Health Nursing.",
      "Nursing Research & Management.",
    ],
    jobRoles: [
      "Staff Nurse",
      "ICU / Critical Care Nurse",
      "Nursing Supervisor",
      "Nurse Educator",
      "Public Health Nurse",
    ],
    workAreas: [
      "Multi-speciality hospitals",
      "ICUs and emergency units",
      "Abroad (UK, Gulf, Australia)",
      "Nursing colleges (teaching)",
      "Government health services",
    ],
    salaryRange:
      "Starting salary is usually ₹20,000–₹40,000 per month, and significantly higher abroad.",
    higherStudies: [
      "M.Sc Nursing.",
      "Nurse Practitioner and specialisations.",
      "Hospital Administration (MHA).",
    ],
    documentsRequired: [
      "10th and 12th (PCB) marksheets",
      "School leaving / transfer certificate",
      "Medical fitness certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste / domicile certificate (if applicable)",
    ],
    shortDescription:
      "B.Sc Nursing admission in Mumbai 2026 — a 4-year nursing degree after 12th Science. ABS guides you into recognised Mumbai colleges across 6 branches.",
    openingAnswer:
      "B.Sc Nursing admission in Mumbai for 2026 is open. B.Sc Nursing is a 4-year nursing degree you can do after 12th with Science. ABS helps you get admission into recognised nursing colleges across Mumbai with free counselling.",
    whatIs:
      "B.Sc Nursing is a full nursing degree. It takes 4 years after 12th Science. It opens the best nursing careers in India and abroad, with higher posts and salary than a diploma. It is the top choice if you want a long-term nursing career.",
    quickFacts: {
      duration: "4 years",
      eligibility: "12th with Physics, Chemistry & Biology",
      approvedBy: "INC / State Nursing Council",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th with PCB (Physics, Chemistry, Biology).",
      "Minimum marks are usually around 45%.",
      "Some colleges may ask for an entrance test — we guide you.",
    ],
    admissionSteps: [
      "Contact ABS with your 12th Science marks.",
      "Free counselling on recognised B.Sc Nursing colleges.",
      "We help with the form, documents and any entrance details.",
      "Confirm your seat and fees.",
      "Begin your B.Sc Nursing degree in 2026.",
    ],
    feesInfo:
      "B.Sc Nursing fees vary by college. We give you an honest fee range during counselling. (Confirm exact fees with our counsellor.)",
    feesRange: "₹40,000 – ₹1,50,000 per year (approx.)",
    officialBodies: [
      { name: "Indian Nursing Council (INC)", url: "https://www.indiannursingcouncil.gov.in/" },
    ],
    careerScope:
      "After B.Sc Nursing you can work as a staff nurse, ICU/critical care nurse, or nursing supervisor — in India, the Gulf, UK and Australia. You can also do M.Sc Nursing for teaching and senior roles.",
    faqs: [
      {
        question: "Is B.Sc Nursing better than GNM?",
        answer:
          "B.Sc Nursing is a degree with wider growth and better abroad options. GNM is a shorter diploma. We help you choose based on your goals.",
      },
      {
        question: "Do I need PCB for B.Sc Nursing?",
        answer: "Yes. B.Sc Nursing needs 12th with Physics, Chemistry and Biology.",
      },
      {
        question: "Is B.Sc Nursing admission open for 2026?",
        answer: "Yes. Apply early through ABS for the best recognised colleges.",
      },
    ],
    seo: {
      title: "B.Sc Nursing Admission 2026 Mumbai | Fees, Eligibility | ABS",
      description:
        "B.Sc Nursing admission 2026 in Mumbai — eligibility, fees and recognised colleges. Free counselling at 6 ABS branches.",
    },
  },

  // ---------- ANM ----------
  {
    title: "ANM Nursing Admission 2026 in Mumbai",
    slug: "anm-nursing-admission-2026",
    courseShortName: "ANM",
    highlights: [
      "Short 2-year nursing course.",
      "Open to any stream after 12th.",
      "Fastest way to start a nursing career.",
      "Great for community and rural health work.",
      "You can upgrade to GNM later.",
    ],
    subjects: [
      "Community Health Nursing.",
      "Health Promotion.",
      "Maternal & Child Health.",
      "Primary Healthcare.",
      "First Aid & Basic Nursing.",
    ],
    jobRoles: [
      "Auxiliary Nurse Midwife (ANM)",
      "Community Health Worker",
      "Health Assistant",
      "Clinic Nurse",
    ],
    workAreas: [
      "Primary health centres",
      "Community and rural health programmes",
      "Clinics and small hospitals",
      "NGOs and government health schemes",
    ],
    salaryRange: "Starting salary is usually ₹12,000–₹20,000 per month.",
    higherStudies: [
      "GNM (General Nursing & Midwifery).",
      "Then B.Sc Nursing for higher growth.",
    ],
    documentsRequired: [
      "10th and 12th marksheets",
      "School leaving / transfer certificate",
      "Medical fitness certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste / domicile certificate (if applicable)",
    ],
    shortDescription:
      "ANM nursing admission in Mumbai 2026 — a 2-year nursing course after 12th. ABS guides you into recognised Mumbai colleges. A fast start to a nursing career.",
    openingAnswer:
      "ANM nursing admission in Mumbai for 2026 is open. ANM (Auxiliary Nurse Midwifery) is a 2-year nursing course after 12th. ABS helps you join recognised ANM colleges across Mumbai — with free counselling.",
    whatIs:
      "ANM stands for Auxiliary Nurse Midwifery. It is a short 2-year nursing course. It is the fastest way to start working as a nurse, especially in community health and rural care. You can upgrade to GNM later.",
    quickFacts: {
      duration: "2 years",
      eligibility: "12th pass (any stream)",
      approvedBy: "INC / State Nursing Council",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th in any stream.",
      "Minimum marks are usually around 40%.",
      "Mainly for female candidates (as per nursing council rules).",
    ],
    admissionSteps: [
      "Call or WhatsApp ABS with your details.",
      "Free counselling on recognised ANM colleges.",
      "We help with form and documents.",
      "Confirm your seat and fees.",
      "Start your ANM course in 2026.",
    ],
    feesInfo:
      "ANM fees are usually lower than GNM and vary by college. We share the honest range in counselling. (Confirm exact fees with our counsellor.)",
    feesRange: "₹20,000 – ₹80,000 per year (approx.)",
    officialBodies: [
      { name: "Indian Nursing Council (INC)", url: "https://www.indiannursingcouncil.gov.in/" },
    ],
    careerScope:
      "After ANM you can work as an auxiliary nurse or community health worker in hospitals, clinics and health centres. You can later upgrade to GNM for more growth.",
    faqs: [
      {
        question: "What is the difference between ANM and GNM?",
        answer:
          "ANM is a 2-year basic nursing course. GNM is a 3-year course with more job options. We help you choose.",
      },
      {
        question: "Can any stream student do ANM?",
        answer: "Yes. ANM accepts students from any stream after 12th.",
      },
      {
        question: "Is ANM admission open for 2026?",
        answer: "Yes. Contact ABS to apply for the 2026 batch.",
      },
    ],
    seo: {
      title: "ANM Nursing Admission 2026 Mumbai | Eligibility, Fees | ABS",
      description:
        "ANM admission 2026 in Mumbai — 2-year nursing course, eligibility and fees. Free counselling at 6 ABS branches.",
    },
  },

  // ---------- DMLT / Paramedical ----------
  {
    title: "DMLT Admission 2026 in Mumbai (Medical Lab Technology)",
    slug: "dmlt-admission-2026",
    courseShortName: "DMLT",
    highlights: [
      "2-year paramedical diploma.",
      "In-demand medical lab technician jobs.",
      "Quick entry into the healthcare field.",
      "Work in labs, hospitals and blood banks.",
      "Steady demand across the country.",
    ],
    subjects: [
      "Clinical Pathology.",
      "Haematology — blood tests.",
      "Microbiology.",
      "Biochemistry.",
      "Blood Banking.",
      "Histopathology.",
    ],
    jobRoles: [
      "Lab Technician",
      "Pathology Assistant",
      "Phlebotomist",
      "Blood Bank Technician",
      "Lab Supervisor (with experience)",
    ],
    workAreas: [
      "Hospitals and diagnostic labs",
      "Pathology centres",
      "Blood banks",
      "Research labs",
      "Government health labs",
    ],
    salaryRange: "Starting salary is usually ₹12,000–₹22,000 per month.",
    higherStudies: [
      "B.Sc MLT (Medical Lab Technology).",
      "Specialised diagnostic courses.",
    ],
    documentsRequired: [
      "10th and 12th (Science) marksheets",
      "School leaving / transfer certificate",
      "Passport-size photos",
      "Aadhaar card",
      "Caste / domicile certificate (if applicable)",
    ],
    shortDescription:
      "DMLT admission in Mumbai 2026 — Diploma in Medical Lab Technology for in-demand diagnostic lab jobs. ABS guides you into recognised Mumbai institutes.",
    openingAnswer:
      "DMLT admission in Mumbai for 2026 is open. DMLT (Diploma in Medical Laboratory Technology) is a 2-year paramedical course you can do after 12th. ABS helps you join recognised DMLT institutes across Mumbai — with free counselling.",
    whatIs:
      "DMLT stands for Diploma in Medical Laboratory Technology. It trains you to do and read medical lab tests — like blood and pathology tests. After DMLT you work as a lab technician, one of the fastest-growing healthcare jobs.",
    quickFacts: {
      duration: "2 years",
      eligibility: "12th with Science (PCB / PCM)",
      approvedBy: "Recognised paramedical board",
      admissionStatus: "Open for 2026",
    },
    eligibilityPoints: [
      "You passed 12th with Science.",
      "Minimum marks are usually around 40–45%.",
      "No entrance exam needed for most institutes.",
    ],
    admissionSteps: [
      "Contact ABS with your 12th Science marks.",
      "Free counselling on recognised DMLT institutes.",
      "We help with the form and documents.",
      "Confirm your seat and fees.",
      "Start your DMLT course in 2026.",
    ],
    feesInfo:
      "DMLT fees vary by institute. We give you an honest fee range during counselling. (Confirm exact fees with our counsellor.)",
    feesRange: "₹20,000 – ₹70,000 per year (approx.)",
    careerScope:
      "After DMLT you can work as a lab technician, pathology assistant, or phlebotomist in hospitals, diagnostic labs and blood banks. Demand is steady and growing across the country.",
    faqs: [
      {
        question: "What is the scope after DMLT?",
        answer:
          "Lab technician jobs in hospitals, pathology labs, blood banks and diagnostic chains — with steady demand.",
      },
      {
        question: "Is DMLT a good paramedical course after 12th?",
        answer: "Yes. It is short, job-focused, and always in demand in healthcare.",
      },
      {
        question: "Is DMLT admission open for 2026?",
        answer: "Yes. Contact ABS to apply for the 2026 batch.",
      },
    ],
    seo: {
      title: "DMLT Admission 2026 in Mumbai | Medical Lab Technology | ABS",
      description:
        "DMLT admission 2026 in Mumbai — eligibility, fees, scope and recognised institutes. Free counselling at 6 ABS branches.",
    },
  },
];
