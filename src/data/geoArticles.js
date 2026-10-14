export const geoArticles = [
  {
    slug: "what-is-geo",
    title: "What is Generative Engine Optimization (GEO)?",
    description:
      "GEO is the practice of structuring content so AI answer engines can find, understand and cite it.",
    answer:
      "Generative Engine Optimization (GEO) is the practice of shaping your content so AI tools like ChatGPT, Gemini and Perplexity can find it, understand it, and cite it in their answers.",
    updated: "2026-10-14",
    sections: [
      {
        heading: "How is GEO different from SEO?",
        body: "SEO aims to rank a link on a results page. GEO aims to get your content quoted inside the answer an AI writes. The goal moves from being clicked to being cited.",
      },
      {
        heading: "Why does GEO matter for students?",
        body: "Students increasingly ask AI tools for study material. Clear, well-structured pages with named sources are far more likely to be used as the basis of those answers.",
      },
      {
        heading: "What are the core GEO practices?",
        body: "Answer the question in the first two sentences. Use question-style headings. Add structured data. Cite sources. Show dates and authors. Make pages readable without JavaScript.",
      },
    ],
  },
  {
    slug: "geo-vs-seo",
    title: "GEO vs SEO: What changes?",
    description: "A side-by-side look at what stays the same and what changes when you optimise for AI answers.",
    answer:
      "SEO and GEO share the same foundation of useful, crawlable content. They differ in the target: SEO competes for a ranked link, GEO competes to be quoted in a generated answer.",
    updated: "2026-10-14",
    sections: [
      {
        heading: "What stays the same?",
        body: "Fast pages, clear titles, descriptive URLs, sitemaps and genuinely helpful content matter for both.",
      },
      {
        heading: "What changes?",
        body: "Direct answers, quotable statements, visible citations and structured data carry more weight, because AI engines extract and summarise passages instead of listing pages.",
      },
    ],
  },
  {
    slug: "structured-data-for-geo",
    title: "How does structured data help GEO?",
    description: "JSON-LD tells machines exactly what a page is, who wrote it and when it was updated.",
    answer:
      "Structured data (JSON-LD using schema.org types) labels your page in a format machines read directly, so AI systems can identify the topic, author, date and question-answer pairs without guessing.",
    updated: "2026-10-14",
    sections: [
      {
        heading: "Which schema types does this site use?",
        body: "Organization and WebSite on the home page, FAQPage on the FAQ, Article on knowledge hub pages, and LearningResource on each sample paper.",
      },
      {
        heading: "Where does the JSON-LD go?",
        body: "Inside a script tag of type application/ld+json in the page head. This site renders it at build time so crawlers see it without running JavaScript.",
      },
    ],
  },
  {
    slug: "llms-txt-and-robots",
    title: "What are llms.txt and AI crawler rules?",
    description: "How robots.txt and llms.txt tell AI crawlers what they may read and where the best content lives.",
    answer:
      "robots.txt says which crawlers may access your site, and llms.txt is a plain-text summary that points AI models to your most important pages.",
    updated: "2026-10-14",
    sections: [
      {
        heading: "Which AI crawlers should be allowed?",
        body: "Common ones include GPTBot, ClaudeBot, PerplexityBot and Google-Extended. This site allows all of them.",
      },
      {
        heading: "What goes in llms.txt?",
        body: "A short description of the site and a list of key pages with one-line summaries, written in Markdown.",
      },
    ],
  },
];

export const faqs = [
  {
    q: "What is Syllabus2Paper?",
    a: "Syllabus2Paper turns a list of syllabus topics into a structured sample question paper with sections, marks and question types, ready to print.",
  },
  {
    q: "Is Syllabus2Paper free to use?",
    a: "Yes. The generator and the sample-paper library are free and need no sign-up.",
  },
  {
    q: "What is GEO?",
    a: "Generative Engine Optimization is the practice of making content easy for AI answer engines to find, understand and cite.",
  },
  {
    q: "Who is this for?",
    a: "Students preparing for exams and teachers who need quick practice papers.",
  },
];
