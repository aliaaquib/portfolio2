import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Briefcase, Clock, House, Layers, LayoutGrid, Moon, Newspaper, Send, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "../data";

const clockFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: site.timeZone,
});

/** Aaquib's local time in Manas, ticking every 15s. */
function LiveClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const time = clockFormat.format(now).replace(",", "");
  return (
    <span
      title={`Local time in ${site.location}`}
      className="flex items-center gap-1.5 font-medium text-xs md:text-sm text-cherry-textSecondary dark:text-white/50 tabular-nums whitespace-nowrap"
    >
      <Clock size={compact ? 12 : 14} strokeWidth={1.75} />
      {time}
      {!compact && <span className="text-cherry-textSecondary/70 dark:text-white/40">· Manas</span>}
    </span>
  );
}

export type View = "home" | "projects" | "designs" | "blog" | "contact";
export type Theme = "light" | "dark";

export function ThemeToggle({ theme, onToggle, size = "md" }: { theme: Theme; onToggle: () => void; size?: "sm" | "md" }) {
  const isDark = theme === "dark";
  const width = size === "sm" ? 44 : 52;
  const height = size === "sm" ? 24 : 28;
  const knob = size === "sm" ? 18 : 22;
  const pad = (height - knob) / 2;
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="relative flex items-center rounded-full border border-black/10 dark:border-white/15 bg-black/[0.06] dark:bg-white/10 transition-colors duration-150"
      style={{ width, height, padding: pad }}
    >
      <motion.span
        className="flex items-center justify-center rounded-full bg-white dark:bg-dark-surface3 shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
        style={{ width: knob, height: knob }}
        animate={{ x: isDark ? width - knob - pad * 2 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        {isDark ? (
          <Moon size={knob * 0.6} className="text-white/90" />
        ) : (
          <Sun size={knob * 0.6} className="text-[#E8A33D]" />
        )}
      </motion.span>
    </button>
  );
}

const desktopLinks = [
  { name: "Home", view: "home", icon: User },
  { name: "Projects", view: "projects", icon: Briefcase },
  { name: "Designs", view: "designs", icon: LayoutGrid },
  { name: "Blog", view: "blog", icon: Newspaper },
] as const;

const mobileLinks = [
  { name: "Home", view: "home", icon: House },
  { name: "Projects", view: "projects", icon: Layers },
  { name: "Designs", view: "designs", icon: LayoutGrid },
  { name: "Blog", view: "blog", icon: BookOpen },
  { name: "Talk", view: "contact", icon: Send },
] as const;

const linkClass = (active: boolean) =>
  `group relative font-medium text-sm transition-colors duration-150 ${
    active
      ? "text-black dark:text-white"
      : "text-cherry-text dark:text-white/70 hover:text-black dark:hover:text-white"
  }`;

const underlineClass = (active: boolean) =>
  `absolute -bottom-1 left-0 h-[1.5px] bg-[#F3B9C8] transition-all duration-150 ease-out ${
    active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
  }`;

export default function Navbar({
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
}: {
  currentView: View;
  onViewChange: (v: View) => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const goHome = () => {
    onViewChange("home");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    <>
      <button
        onClick={goHome}
        className="fixed top-3 left-6 md:top-4 md:left-10 z-50 hover:opacity-70 transition-opacity duration-150"
      >
        <span className="font-signature text-xl md:text-2xl text-black dark:text-white">{site.handle}</span>
      </button>

      <div className="md:hidden fixed top-3 right-6 z-50 flex items-center gap-3">
        <LiveClock compact />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} size="sm" />
      </div>

      <nav className="hidden md:flex fixed top-4 right-10 md:right-12 z-50 items-center gap-8">
        <span className="hidden lg:flex items-center gap-8">
          <LiveClock />
          <span className="w-px h-4 bg-black/10 dark:bg-white/15" />
        </span>
        {desktopLinks.map((link) => {
          const active = currentView === link.view;
          return (
            <button key={link.name} onClick={() => onViewChange(link.view)} className={linkClass(active)}>
              {link.name}
              <span className={underlineClass(active)} />
            </button>
          );
        })}
        <button onClick={() => onViewChange("contact")} className={linkClass(currentView === "contact")}>
          let's talk
          <span className={underlineClass(currentView === "contact")} />
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} size="md" />
      </nav>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[336px] max-w-[92vw]">
        <div className="flex items-center justify-between bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5 dark:border-white/10 rounded-[32px] p-1.5 w-full transition-colors duration-150">
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const active = currentView === link.view;
            return (
              <motion.button
                layout
                key={link.name}
                aria-label={link.name}
                onClick={() => onViewChange(link.view)}
                className={`group relative flex items-center justify-center h-11 rounded-[24px] transition-colors duration-150 overflow-hidden ${
                  active ? "px-4 bg-black/10 dark:bg-white/10 gap-2" : "w-12 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <motion.div layout className="shrink-0 flex items-center justify-center">
                  <Icon
                    size={18}
                    strokeWidth={active ? 2 : 1.75}
                    className={`transition-colors duration-150 ${
                      active
                        ? "text-black dark:text-white"
                        : "text-black/40 dark:text-white/50 group-hover:text-black/80 dark:group-hover:text-white/90"
                    }`}
                  />
                </motion.div>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, scale: 0.8 }}
                      animate={{ opacity: 1, width: "auto", scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-xs whitespace-nowrap text-black dark:text-white origin-left"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
