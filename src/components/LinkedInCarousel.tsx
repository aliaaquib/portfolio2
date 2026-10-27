import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { linkedin, site } from "../data";

const GAP = 16; // px between cards; matches gap-4

const roundButton =
  "glare-button flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-dark-surface3 border border-black/10 dark:border-white/10 text-gray-800 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] dark:shadow-none hover:shadow-soft-hover transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none";

/** 2 cards side by side from tablet width up (md, 768px), 1 on phones. */
function usePerView() {
  const query = "(min-width: 768px)";
  const [perView, setPerView] = useState(() => (window.matchMedia(query).matches ? 2 : 1));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setPerView(mq.matches ? 2 : 1);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return perView;
}

function PostCard({ post }: { post: (typeof linkedin.posts)[number] }) {
  return (
    <div className="dashed-border-anim rounded-2xl h-full">
      <div className="flex flex-col h-full bg-white dark:bg-dark-surface rounded-2xl p-5 md:p-6 transition-colors duration-150">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/portrait.jpg" alt={site.name} className="w-10 h-10 rounded-full object-cover shrink-0" draggable={false} />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-sans font-semibold text-sm text-gray-800 dark:text-white">
                {site.name}
                <FaLinkedin size={14} className="text-[#0A66C2] dark:text-white/80 shrink-0" />
              </p>
              <p className="text-[11px] leading-snug text-cherry-textSecondary dark:text-white/40 line-clamp-1">{linkedin.headline}</p>
            </div>
          </div>
          <span className="text-[11px] text-cherry-textSecondary dark:text-white/40 whitespace-nowrap pt-0.5">{post.date}</span>
        </div>

        <div className="flex-1 space-y-3 font-instrument-sans text-[15px] text-gray-700 dark:text-white/70 leading-relaxed">
          {post.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "font-medium text-gray-900 dark:text-white" : ""}>
              {p}
              {i === post.paragraphs.length - 1 && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 text-cherry-textSecondary dark:text-white/50 hover:text-[#c2185b] transition-colors duration-150"
                >
                  …more
                </a>
              )}
            </p>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10">
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="group glare-button relative inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 dark:text-white rounded-full px-4 py-2 bg-white dark:bg-dark-surface3 border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-none"
          >
            View post
            <ExternalLink size={13} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInCarousel() {
  const posts = linkedin.posts;
  const perView = usePerView();
  const last = Math.max(posts.length - perView, 0);
  const [index, setIndex] = useState(0);
  const at = Math.min(index, last); // stays valid when perView changes
  const go = (step: number) => setIndex(Math.min(Math.max(at + step, 0), last));

  // Measure the visible width so each step slides exactly one card plus the gap.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const stepPx = (width - GAP * (perView - 1)) / perView + GAP;
  const cardWidth = perView === 2 ? `calc((100% - ${GAP}px) / 2)` : "100%";
  const shown = perView === 2 ? `${at + 1}–${at + 2}` : `${at + 1}`;

  return (
    <div className="w-full">
      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          className="flex gap-4 items-stretch cursor-grab active:cursor-grabbing"
          animate={{ x: -at * stepPx }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(1);
            else if (info.offset.x > 50) go(-1);
          }}
        >
          {posts.map((post) => (
            <div key={post.url} className="shrink-0" style={{ width: cardWidth }}>
              <PostCard post={post} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-5">
        <span className="text-xs font-medium text-cherry-textSecondary dark:text-white/40 tabular-nums">
          {shown} / {posts.length}
        </span>
        <button onClick={() => go(-1)} disabled={at === 0} aria-label="Previous post" className={roundButton}>
          <ArrowLeft size={15} />
        </button>
        <button onClick={() => go(1)} disabled={at === last} aria-label="Next post" className={roundButton}>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
