import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, ImageOff } from "lucide-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";

type Post = {
  slug: string;
  title: string;
  subheading: string;
  category: string[];
  date: string;
  thumbnail: string;
  content: string;
};

function parseFrontMatter(raw: string) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string>, content: raw };
  const [, head, body] = match;
  const data: Record<string, string> = {};
  head.split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    data[key] = value;
  });
  return { data, content: body.trim() };
}

const files = import.meta.glob("../content/blog/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    return {
      slug: data.slug || (path.split("/").pop() ?? path).replace(/\.md$/, ""),
      title: data.title || "Untitled",
      subheading: data.subheading || "",
      category: data.category ? data.category.split(",").map((c) => c.trim()) : [],
      date: data.date || "",
      thumbnail: data.thumbnail || "",
      content,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function categoryCounts() {
  const counts = new Map<string, number>();
  posts.forEach((p) => p.category.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Thumbnail({ post, className }: { post: Post; className: string }) {
  const [broken, setBroken] = useState(false);
  if (!post.thumbnail || broken)
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#FCE7EC] to-[#F3B9C8]/40 dark:from-dark-surface2 dark:to-dark-surface3 ${className}`}
      >
        <ImageOff size={20} className="text-black/20 dark:text-white/20" />
      </div>
    );
  // Contain + poster paper colour, so a card taller than 16:9 never crops the poster's title.
  return (
    <img
      src={post.thumbnail}
      alt=""
      onError={() => setBroken(true)}
      className={`object-contain bg-[#F6F5F2] ${className}`}
    />
  );
}

const tag = "text-xs font-medium text-gray-700 dark:text-white/70 bg-[#FCE7EC]/60 dark:bg-white/10 rounded-full px-2.5 py-0.5";
const pill = (active: boolean) =>
  `glare-button shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
    active
      ? "bg-black dark:bg-white text-white dark:text-black"
      : "bg-white dark:bg-dark-surface2 border border-black/10 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
  }`;
const pillCount = (active: boolean) => `text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-black/5 dark:bg-white/10"}`;

function PostMeta({ post }: { post: Post }) {
  return (
    <>
      {post.category.map((c) => (
        <span key={c} className={tag}>
          {c}
        </span>
      ))}
      <span className="flex items-center gap-1 text-xs text-cherry-textSecondary dark:text-white/40">
        <Calendar size={12} />
        {formatDate(post.date)}
      </span>
    </>
  );
}

function BlogList({ onOpenPost }: { onOpenPost: (p: Post) => void }) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(categoryCounts, []);
  const visible = useMemo(() => (filter === "All" ? posts : posts.filter((p) => p.category.includes(filter))), [filter]);

  return (
    <motion.div
      key="blog-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-[880px] mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24"
    >
      <div className="mb-10">
        <h1 className="font-instrument font-semibold text-4xl md:text-5xl text-gray-800 dark:text-white tracking-tight mb-3">Blogs</h1>
        <p className="font-sans text-cherry-textSecondary dark:text-white/50 text-sm md:text-base">CS and AI, explained simply.</p>
      </div>

      <div className="flex items-center gap-2.5 mb-10 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        <button onClick={() => setFilter("All")} className={pill(filter === "All")}>
          All
          <span className={pillCount(filter === "All")}>{posts.length}</span>
        </button>
        {categories.map((c) => (
          <button key={c.name} onClick={() => setFilter(c.name)} className={pill(filter === c.name)}>
            {c.name}
            <span className={pillCount(filter === c.name)}>{c.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {visible.length === 0 && (
          <p className="text-cherry-textSecondary dark:text-white/40 text-sm py-10 text-center col-span-full">No posts in this category yet.</p>
        )}
        {visible.map((post, i) => (
          <motion.button
            key={post.slug}
            onClick={() => onOpenPost(post)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            className="group dashed-border-anim rounded-2xl w-full text-left"
          >
            <div className="flex flex-col sm:flex-row bg-white dark:bg-dark-surface rounded-[14px] overflow-hidden transition-colors duration-150">
              <Thumbnail post={post} className="w-full sm:w-64 md:w-80 aspect-video shrink-0" />
              <div className="flex flex-col flex-1 p-5 md:p-6 justify-center">
                <h3 className="font-instrument font-semibold text-xl md:text-2xl text-gray-800 dark:text-white mb-1.5">{post.title}</h3>
                <p className="font-sans text-sm text-gray-600 dark:text-white/50 leading-relaxed mb-3">{post.subheading}</p>
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <PostMeta post={post} />
                </div>
                <div className="flex items-center justify-start">
                  <span className="glare-button relative flex items-center gap-1.5 text-xs font-medium text-gray-800 dark:text-white rounded-full px-4 py-2 bg-white dark:bg-dark-surface3 border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-none">
                    Read Now
                    <span className="inline-flex transition-transform duration-150 group-hover:translate-x-1">
                      <ArrowRight size={14} className="arrow-nudge" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function BlogArticle({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <motion.div
      key="blog-article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-[720px] mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24"
    >
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-sm font-medium text-cherry-textSecondary dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-150 mb-8"
      >
        <ArrowLeft size={16} className="transition-transform duration-150 group-hover:-translate-x-1" />
        Back to Blog
      </button>
      <Thumbnail post={post} className="w-full aspect-video rounded-2xl mb-8" />
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <PostMeta post={post} />
      </div>
      <h1 className="font-instrument font-semibold text-3xl md:text-4xl text-gray-800 dark:text-white tracking-tight mb-3">{post.title}</h1>
      <p className="font-sans text-base text-cherry-textSecondary dark:text-white/50 mb-10">{post.subheading}</p>
      <div className="prose-blog font-sans text-[15px] leading-relaxed text-gray-700 dark:text-white/80">
        <Markdown>{post.content}</Markdown>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [open, setOpen] = useState<Post | null>(null);
  const select = (p: Post | null) => {
    setOpen(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <section className="w-full min-h-screen relative z-20 bg-[#FFFEFD] dark:bg-dark-bg transition-colors duration-150">
      <AnimatePresence mode="wait">
        {open ? <BlogArticle key="article" post={open} onBack={() => select(null)} /> : <BlogList key="list" onOpenPost={select} />}
      </AnimatePresence>
    </section>
  );
}
