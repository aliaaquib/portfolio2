import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, ChevronDown, Eye } from "lucide-react";
import { cloneElement, useEffect, useState, type ReactNode } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import Marquee from "react-fast-marquee";
import {
  aboutParagraphs,
  experience,
  freelanceText,
  linkedin,
  roles,
  site,
  socials,
  techStack,
  winterArc,
} from "../data";
import GlobeCard from "./GlobeCard";
import LinkedInCarousel from "./LinkedInCarousel";
import Mascot from "./Mascot";
import type { Theme, View } from "./Navbar";

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

const sectionTitle = "font-instrument font-semibold text-[26px] md:text-3xl text-gray-800 dark:text-white mb-6";
const softFade = (mobile: boolean) =>
  mobile
    ? {
        maskImage: "linear-gradient(90deg, black 0, black calc(100% - 24px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, black 0, black calc(100% - 24px), transparent 100%)",
      }
    : undefined;

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const word = roles[index];
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === "typing") {
      t =
        text.length < word.length
          ? setTimeout(() => setText(word.slice(0, text.length + 1)), 80)
          : setTimeout(() => setPhase("pausing"), 1200);
    } else if (phase === "pausing") {
      t = setTimeout(() => setPhase("deleting"), 900);
    } else if (text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else {
      setIndex((i) => (i + 1) % roles.length);
      setPhase("typing");
    }
    return () => clearTimeout(t);
  }, [text, phase, index]);

  return (
    <span className="inline-flex items-center font-instrument-sans font-medium text-2xl md:text-3xl text-[#c2185b]">
      {text}
      <span className="ml-1 w-[2px] h-[1em] bg-[#c2185b] animate-pulse" />
    </span>
  );
}

function RevealParagraphs({ paragraphs, className }: { paragraphs: ReactNode[]; className: string }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}

function ViewCounter() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const visited = sessionStorage.getItem("about_page_session_visited");
    const base = `https://api.counterapi.dev/v1/${site.counterNamespace}/about_page_views`;
    fetch(visited ? base : `${base}/up`)
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.count === "number") {
          setCount(d.count);
          if (!visited) sessionStorage.setItem("about_page_session_visited", "true");
        }
      })
      .catch(() => {});
  }, []);
  if (count === null) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm text-cherry-textSecondary dark:text-white/40">
      <Eye size={16} />
      {count.toLocaleString()}
    </div>
  );
}

const calendarTheme = {
  light: ["#f0f0f0", "#fbd4de", "#f3b9c8", "#e879a3", "#c2185b"],
  dark: ["#232323", "#4a2530", "#7a2f4d", "#b8446f", "#e879a3"],
};

const levelFor = (count: number) => (count > 6 ? 4 : count > 4 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0);

function GitHubActivity({ isMobile, theme }: { isMobile: boolean; theme: Theme }) {
  const sizing = { fontSize: isMobile ? 9 : 12, blockSize: isMobile ? 8 : 11, blockMargin: isMobile ? 3 : 4 };
  const [days, setDays] = useState<Activity[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${site.githubUser}?y=last`);
        if (res.ok) {
          const json = await res.json();
          if (!cancelled && Array.isArray(json.contributions)) {
            setDays(json.contributions.map((d: Activity) => ({ ...d, level: d.level ?? levelFor(d.count) })));
            setTotal(json.total?.lastYear ?? null);
            return;
          }
        }
      } catch {
        // fall through to the error state
      }
      if (!cancelled) setFailed(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed)
    return (
      <p className="text-sm text-cherry-textSecondary dark:text-white/40 py-8 text-center">
        Couldn't load GitHub activity right now.
      </p>
    );
  if (!days) return <div className="h-[140px] rounded-xl bg-black/[0.03] dark:bg-white/[0.03] animate-pulse" />;
  return (
    <ActivityCalendar
      data={days}
      colorScheme={theme}
      theme={calendarTheme}
      {...sizing}
      labels={{
        totalCount: total === null ? "{{count}} contributions in the last year" : `${total} contributions in the last year`,
      }}
      renderBlock={(block, activity) =>
        cloneElement(block, { children: <title>{`${activity.count} contributions on ${activity.date}`}</title> })
      }
    />
  );
}

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function winterArcDays() {
  const start = new Date(`${winterArc.start}T00:00:00`);
  const end = new Date(`${winterArc.end}T00:00:00`);
  const length = Math.round((end.getTime() - start.getTime()) / 864e5) + 1;
  return Array.from({ length }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const date = toKey(d);
    return { date, count: winterArc.days[date] ?? 0 };
  });
}

function WinterArc({ isMobile, theme }: { isMobile: boolean; theme: Theme }) {
  const days = winterArcDays();
  const locked = days.filter((d) => d.count > 0).length;
  const rows = isMobile ? 3 : 4;
  const cols = Math.ceil(days.length / rows);
  const on = theme === "dark" ? "#e879a3" : "#c2185b";
  const off = theme === "dark" ? "#232323" : "#f0f0f0";

  return (
    <div className={isMobile ? "inline-block" : "w-full"}>
      <div
        className="grid gap-1 md:gap-1.5 w-full"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: isMobile ? `repeat(${cols}, 20px)` : `repeat(${cols}, 1fr)`,
          gridAutoFlow: "column",
        }}
      >
        {days.map((d) => (
          <div key={d.date} className="relative group">
            <div className="aspect-square rounded-[3px] md:rounded-[4px]" style={{ background: d.count > 0 ? on : off }} />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg">
              {d.count} on {d.date}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 dark:bg-white/90 rotate-45" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-cherry-textSecondary dark:text-white/40">
        <span>
          {locked} / {days.length} days locked in
        </span>
        <span className="flex items-center gap-1.5">
          Less
          <span className="w-3 h-3 rounded-[3px]" style={{ background: off }} />
          <span className="w-3 h-3 rounded-[3px]" style={{ background: on }} />
          More
        </span>
      </div>
    </div>
  );
}

function Experience() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="dashed-border-anim rounded-2xl w-full">
      <div className="bg-white dark:bg-dark-surface rounded-2xl divide-y divide-black/5 dark:divide-white/10 transition-colors duration-150">
        {experience.map((job) => {
          const isOpen = open === job.id;
          return (
            <div key={job.id}>
              <button
                onClick={() => setOpen(isOpen ? null : job.id)}
                className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2 p-5 md:p-6 text-left hover:bg-[#FCE7EC]/20 dark:hover:bg-white/5 transition-colors duration-150"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {job.logo && (
                    <span className="shrink-0 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.06)] p-1.5">
                      <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                    </span>
                  )}
                  <div>
                    <h4 className="font-sans font-semibold text-base md:text-lg text-gray-800 dark:text-white">{job.company}</h4>
                    <p className="text-xs md:text-sm text-cherry-textSecondary dark:text-white/40">
                      {job.role} · {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-sm text-cherry-textSecondary dark:text-white/40">{job.period}</span>
                  <ChevronDown
                    size={16}
                    className={`text-cherry-textSecondary dark:text-white/40 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-6 flex flex-col gap-4">
                      <p className="text-sm text-gray-700 dark:text-white/60 leading-relaxed">{job.description}</p>
                      <ul className="flex flex-col gap-2">
                        {job.responsibilities.map((r, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/60">
                            <span className="mt-2 w-1 h-1 rounded-full bg-[#c2185b] shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {job.tools.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium text-gray-700 dark:text-white/70 bg-[#FCE7EC]/40 dark:bg-white/10 rounded-full px-3 py-1"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home({ onViewChange, theme }: { onViewChange: (v: View) => void; theme: Theme }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="w-full relative z-20 flex flex-col items-center bg-gradient-to-b from-[#FFFEFD] via-[#F3B9C8]/10 to-[#FFFEFD] dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg min-h-screen transition-colors duration-150">
      <div className="max-w-[1000px] w-full mx-auto px-4 md:px-12 relative z-10 pt-16 md:pt-20 pb-16">
        <div className="dashed-border-anim rounded-3xl w-full">
          <div className="bg-white/40 dark:bg-dark-surface/60 backdrop-blur-sm rounded-3xl p-4 md:p-10 transition-colors duration-150">
            <motion.div
              className="relative w-full mb-6 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="rounded-[20px] w-full">
                <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-[20px] overflow-hidden">
                  <video
                    src="/banner-light.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-150 ease-in-out ${theme === "light" ? "opacity-100" : "opacity-0"}`}
                  />
                  <video
                    src="/banner-dark.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-150 ease-in-out ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
              </div>

              <div className="absolute -bottom-12 left-6 md:left-8 z-30">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[3px] bg-gradient-to-br from-[#FFB7C5] to-[#c2185b] shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FFFEFD] dark:bg-dark-surface border-4 border-[#FFFEFD] dark:border-dark-bg transition-colors duration-150 flex items-center justify-center">
                    <Mascot directions={site.mascot.directions} reactions={site.mascot.reactions} size={120} label={site.mascot.label} />
                  </div>
                </div>
              </div>

              <div className="hidden md:flex absolute -bottom-14 right-0 flex-wrap justify-end gap-3">
                <button
                  onClick={() => onViewChange("designs")}
                  className="glare-button group flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-soft font-medium text-xs md:text-sm hover:shadow-soft-hover transition-all duration-150"
                >
                  View Designs
                  <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
                </button>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glare-button group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-surface3 border border-black/10 dark:border-white/10 rounded-full shadow-soft font-medium text-xs md:text-sm text-gray-800 dark:text-white hover:shadow-soft-hover transition-all duration-150"
                >
                  View Resume
                  <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>

            <div className="flex md:hidden w-full gap-2.5 mt-16 mb-8">
              <button
                onClick={() => onViewChange("designs")}
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-white text-black rounded-[18px] font-medium text-[13px] whitespace-nowrap shadow-sm"
              >
                View Designs
                <ArrowRight size={14} className="transform -rotate-45 opacity-60" />
              </button>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-[#1f1f1f] text-white rounded-[18px] font-medium text-[13px] whitespace-nowrap shadow-sm"
              >
                View Resume
                <ArrowRight size={14} className="transform -rotate-45 opacity-60" />
              </a>
            </div>

            <motion.div
              className="w-full mb-16 pt-2 md:pt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-instrument font-semibold text-3xl md:text-4xl text-gray-800 dark:text-white tracking-tight">
                    {site.name}
                  </h2>
                  <BadgeCheck size={22} className="text-[#3B9EF3] fill-[#3B9EF3]/15 shrink-0" />
                </div>
                <ViewCounter />
              </div>
              <Typewriter />
              <p className="font-sans text-[13px] md:text-sm text-cherry-textSecondary dark:text-white/40 mt-1.5">{site.location}</p>
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Winter Arc</h3>
              <div className="dashed-border-anim rounded-2xl w-full">
                <div
                  className="relative bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 overflow-x-auto transition-colors duration-150"
                  style={softFade(isMobile)}
                >
                  <WinterArc isMobile={isMobile} theme={theme} />
                </div>
              </div>
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Who is Aaquib?</h3>
              <RevealParagraphs
                paragraphs={aboutParagraphs}
                className="space-y-4 font-instrument-sans text-base md:text-[17px] text-gray-700 dark:text-white/60 leading-relaxed"
              />
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Tech Stack</h3>
              <div
                className="w-full overflow-hidden"
                style={{
                  maskImage: "linear-gradient(90deg, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)",
                }}
              >
                <Marquee speed={30} gradient={false} className="py-2">
                  <div className="flex items-center gap-4 px-4">
                    {techStack.map(({ name, Icon, color }) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 bg-white dark:bg-dark-surface2 rounded-full px-3 py-2 border border-black/5 dark:border-white/10 mx-2"
                      >
                        <Icon size={18} color={color} />
                        <span className="text-[13px] md:text-sm font-medium text-[#181818] dark:text-white">{name}</span>
                      </div>
                    ))}
                  </div>
                </Marquee>
              </div>
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Freelancing</h3>
              <div className="dashed-border-anim rounded-2xl w-full">
                <div className="bg-[#FCE7EC]/50 dark:bg-white/[0.04] rounded-2xl p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-150">
                  <p className="font-sans text-gray-700 dark:text-white/70 text-[15px] md:text-base leading-relaxed max-w-lg">
                    {freelanceText}
                  </p>
                  <button
                    onClick={() => onViewChange("contact")}
                    className="glare-button group flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-dark-surface3 border border-black/10 dark:border-white/10 rounded-full shadow-soft font-medium text-sm text-gray-800 dark:text-white shrink-0 hover:shadow-soft-hover transition-all duration-150"
                  >
                    Hire Me
                    <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Experience</h3>
              <Experience />
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <div className="flex items-end justify-between gap-4 mb-6">
                <h3 className={sectionTitle.replace(" mb-6", "")}>On LinkedIn</h3>
                <a
                  href={linkedin.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-1 text-xs md:text-sm font-medium text-cherry-textSecondary dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-150 pb-1"
                >
                  View LinkedIn
                  <ArrowUpRight size={14} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
              <LinkedInCarousel />
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>Two dots on a globe</h3>
              <GlobeCard theme={theme} />
            </motion.div>

            <motion.div className="w-full mb-16" {...sectionMotion}>
              <h3 className={sectionTitle}>GitHub Activity</h3>
              <div className="dashed-border-anim rounded-2xl w-full">
                <div
                  className="relative bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 overflow-x-auto transition-colors duration-150"
                  style={softFade(isMobile)}
                >
                  <GitHubActivity isMobile={isMobile} theme={theme} />
                </div>
              </div>
            </motion.div>

            <div className="flex flex-nowrap justify-center items-center gap-2.5 md:gap-6">
              {socials.map(({ name, Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="glare-button flex items-center justify-center md:justify-start gap-2.5 bg-white dark:bg-dark-surface2 border border-black/5 dark:border-white/10 shadow-glass dark:shadow-none rounded-2xl w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-4 group transition-all duration-150"
                >
                  <Icon size={18} className="text-[#181818] dark:text-white" />
                  <span className="hidden md:inline text-[13px] font-semibold text-[#181818] dark:text-white transition-colors">{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
