import type { ComponentType, ReactNode } from "react";
import type { IconBaseProps } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  SiClaude,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMdx,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

export type IconType = ComponentType<IconBaseProps>;

export const site = {
  name: "Aaquib Ali",
  handle: "aaquibali",
  location: "Manas, Kyrgyzstan",
  timeZone: "Asia/Bishkek",
  coords: { lat: 40.945, lng: 72.9931 },
  email: "imaaquibali@gmail.com",
  resumeUrl:
    "https://drive.google.com/file/d/1OCadGX_mn3dTkS7x58cs27twIOzd92cD/view?usp=sharing",
  githubUser: "aliaaquib",
  counterNamespace: "aaquibali",
  mascot: {
    directions: "/mascots/aaquib-directions.webp",
    reactions: "/mascots/aaquib-reactions.webp",
    label: "Aaquib",
  },
};

export const roles = ["Teacher", "Builder", "Writer", "AI Explainer"];

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
);

export const aboutParagraphs: ReactNode[] = [
  <>
    I'm Aaquib Ali, a <B>computer science teacher</B> and builder in Manas, Kyrgyzstan. I spend
    my days turning <B>Recursion</B>, <B>Big-O</B> and <B>how AI actually works</B> into things my
    students find obvious.
  </>,
  <>
    I take ideas all the way to <B>working products</B> — lately <B>Clario</B>, an AI research
    agent, and <B>The Weekly Roundup</B>, an AI newsletter. I'm also building{" "}
    <B>Thread Academy</B>, and writing a book of raw thoughts, <B>pata hai aaj kya hua</B>. Away
    from the classroom, I write the occasional poem.
  </>,
];

export const techStack: { name: string; Icon: IconType; color: string }[] = [
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "MDX", Icon: SiMdx, color: "#1B1F24" },
  { name: "OpenAI", Icon: SiOpenai, color: "#000000" },
  { name: "Claude", Icon: SiClaude, color: "#D97757" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Vercel", Icon: SiVercel, color: "#000000" },
];

export const freelanceText =
  "Want a CS concept explained, a lesson built, or an idea turned into a working product? You can usually find me teaching, building, or writing — usually all three.";

export const experience = [
  {
    id: 1,
    company: "“SAPAT” International Educational Institution",
    logo: "/sapat-logo.png",
    location: "Manas",
    role: "Computer Science Teacher",
    period: "2023 — Present",
    description:
      "Teaching Cambridge IGCSE Computer Science and ICT with inquiry-based, project-based, and student-centred learning — developing computational thinking, problem-solving, and digital literacy.",
    responsibilities: [
      "Deliver engaging Cambridge IGCSE Computer Science and ICT lessons using inquiry-based, project-based, and student-centred learning strategies to develop computational thinking, problem-solving, and digital literacy.",
      "Plan and deliver schemes of work, lesson plans, assessments, and learning resources aligned with Cambridge International curriculum standards and learning objectives.",
      "Integrate Python programming, web development, artificial intelligence tools, and educational technology into classroom instruction to prepare students with future-ready digital skills.",
      "Differentiate instruction to meet diverse learning needs by implementing targeted teaching strategies, scaffolding, and individualized support that enable every learner to achieve their potential.",
      "Monitor student progress using Assessment for Learning (AfL), formative and summative assessments, providing timely feedback and intervention to improve academic performance.",
      "Foster an inclusive, positive, and well-managed classroom environment that promotes safeguarding, student wellbeing, collaboration, creativity, and responsible digital citizenship.",
      "Organize coding activities, STEM projects, and technology-based learning experiences that encourage innovation, teamwork, and real-world problem-solving.",
      "Collaborate with teachers, school leadership, and parents to support curriculum development, student achievement, and whole-school technology initiatives while contributing to continuous school improvement.",
    ],
    tools: ["Cambridge IGCSE", "Python", "Web Development", "AI Tools", "EdTech"],
  },
];

export const socials: { name: string; Icon: IconType; url: string }[] = [
  { name: "GitHub", Icon: FaGithub, url: "https://github.com/aliaaquib" },
  { name: "X (Twitter)", Icon: FaXTwitter, url: "https://x.com/imaaquibali" },
  { name: "LinkedIn", Icon: FaLinkedin, url: "https://www.linkedin.com/in/aliaaquib" },
  { name: "Email", Icon: FaEnvelope, url: "mailto:imaaquibali@gmail.com" },
];

export type CaseStudy = {
  role: string;
  timeline: string;
  overview: string;
  problem: string;
  goals: string[];
  process: { title: string; body: string }[];
  solution: { title: string; body: string }[];
  outcome: string;
};

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image?: string;
  liveUrl?: string;
  status: "live" | "building";
  stat?: string;
  category: string[];
  tech: string[];
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    id: "thread-academy",
    title: "Thread Academy",
    tagline: "A free learning platform covering the full school curriculum.",
    description:
      "A free learning platform covering the full school curriculum — every chapter reads like a textbook page. Three curricula, one chapter library, zero servers.",
    image: "/images/work/thread-academy.png",
    liveUrl: "https://threadacademy.aaquibali.com/",
    status: "live",
    stat: "3 curricula",
    category: ["Education", "Product"],
    tech: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    caseStudy: {
      role: "Design, content and engineering",
      timeline: "Ongoing",
      overview:
        "Thread Academy is a free learning platform covering the full school curriculum — Cambridge, American and IB — where every chapter reads like a textbook page.",
      problem:
        "Each curriculum slices subjects and levels differently. Writing separate chapters for each one means three copies of the same lesson that slowly drift apart.",
      goals: [
        "Write every chapter once and reuse it across all three curricula",
        "Keep pages fast on weak connections",
        "Let one person maintain the whole library without it going stale",
      ],
      process: [
        { title: "Curriculum maps", body: "One map per curriculum — Cambridge (IGCSE, A-Level), American (K-12) and IB (MYP, DP) — each with its own level order." },
        { title: "Chapter library", body: "A single source of truth: MDX chapters with prose and components, written once and used three times." },
        { title: "Build", body: "Static export pre-renders every page at build time. No runtime server." },
        { title: "Pages", body: "Thousands of CDN-cached static pages that cost almost nothing to serve." },
      ],
      solution: [
        { title: "Fix once, fixed everywhere", body: "Curriculum maps point at shared chapters, so a correction lands in every curriculum at once." },
        { title: "No CMS, no database", body: "The files are the source of truth — and the files are the site. Nothing to break." },
        { title: "Plain language first", body: "One idea per chapter, human voice, no hype. Teach, don't lecture." },
      ],
      outcome: "3 curricula, 13 subjects, one chapter library.",
    },
  },
  {
    id: "clario",
    title: "Clario",
    tagline: "An AI agent that briefs you on your day.",
    description: "An AI research agent that turns a rough question into a clear, sourced briefing.",
    liveUrl: "https://clarioagent.vercel.app/",
    status: "live",
    category: ["AI", "Tools"],
    tech: ["Next.js", "OpenAI", "Vercel"],
  },
  {
    id: "school-hunter",
    title: "School Hunter",
    tagline: "Finds schools’ HR contacts across Asia.",
    description: "A tool that finds schools’ HR contacts across Asia.",
    liveUrl: "https://school-hunter-4euqwoefr-aaquibali.vercel.app/",
    status: "live",
    category: ["Tools"],
    tech: ["Python", "Next.js", "Vercel"],
  },
  {
    id: "readsmith",
    title: "Readsmith",
    tagline: "A README generator for your repos.",
    description: "A README generator for your repos — still being built.",
    status: "building",
    category: ["AI", "Tools"],
    tech: ["TypeScript", "OpenAI", "GitHub"],
  },
  {
    id: "hisab",
    title: "Hisab",
    tagline: "A personal expense-tracker app.",
    description: "A personal expense-tracker app — still being built.",
    status: "building",
    category: ["Product"],
    tech: ["React", "TypeScript", "Tailwind CSS"],
  },
];

export const archive = [
  {
    name: "Teaching",
    previews: ["/images/about/teaching-1.jpg", "/images/about/teaching-2.jpg"],
    gallery: ["/images/about/teaching-1.jpg", "/images/about/teaching-2.jpg"],
  },
  {
    name: "Building",
    previews: ["/images/about/building-1.jpg", "/images/about/building-2.jpg"],
    gallery: [
      "/images/about/building-1.jpg",
      "/images/about/building-2.jpg",
      "/images/work/thread-academy.png",
    ],
  },
  {
    name: "Writing",
    previews: ["/images/about/writing-1.jpg", "/images/about/writing-2.jpg"],
    gallery: ["/images/about/writing-1.jpg", "/images/about/writing-2.jpg"],
  },
  {
    name: "Shipped Work",
    previews: ["/images/work/thread-academy.png", "/sapat-logo.png"],
    gallery: ["/images/work/thread-academy.png", "/sapat-logo.png"],
  },
];

/** Winter Arc — log a date here (YYYY-MM-DD → count) to light up a square. */
export const winterArc = {
  start: "2026-10-01",
  end: "2026-12-31",
  days: {} as Record<string, number>,
};

export const linkedin = {
  profileUrl: "https://www.linkedin.com/in/aliaaquib",
  headline: "Computer Science Teacher (Cambridge IGCSE/A-Level) | One plain-language CS concept daily",
  posts: [
    {
      date: "5 Oct 2026",
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7512824131122352128/",
      paragraphs: [
        "Teachers’ Day always makes me think back to the people who actually changed the trajectory of my life.",
        "We usually credit our success to hard work, opportunities, or right-place-right-time luck. But if you trace almost any skill, habit, or confident decision back to its root, there’s usually a teacher or mentor standing there.",
      ],
    },
    {
      date: "30 Sep 2026",
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7510895261205016576/",
      paragraphs: [
        "OpenAI launched something yesterday called Dots, and I can't stop thinking about what I'd do with one.",
        "Plain version: it's an AI helper that doesn't wait for you to ask. You give it a job \"keep working on that\", \"watch this for me\" and it keeps going in the background on its own little computer, even after you close the chat. You can talk to it on Slack or Teams too.",
      ],
    },
    {
      date: "27 Sep 2026",
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7509883564625395712/",
      paragraphs: [
        "Recursion broke my brain when I first learned it.",
        "Not the idea itself. The idea is stupidly simple. A function that calls itself. Done.",
        "What broke me was every tutorial explaining it like I already got it. Five paragraphs of setup before saying the one sentence that matters. So when I teach it now, I skip all that. I just say, stand between two mirrors.",
      ],
    },
    {
      date: "24 Sep 2026",
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7508741825415761920/",
      paragraphs: [
        "My students asked me how AI actually works in class today. No hype, no jargon — here's the 5-minute version I gave them.",
        "You know how your phone's keyboard guesses your next word? AI is basically that.",
      ],
    },
  ],
};
