// Careers after pharmacy — the content behind /careers-after-pharmacy and its
// child pages. Kept as a typed seed (like lib/blog.ts started out) so the pages
// build without a DB; move to MySQL + admin CRUD if Naresh needs to edit these
// himself later.
//
// Salary figures are deliberately broad, labelled indicative, and consistent
// with the ranges already quoted on the D.Pharma landing page. They are
// starting points for a counselling conversation, not promises — every page
// carries the disclaimer to that effect.

export type SalaryBand = { stage: string; range: string };
export type CareerStep = { title: string; body: string };

export type PharmaCareer = {
  slug: string;
  /** Short label for cards, nav and breadcrumbs. */
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** One-line summary for the hub grid. */
  summary: string;
  /** Which qualification opens this door. */
  entryVia: string[];
  /** Opening paragraphs on the detail page. */
  intro: string[];
  whatYouDo: string[];
  salary: SalaryBand[];
  steps: CareerStep[];
  suitsYouIf: string[];
  /** The honest caveat — what nobody tells students about this path. */
  reality: string;
  faqs: { question: string; answer: string }[];
  relatedCourses: { slug: string; label: string }[];
  relatedCareers: string[];
};

export const PHARMA_CAREERS: PharmaCareer[] = [
  {
    slug: "medical-store-owner",
    name: "Medical store owner",
    h1: "How to open your own medical store after pharmacy",
    metaTitle: "How to Open a Medical Store After D.Pharma | Drug Licence & Cost | ABS",
    metaDescription:
      "Open your own medical store after D.Pharma or B.Pharm — pharmacist registration, the Maharashtra FDA drug licence, what it costs and what you can earn. Free guidance from ABS, Mumbai.",
    summary:
      "The reason most students pick pharmacy. Register as a pharmacist, get a drug licence, and run a business you own.",
    entryVia: ["D.Pharma", "B.Pharma"],
    intro: [
      "This is the path students underestimate. A pharmacy qualification is not only a job ticket — it is one of the few courses after 12th that lets you legally own and run a business, because a retail drug licence can only be granted where a registered pharmacist is present.",
      "That single legal requirement is what protects the profession. A shop cannot dispense medicines without a registered pharmacist, and you become one two years after 12th with a D.Pharma.",
    ],
    whatYouDo: [
      "Dispense prescription and over-the-counter medicines, and counsel customers on how to take them",
      "Maintain the purchase, sale and Schedule H1 registers the FDA inspects",
      "Manage stock, expiry, cold-chain items and supplier credit",
      "Build the repeat customers — chronic patients on monthly medication are the backbone of a store's revenue",
    ],
    salary: [
      { stage: "Working in someone else's store first", range: "₹10,000 – ₹18,000 a month" },
      { stage: "Renting out your registration (not advised)", range: "₹5,000 – ₹15,000 a month" },
      { stage: "Your own store, once established", range: "Depends entirely on location and footfall" },
    ],
    steps: [
      {
        title: "Finish D.Pharma or B.Pharm",
        body: "D.Pharma is two years plus 500 hours of practical training. B.Pharm is four years. Either qualifies you for registration.",
      },
      {
        title: "Register with the State Pharmacy Council",
        body: "Apply to the Maharashtra State Pharmacy Council for registration under the Pharmacy Act, 1948. Your registration number is what a drug licence is issued against.",
      },
      {
        title: "Find premises that meet the rules",
        body: "The Drugs and Cosmetics Rules set a minimum area and require refrigeration and proper storage. Get this right before you sign a rent agreement — a wrong premise is an expensive mistake.",
      },
      {
        title: "Apply for the retail drug licence",
        body: "Applications go to the FDA Maharashtra through its online portal, with your registration certificate, premises documents and the prescribed fee. An inspection follows.",
      },
      {
        title: "Open, and build the repeat base",
        body: "Stock, suppliers and credit terms come next. Most new stores take time to become profitable — plan working capital for that period, not just for the fit-out.",
      },
    ],
    suitsYouIf: [
      "You want to own something rather than be employed",
      "You are comfortable with customers, cash and stock, day after day",
      "Your family can support the initial investment, or you can raise it",
      "You are patient — a store builds slowly through trust, not advertising",
    ],
    reality:
      "Renting out your pharmacist registration to a store you do not actually work at is common and is a bad idea — it puts your registration at risk and leaves you responsible for a shop you do not control. Also be realistic about capital: premises deposit, stock and licence costs are substantial, and online pharmacies have squeezed margins on non-prescription items. The stores that do well are the ones near a clinic or hospital with steady chronic-medication customers.",
    faqs: [
      {
        question: "Can I open a medical store straight after D.Pharma?",
        answer:
          "You can, once you are registered with the State Pharmacy Council and hold a retail drug licence for the premises. Many students work in an established store for a year or two first — it is the cheapest way to learn stock, suppliers and billing before risking your own capital.",
      },
      {
        question: "Do I need B.Pharm to own a medical store?",
        answer:
          "No. D.Pharma is enough to register as a pharmacist and hold a drug licence. B.Pharm opens more industry and higher-study doors, but for retail pharmacy the diploma is the qualifying route.",
      },
      {
        question: "How much money do I need to start?",
        answer:
          "It varies enormously with location — the premises deposit is usually the single biggest number, followed by opening stock. This is exactly the kind of planning we go through with families at the branch, with real figures for the area you are looking at.",
      },
    ],
    relatedCourses: [
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
    ],
    relatedCareers: ["hospital-pharmacist", "government-pharmacist"],
  },

  {
    slug: "hospital-pharmacist",
    name: "Hospital pharmacist",
    h1: "Hospital pharmacist: the job, the pay and how to get in",
    metaTitle: "Hospital Pharmacist Career After D.Pharma & B.Pharm | Salary | ABS",
    metaDescription:
      "What a hospital pharmacist actually does, what private and trust hospitals pay in Mumbai, and how to get hired after D.Pharma or B.Pharm. Free career guidance from ABS.",
    summary:
      "Steady clinical work inside a hospital pharmacy — the most common first job for a fresh pharmacy graduate.",
    entryVia: ["D.Pharma", "B.Pharma"],
    intro: [
      "Hospital pharmacy is where most pharmacy graduates in Mumbai start. You work inside the hospital's own pharmacy, dispensing against inpatient and outpatient prescriptions, and you are part of the clinical chain rather than a retail counter.",
      "The work is more structured than retail — fixed shifts, a defined formulary, and colleagues to learn from. It is the best place to build clinical confidence in your first two years.",
    ],
    whatYouDo: [
      "Dispense against inpatient charts and outpatient prescriptions, checking dose and interactions",
      "Manage ward indents, emergency drug trays and narcotic registers",
      "Handle procurement, expiry rotation and cold-chain storage for the hospital's stock",
      "Counsel patients on discharge medication — which is where the clinical part of the job really lives",
    ],
    salary: [
      { stage: "Fresher, small private hospital", range: "₹12,000 – ₹20,000 a month" },
      { stage: "2–5 years, larger hospital", range: "₹20,000 – ₹35,000 a month" },
      { stage: "Senior / chief pharmacist", range: "₹35,000 – ₹60,000 a month" },
    ],
    steps: [
      {
        title: "Complete D.Pharma or B.Pharm",
        body: "Both are accepted for hospital pharmacy roles. B.Pharm tends to reach the senior and chief pharmacist grades faster.",
      },
      {
        title: "Register as a pharmacist",
        body: "Hospitals require State Pharmacy Council registration before you can dispense.",
      },
      {
        title: "Use your internship well",
        body: "The 500 hours of practical training in D.Pharma is your audition. Students who do it seriously at a hospital are very often offered the first job there.",
      },
      {
        title: "Apply widely across hospital types",
        body: "Corporate chains, trust hospitals, nursing homes and day-care centres all employ pharmacists, and they pay and train very differently. Apply across all of them.",
      },
    ],
    suitsYouIf: [
      "You want clinical work without the risk of running a business",
      "You are careful and methodical — dispensing errors matter here",
      "You can work shifts, including nights in larger hospitals",
      "You want a base of experience before opening your own store later",
    ],
    reality:
      "Starting salaries in small private hospitals are modest, and the first year can feel like stock-keeping more than clinical practice. It gets better with responsibility. Treat the first two years as paid training — the experience is what makes you employable at a larger hospital, or credible when you open your own store.",
    faqs: [
      {
        question: "Is D.Pharma enough for a hospital pharmacist job?",
        answer:
          "Yes, for most dispensing roles. Larger corporate hospitals sometimes prefer B.Pharm for senior positions, and clinical-pharmacist roles usually expect Pharm.D or an M.Pharm.",
      },
      {
        question: "Do hospital pharmacists work night shifts?",
        answer:
          "In any hospital with a 24-hour pharmacy, yes — pharmacy staff rotate through night duty. Smaller nursing homes and day-care centres often run day shifts only.",
      },
    ],
    relatedCourses: [
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
    ],
    relatedCareers: ["government-pharmacist", "medical-store-owner"],
  },

  {
    slug: "government-pharmacist",
    name: "Government pharmacist",
    h1: "Government pharmacist jobs after pharmacy in Maharashtra",
    metaTitle: "Government Pharmacist Jobs After D.Pharma | Eligibility & Pay | ABS",
    metaDescription:
      "Government pharmacist posts in Maharashtra — who is eligible after D.Pharma or B.Pharm, where the vacancies come from, and what the pay and job security actually look like.",
    summary:
      "Municipal, state health services, ESIC and railways. Lower ceiling than industry, far higher security.",
    entryVia: ["D.Pharma", "B.Pharma"],
    intro: [
      "For a lot of families this is the goal: a government pharmacist post with a pay scale, allowances and a pension-track job. The qualification bar is a pharmacy diploma or degree plus State Pharmacy Council registration — the hard part is the competition, not the eligibility.",
      "Posts appear across municipal corporations, the state public health department, ESIC, railways, defence establishments and central health services. Each recruits on its own calendar.",
    ],
    whatYouDo: [
      "Dispense at a government hospital, dispensary, primary health centre or municipal clinic",
      "Maintain government stock registers and indent supplies through official channels",
      "Support public health programmes — immunisation drives, TB and other national programmes",
      "Work to fixed rules and documentation, which is the character of the job",
    ],
    salary: [
      { stage: "Entry pay scale, state / municipal", range: "₹18,000 – ₹28,000 a month" },
      { stage: "With experience and increments", range: "₹35,000 – ₹70,000 a month" },
      { stage: "Beyond salary", range: "Allowances, job security and pension benefits per the applicable rules" },
    ],
    steps: [
      {
        title: "Complete D.Pharma or B.Pharm",
        body: "Most government pharmacist posts accept the diploma. Read each advertisement — the qualification clause is specific and is the first thing that gets applications rejected.",
      },
      {
        title: "Register with the State Pharmacy Council",
        body: "A valid registration number is almost always mandatory at the time of application.",
      },
      {
        title: "Track the recruitment boards",
        body: "MPSC, municipal corporations, ZP recruitment, ESIC, RRB and central health services all advertise separately. There is no single portal — you have to watch several.",
      },
      {
        title: "Prepare for the written exam",
        body: "Selection is usually a written test on pharmacy subjects plus general aptitude, sometimes with a merit component from your qualifying marks.",
      },
      {
        title: "Keep your documents ready",
        body: "Domicile, caste certificate and validity, and your registration certificate. Vacancy windows are short and applications close before people finish arranging papers.",
      },
    ],
    suitsYouIf: [
      "Job security matters more to you than a high ceiling",
      "You are willing to prepare for a competitive written exam",
      "You can accept a posting outside your home city",
      "You are patient — vacancies are irregular and the process is slow",
    ],
    reality:
      "Be clear-eyed about the odds. Vacancies are few relative to the number of pharmacy graduates, cycles can be years apart, and recruitment gets delayed or litigated. Treat a government post as something to prepare for while you work — not as a plan you wait around for. Nobody can promise you a government job, and anyone who does is lying to you.",
    faqs: [
      {
        question: "Can I get a government pharmacist job with D.Pharma?",
        answer:
          "Yes — most pharmacist posts in state and municipal services accept a Diploma in Pharmacy with valid registration. Always read the specific advertisement, since a few posts ask for B.Pharm.",
      },
      {
        question: "Is there an age limit?",
        answer:
          "Each recruiting body sets its own age limits with the usual category relaxations. It is stated in the advertisement, and it changes between recruitments.",
      },
    ],
    relatedCourses: [
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
    ],
    relatedCareers: ["hospital-pharmacist", "pharma-industry"],
  },

  {
    slug: "pharma-industry",
    name: "Pharma industry",
    h1: "Pharma industry jobs: production, QC and quality assurance",
    metaTitle: "Pharma Industry Jobs After B.Pharm & D.Pharma | QC, QA, Production | ABS",
    metaDescription:
      "Production, quality control, quality assurance and packaging roles in the pharmaceutical industry after B.Pharm or D.Pharma — what each department does, and what they pay.",
    summary:
      "Manufacturing, QC and QA in a pharma plant. The highest ceiling of the pharmacy paths, and the most B.Pharm-weighted.",
    entryVia: ["B.Pharma", "D.Pharma", "M.Pharm"],
    intro: [
      "Maharashtra and Gujarat hold a large share of India's pharmaceutical manufacturing, and the plants around the Mumbai belt hire steadily. This is the path with the highest long-term ceiling — and the one where a B.Pharm matters most.",
      "Industry work is departmental. Which department you enter in your first year tends to shape your whole career, so it is worth understanding the difference before you apply.",
    ],
    whatYouDo: [
      "Production — run and document manufacturing batches to GMP standards",
      "Quality control (QC) — test raw materials and finished product in the lab, using HPLC and other instruments",
      "Quality assurance (QA) — own the documentation, deviations, audits and regulatory compliance",
      "Packaging, warehousing and stores — material handling under GMP conditions",
      "Regulatory affairs — dossiers and filings, usually after a few years or a postgraduate qualification",
    ],
    salary: [
      { stage: "Fresher, D.Pharma (production / packing / stores)", range: "₹12,000 – ₹20,000 a month" },
      { stage: "Fresher, B.Pharm (QC / QA / production)", range: "₹18,000 – ₹30,000 a month" },
      { stage: "3–5 years, executive level", range: "₹35,000 – ₹70,000 a month" },
      { stage: "Senior / managerial, QA and regulatory", range: "Materially higher, and the reason people stay" },
    ],
    steps: [
      {
        title: "B.Pharm is the stronger entry",
        body: "D.Pharma gets you into production, packaging and stores. B.Pharm opens QC, QA and the graded career ladder above them. If industry is the goal, plan for the degree.",
      },
      {
        title: "Learn the instruments",
        body: "For QC, hands-on HPLC, UV and dissolution experience is what gets shortlisted. A short instrumentation course after the degree is often worth more than the degree marks.",
      },
      {
        title: "Understand GMP and documentation",
        body: "Industry runs on documentation. Candidates who can talk about GMP, SOPs and deviation handling interview far better than those who cannot.",
      },
      {
        title: "Start where the plants are",
        body: "Be willing to work in the industrial belts — Tarapur, Palghar, Ambernath, Baddi or Gujarat. Many careers begin with a few years outside the city.",
      },
    ],
    suitsYouIf: [
      "You want the highest long-term earning potential of the pharmacy paths",
      "You are precise and comfortable with heavy documentation",
      "You will relocate to where the plants are, at least early on",
      "You are planning B.Pharm rather than stopping at the diploma",
    ],
    reality:
      "Two honest caveats. First, D.Pharma alone caps you fairly low in industry — the ladder above production and stores generally wants a degree. Second, plants are rarely in the middle of the city, and shift work is normal. The trade-off is a career with real progression, which retail and hospital roles do not offer in the same way.",
    faqs: [
      {
        question: "Can I join the pharma industry after D.Pharma?",
        answer:
          "Yes, usually in production, packaging, stores or warehousing. QC and QA roles generally ask for B.Pharm or M.Pharm. Many students join after the diploma and do B.Pharm through lateral entry alongside.",
      },
      {
        question: "Which pays more — QC or QA?",
        answer:
          "They start close. QA tends to pull ahead over time because it leads towards regulatory affairs and compliance leadership, which are the better-paid senior roles.",
      },
    ],
    relatedCourses: [
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
    ],
    relatedCareers: ["higher-studies", "medical-representative"],
  },

  {
    slug: "medical-representative",
    name: "Medical representative",
    h1: "Medical representative: what the job is really like",
    metaTitle: "Medical Representative Job After Pharmacy | Salary & Reality | ABS",
    metaDescription:
      "Becoming a medical representative after D.Pharma or B.Pharm — what the job involves day to day, how MR pay and incentives work, and who it actually suits.",
    summary:
      "Field sales for a pharma company. Fastest to get hired into, highest variable pay, hardest to sustain.",
    entryVia: ["D.Pharma", "B.Pharma", "B.Sc"],
    intro: [
      "Medical representative is the easiest pharma job to get and the one students most often misunderstand. You are the company's face to doctors and chemists in an assigned territory — it is a sales job that requires product knowledge, not a clinical job with some sales attached.",
      "It rewards people who are genuinely comfortable meeting strangers all day. For them the money comes faster than any other pharmacy path. For everyone else it is a grind.",
    ],
    whatYouDo: [
      "Meet a daily call list of doctors to detail your company's products",
      "Cover chemists and stockists in your territory, and track secondary sales",
      "Hit monthly targets — this is the number your job is measured on",
      "File daily call reports, and travel constantly within your territory",
    ],
    salary: [
      { stage: "Fresher, fixed component", range: "₹15,000 – ₹25,000 a month" },
      { stage: "Incentives on target achievement", range: "Can add substantially — and is not guaranteed" },
      { stage: "Area Sales Manager, after a few years", range: "₹40,000 – ₹80,000 a month plus incentives" },
    ],
    steps: [
      {
        title: "Any pharmacy qualification works",
        body: "D.Pharma, B.Pharm and even B.Sc candidates are hired. Companies care more about communication than about your marksheet.",
      },
      {
        title: "Prepare for a communication-led interview",
        body: "You will be asked to detail a product. Practise explaining something clearly and confidently in two minutes — that is the whole test.",
      },
      {
        title: "Choose the company carefully",
        body: "Large companies train better and pay a steadier fixed component. Small companies pay more variable and expect more. The first choice shapes the next five years.",
      },
      {
        title: "Be ready for the territory",
        body: "You may be assigned outside your city, and a two-wheeler is usually expected.",
      },
    ],
    suitsYouIf: [
      "You genuinely enjoy meeting new people every single day",
      "You can handle targets and rejection without it wearing you down",
      "You want to earn early rather than study longer",
      "You are open to travel and to being posted outside your home town",
    ],
    reality:
      "The attrition rate in this job is high, and it is worth knowing that before you sign. Targets are relentless, incentives quoted at the interview assume you hit them, and the travel is real. People who suit it do very well and move into management quickly. People who do not, leave within a year — so be honest with yourself about which one you are.",
    faqs: [
      {
        question: "Can I become an MR after D.Pharma?",
        answer:
          "Yes. Companies hire D.Pharma, B.Pharm and science graduates as medical representatives. It is one of the quickest routes to a salary after the diploma.",
      },
      {
        question: "Is the incentive part of the salary guaranteed?",
        answer:
          "No. Incentives depend on hitting your targets. When you are quoted a package at the interview, ask specifically what the fixed component is — that is the part you can count on.",
      },
    ],
    relatedCourses: [
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
    ],
    relatedCareers: ["pharma-industry", "hospital-pharmacist"],
  },

  {
    slug: "higher-studies",
    name: "Higher studies",
    h1: "Higher studies after pharmacy: B.Pharm, M.Pharm and Pharm.D",
    metaTitle: "Higher Studies After D.Pharma | B.Pharm Lateral Entry, M.Pharm, Pharm.D | ABS",
    metaDescription:
      "What to study after D.Pharma or B.Pharm — B.Pharm lateral entry to the second year, M.Pharm specialisations, Pharm.D and MBA in pharma management. Free guidance from ABS.",
    summary:
      "The diploma is not a dead end. Lateral entry into B.Pharm's second year, then M.Pharm, Pharm.D or pharma management.",
    entryVia: ["D.Pharma", "B.Pharma"],
    intro: [
      "The single most useful thing to know after D.Pharma: you do not start a degree from year one. Diploma holders enter B.Pharm directly in the second year through DTE's lateral entry process, so the diploma counts rather than being repeated.",
      "That makes a common and sensible plan possible — finish the diploma, start earning, and add the degree while you work.",
    ],
    whatYouDo: [
      "B.Pharm lateral entry — join the second year of the degree directly after D.Pharma, through DTE's separate admission cycle",
      "M.Pharm — two-year postgraduate specialisation in pharmaceutics, pharmacology, pharmaceutical chemistry, quality assurance or pharmacognosy",
      "Pharm.D — a six-year clinical doctorate, or three years post-B.Pharm, aimed at clinical pharmacy and hospital practice",
      "MBA in pharma management — the route into marketing, brand and commercial roles in pharma companies",
      "Short certifications — HPLC and instrumentation, regulatory affairs, clinical research, pharmacovigilance",
    ],
    salary: [
      { stage: "Why it is worth it", range: "The degree unlocks QC, QA and the industry career ladder" },
      { stage: "M.Pharm / regulatory roles", range: "Materially higher than diploma-entry salaries" },
      { stage: "Teaching roles", range: "Generally require a postgraduate qualification" },
    ],
    steps: [
      {
        title: "Decide before your final diploma year",
        body: "Lateral-entry admission runs on its own DTE calendar. Students who decide late miss the window and lose a year for no good reason.",
      },
      {
        title: "Keep your diploma marks up",
        body: "Lateral-entry merit is built on your D.Pharma marks. The second year of the diploma matters more than most students realise.",
      },
      {
        title: "Register for the lateral-entry cycle",
        body: "It is a separate DTE process from first-year B.Pharm admission, with its own dates, documents and option form.",
      },
      {
        title: "Then choose a specialisation deliberately",
        body: "For M.Pharm, pick the specialisation that matches the job you want — quality assurance and pharmaceutics track towards industry, pharmacology towards research.",
      },
    ],
    suitsYouIf: [
      "You want the industry ladder, not just a first job",
      "You are aiming at QC, QA, regulatory affairs or teaching",
      "You can study alongside work, or your family can support two more years",
      "You finished D.Pharma and want the diploma to count rather than restart",
    ],
    reality:
      "A degree is not automatically worth it for everyone. If your goal is your own medical store, D.Pharma plus registration already gets you there, and two more years of fees may be better spent on the shop. Where the degree genuinely pays for itself is industry, government seniority and anything requiring a postgraduate qualification later.",
    faqs: [
      {
        question: "Can I do B.Pharm after D.Pharma?",
        answer:
          "Yes. Diploma holders enter the second year of B.Pharm through DTE's lateral entry process, which runs as a separate admission cycle with its own dates.",
      },
      {
        question: "Is Pharm.D better than B.Pharm?",
        answer:
          "They aim at different careers. Pharm.D is clinical and hospital-facing; B.Pharm followed by M.Pharm is the standard industry route. Neither is better in the abstract — it depends on the job you want.",
      },
      {
        question: "Can I work while doing B.Pharm?",
        answer:
          "Many students do exactly this — work in a store or hospital and complete the degree. It is demanding, but it is the most common way families manage the cost.",
      },
    ],
    relatedCourses: [
      { slug: "b-pharma-admission-2026", label: "B.Pharma admission 2026" },
      { slug: "d-pharma-admission-2026", label: "D.Pharma admission 2026" },
    ],
    relatedCareers: ["pharma-industry", "government-pharmacist"],
  },
];

export function getCareers(): PharmaCareer[] {
  return PHARMA_CAREERS;
}

export function getCareerBySlug(slug: string): PharmaCareer | undefined {
  return PHARMA_CAREERS.find((c) => c.slug === slug);
}

export function getCareerSlugs(): string[] {
  return PHARMA_CAREERS.map((c) => c.slug);
}

export const CAREERS_BASE = "/careers-after-pharmacy";

/** Shown on every careers page — these are counselling starting points, not promises. */
export const SALARY_DISCLAIMER =
  "Salary ranges are indicative figures for Mumbai and the surrounding region, collected from what our students actually report. They vary with employer, location, shift and experience, and they change every year. No consultancy or college can guarantee you a salary or a placement.";
