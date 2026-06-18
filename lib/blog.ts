import type { BlogPost } from "./types";

// ---------------------------------------------------------------------------
// Blog content. Posts are stored with ready-to-render HTML bodies so the full
// article ships inside the server-rendered page (best for Google + AI/LLM
// crawlers — the content is in the HTML, not built by client-side JS).
//
// Posts form a topical cluster: each informational article links down into the
// money pages and course pages, building topical authority around
// "<course> admission in Mumbai 2026".
//
// Keep this as the single source of truth for now (mirrors lib/fallback.ts).
// A `blogPosts` DB table can be layered in later behind the same getters.
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  {
    slug: "d-pharma-admission-mumbai-2026",
    title: "D Pharma Admission in Mumbai 2026: Fees, Eligibility, Process & Best Colleges",
    description:
      "A complete 2026 guide to D Pharma (Diploma in Pharmacy) admission in Mumbai — eligibility, fees, documents, the step-by-step process and how to pick an approved college.",
    excerpt:
      "Everything you need to know about getting D Pharma admission in Mumbai for the 2026 batch — eligibility, fees, documents and the full admission process, explained simply.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-18",
    author: "ABS Admissions Counselling Team",
    tags: ["D.Pharm", "Pharmacy", "Admission 2026"],
    relatedCourses: ["d-pharma-admission-2026", "b-pharma-admission-2026"],
    relatedPosts: ["d-pharm-vs-b-pharm"],
    bodyHtml: `
<p><strong>D Pharma (Diploma in Pharmacy)</strong> is one of the most popular career courses after 12th in Mumbai — it is a 2-year course, you do <strong>not</strong> need NEET, and it leads to a stable healthcare career as a registered pharmacist. This guide explains exactly how D Pharma admission in Mumbai works for the 2026 batch.</p>

<h2>What is D Pharma?</h2>
<p>D.Pharm stands for Diploma in Pharmacy. It is a 2-year diploma you can join right after 12th. After D.Pharm and registration with the State Pharmacy Council, you can work as a pharmacist, open your own medical store, or work in hospitals and pharma companies. You can also continue to B.Pharm later.</p>

<h2>D Pharma eligibility in Mumbai (2026)</h2>
<ul>
  <li>Passed 12th (HSC) with Science — Physics, Chemistry and Biology or Maths.</li>
  <li>Minimum marks vary by college (often around 35–50%).</li>
  <li>No NEET required for D.Pharm.</li>
</ul>

<h2>D Pharma fees in Mumbai</h2>
<p>D Pharma fees in Mumbai vary by college and quota. As a rough guide, fees are around <strong>₹15,000 – ₹1,00,000 per year</strong>. The exact figure depends on whether the college is government, aided or private. We share the real, current 2026 fees during free counselling — with no hidden charges.</p>

<h2>Documents required</h2>
<ul>
  <li>10th & 12th marksheets and passing certificates</li>
  <li>School leaving / transfer certificate</li>
  <li>Aadhaar card and passport-size photos</li>
  <li>Caste / domicile certificate (if applicable)</li>
</ul>

<h2>D Pharma admission process 2026 — step by step</h2>
<ol>
  <li>Talk to a counsellor with your 12th marks and preferred area.</li>
  <li>Shortlist approved (PCI / MSBTE) colleges that fit your marks and budget.</li>
  <li>Fill the application form and submit your documents.</li>
  <li>Confirm your seat and join the 2026 batch.</li>
</ol>

<h2>Which are the best D Pharma colleges in Mumbai?</h2>
<p>There are many PCI- and MSBTE-approved D Pharma colleges across the western, central and harbour suburbs of Mumbai. The "best" college for you depends on your marks, budget and how far you can travel. During free counselling, ABS shortlists the right approved colleges near you.</p>

<p>Get local guidance for D Pharma admission in <a href="/d-pharma-admission-thane">Thane</a>, <a href="/d-pharma-admission-kurla">Kurla</a>, <a href="/d-pharma-admission-malad">Malad</a>, <a href="/d-pharma-admission-andheri">Andheri</a>, <a href="/d-pharma-admission-bhayandar">Bhayandar</a> or <a href="/d-pharma-admission-nalasopara">Nalasopara</a>.</p>

<blockquote>Ready to start? Read the full <a href="/d-pharma-admission-2026">D.Pharm admission guide</a> or contact ABS for free counselling.</blockquote>
`,
    faqs: [
      {
        question: "Is NEET required for D Pharma admission in Mumbai?",
        answer:
          "No. D.Pharm (Diploma in Pharmacy) does not require NEET. You can apply after 12th Science based on your HSC marks.",
      },
      {
        question: "How long is the D Pharma course?",
        answer: "D.Pharm is a 2-year diploma course you can do right after 12th.",
      },
      {
        question: "What is the D Pharma fees in Mumbai for 2026?",
        answer:
          "D Pharma fees in Mumbai are roughly ₹15,000–₹1,00,000 per year depending on the college and quota. ABS shares the exact, current fees during free counselling.",
      },
    ],
  },
  {
    slug: "d-pharm-vs-b-pharm",
    title: "D.Pharm vs B.Pharm: Which Should You Choose After 12th? (2026)",
    description:
      "D.Pharm or B.Pharm after 12th? Compare duration, fees, career scope and salary to choose the right pharmacy course in Mumbai for 2026.",
    excerpt:
      "Confused between D.Pharm and B.Pharm after 12th? Here is a simple, honest comparison of duration, fees, scope and salary to help you decide.",
    datePublished: "2026-06-12",
    dateModified: "2026-06-18",
    author: "ABS Admissions Counselling Team",
    tags: ["D.Pharm", "B.Pharm", "Career Guidance"],
    relatedCourses: ["d-pharma-admission-2026", "b-pharma-admission-2026"],
    relatedPosts: ["d-pharma-admission-mumbai-2026"],
    bodyHtml: `
<p>Both <strong>D.Pharm</strong> and <strong>B.Pharm</strong> lead to a career in pharmacy — but they differ in duration, depth, cost and long-term growth. Here is a simple comparison to help you choose the right one after 12th.</p>

<h2>Quick comparison</h2>
<table>
  <thead>
    <tr><th>Point</th><th>D.Pharm</th><th>B.Pharm</th></tr>
  </thead>
  <tbody>
    <tr><td>Duration</td><td>2 years</td><td>4 years</td></tr>
    <tr><td>Level</td><td>Diploma</td><td>Degree</td></tr>
    <tr><td>Approx. fees / year</td><td>₹15,000 – ₹1,00,000</td><td>₹40,000 – ₹1,50,000</td></tr>
    <tr><td>Best for</td><td>Fast start, own medical store</td><td>Higher posts, industry & research</td></tr>
    <tr><td>Further study</td><td>Can do B.Pharm later</td><td>Can do M.Pharm / MBA</td></tr>
  </tbody>
</table>

<h2>Choose D.Pharm if…</h2>
<ul>
  <li>You want to start working sooner (2 years).</li>
  <li>You plan to open your own medical store.</li>
  <li>You want a lower upfront cost.</li>
</ul>

<h2>Choose B.Pharm if…</h2>
<ul>
  <li>You want a full degree with better long-term salary growth.</li>
  <li>You are interested in the pharma industry, marketing or research.</li>
  <li>You may want to study M.Pharm or go abroad later.</li>
</ul>

<h2>Can I do B.Pharm after D.Pharm?</h2>
<p>Yes. Many students do D.Pharm first and then move to B.Pharm (often via lateral entry). It is a flexible path — you start earning earlier and can upgrade your qualification later.</p>

<p>Explore the full guides: <a href="/d-pharma-admission-2026">D.Pharm admission 2026</a> and <a href="/b-pharma-admission-2026">B.Pharm admission 2026</a>. Still unsure? ABS offers free counselling to help you decide based on your marks and goals.</p>
`,
    faqs: [
      {
        question: "Which is better, D.Pharm or B.Pharm?",
        answer:
          "Neither is 'better' overall. D.Pharm is faster (2 years) and cheaper and is great for opening a medical store; B.Pharm is a 4-year degree with stronger long-term growth in industry and research. The right choice depends on your goals and budget.",
      },
      {
        question: "Can I do B.Pharm after completing D.Pharm?",
        answer:
          "Yes. After D.Pharm you can move to B.Pharm, often through lateral entry, so you can start working earlier and upgrade your qualification later.",
      },
    ],
  },
  {
    slug: "nursing-courses-after-12th-mumbai",
    title: "Nursing Courses After 12th in Mumbai: GNM vs B.Sc Nursing vs ANM (2026)",
    description:
      "Compare GNM, B.Sc Nursing and ANM nursing courses after 12th in Mumbai — duration, eligibility, fees and scope — to choose the right nursing path for 2026.",
    excerpt:
      "Want to become a nurse in Mumbai? Compare GNM, B.Sc Nursing and ANM by duration, eligibility, fees and career scope to choose the right course.",
    datePublished: "2026-06-14",
    dateModified: "2026-06-18",
    author: "ABS Admissions Counselling Team",
    tags: ["Nursing", "GNM", "B.Sc Nursing", "ANM"],
    relatedCourses: [
      "gnm-nursing-admission-2026",
      "bsc-nursing-admission-2026",
      "anm-nursing-admission-2026",
    ],
    relatedPosts: ["career-after-dmlt"],
    bodyHtml: `
<p>Nursing is one of the most secure and respected careers, with strong demand in India and abroad. After 12th, Mumbai students usually choose between three nursing courses: <strong>GNM</strong>, <strong>B.Sc Nursing</strong> and <strong>ANM</strong>. Here is how they compare.</p>

<h2>Quick comparison</h2>
<table>
  <thead>
    <tr><th>Course</th><th>Duration</th><th>Level</th><th>Best for</th></tr>
  </thead>
  <tbody>
    <tr><td>ANM</td><td>2 years</td><td>Certificate / diploma</td><td>Fastest start, community health</td></tr>
    <tr><td>GNM</td><td>3 years (+ internship)</td><td>Diploma</td><td>Staff nurse in hospitals</td></tr>
    <tr><td>B.Sc Nursing</td><td>4 years</td><td>Degree</td><td>Best long-term & abroad careers</td></tr>
  </tbody>
</table>

<h2>ANM — the fastest start</h2>
<p>ANM (Auxiliary Nurse Midwifery) is a short 2-year course. It is the quickest way to start working in community and rural healthcare, and you can upgrade to GNM later. See <a href="/anm-nursing-admission-2026">ANM admission 2026</a>.</p>

<h2>GNM — the popular hospital route</h2>
<p>GNM (General Nursing and Midwifery) is a 3-year diploma (plus a 6-month internship). It trains you to work as a staff nurse in hospitals and clinics. See <a href="/gnm-nursing-admission-2026">GNM admission 2026</a>.</p>

<h2>B.Sc Nursing — the best long-term option</h2>
<p>B.Sc Nursing is a full 4-year degree. It opens the best nursing careers in India and abroad (the Gulf, UK, Australia), higher posts and better salary. See <a href="/bsc-nursing-admission-2026">B.Sc Nursing admission 2026</a>.</p>

<h2>Which nursing course should you choose?</h2>
<ul>
  <li>Want to start earning quickly? Consider <strong>ANM</strong>.</li>
  <li>Want a solid hospital nursing job? Consider <strong>GNM</strong>.</li>
  <li>Want the best long-term and abroad scope? Choose <strong>B.Sc Nursing</strong>.</li>
</ul>

<p>ABS offers free counselling across Mumbai to help you pick the right nursing course for your marks and goals.</p>
`,
    faqs: [
      {
        question: "Which nursing course is best after 12th?",
        answer:
          "B.Sc Nursing offers the best long-term and abroad scope (4-year degree). GNM (3 years) is a popular route to a hospital staff-nurse job, and ANM (2 years) is the fastest start. The best choice depends on your goals, time and budget.",
      },
      {
        question: "Can boys take admission in nursing courses?",
        answer:
          "Yes. Male students can join nursing courses such as GNM and B.Sc Nursing and have strong career options in hospitals and abroad.",
      },
    ],
  },
  {
    slug: "career-after-dmlt",
    title: "Career After DMLT: Jobs, Salary & Scope in Mumbai (2026)",
    description:
      "What can you do after DMLT? Explore lab technician jobs, salary, and career scope after a Diploma in Medical Lab Technology in Mumbai for 2026.",
    excerpt:
      "DMLT is one of the fastest-growing paramedical courses. Here are the jobs, salary and career scope you can expect after DMLT in Mumbai.",
    datePublished: "2026-06-16",
    dateModified: "2026-06-18",
    author: "ABS Admissions Counselling Team",
    tags: ["DMLT", "Paramedical", "Career Guidance"],
    relatedCourses: ["dmlt-admission-2026"],
    relatedPosts: ["nursing-courses-after-12th-mumbai"],
    bodyHtml: `
<p><strong>DMLT (Diploma in Medical Laboratory Technology)</strong> trains you to perform and read medical lab tests — blood tests, pathology and more. With diagnostics growing fast, lab technicians are in steady demand across Mumbai.</p>

<h2>What jobs can you get after DMLT?</h2>
<ul>
  <li>Medical lab technician</li>
  <li>Pathology lab assistant</li>
  <li>Phlebotomist (blood sample collection)</li>
  <li>Lab roles in hospitals, diagnostic labs and blood banks</li>
</ul>

<h2>DMLT salary in Mumbai</h2>
<p>Starting salaries for lab technicians usually begin around ₹12,000–₹20,000/month and grow with experience and specialisation. Working in larger hospitals and reputed diagnostic chains generally pays more.</p>

<h2>Where do DMLT professionals work?</h2>
<ul>
  <li>Hospitals and nursing homes</li>
  <li>Diagnostic and pathology labs</li>
  <li>Blood banks</li>
  <li>Research and government health centres</li>
</ul>

<h2>Is DMLT a good career?</h2>
<p>Yes — it is a short, practical, job-oriented paramedical course with steady demand. It is a strong option if you want to enter healthcare quickly without a long degree.</p>

<p>Learn more on the <a href="/dmlt-admission-2026">DMLT admission 2026</a> page, or compare it with <a href="/nursing-courses-after-12th-mumbai">nursing courses after 12th</a>. ABS offers free counselling to help you choose.</p>
`,
    faqs: [
      {
        question: "Is DMLT a good career option?",
        answer:
          "Yes. DMLT is a short, job-oriented paramedical course with steady demand in hospitals and diagnostic labs, making it a good way to enter healthcare quickly.",
      },
      {
        question: "What is the salary after DMLT in Mumbai?",
        answer:
          "Lab technician salaries after DMLT typically start around ₹12,000–₹20,000 per month and grow with experience and the size of the hospital or lab.",
      },
    ],
  },
];

// Sorted newest-first for listings.
export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
