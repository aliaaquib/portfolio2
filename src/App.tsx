import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import AskAI from "./components/AskAI";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Designs from "./components/Designs";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar, { type Theme, type View } from "./components/Navbar";
import Preloader from "./components/Preloader";
import Projects from "./components/Projects";

const views: View[] = ["home", "projects", "designs", "blog", "contact"];

const pageMotion = {
  className: "w-full flex flex-col items-center",
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("home");
  const [resetSignal, setResetSignal] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : "light";
  });

  const changeView = useCallback(
    (next: View) => {
      if (next === view && (next === "blog" || next === "designs")) setResetSignal((n) => n + 1);
      else setView(next);
    },
    [view],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onNavigate = (e: Event) => {
      const target = (e as CustomEvent<string>).detail as View;
      changeView(views.includes(target) ? target : "home");
    };
    window.addEventListener("navigate-to", onNavigate);
    return () => window.removeEventListener("navigate-to", onNavigate);
  }, [changeView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const toggleTheme = () => {
    const flip = () => setTheme((t) => (t === "light" ? "dark" : "light"));
    if (!document.startViewTransition) {
      flip();
      return;
    }
    document.startViewTransition(() => flushSync(flip));
  };

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={finishLoading} />}
      {!loading && <AskAI />}
      <div
        className={`relative w-full min-h-screen bg-cherry-bg text-cherry-text dark:bg-dark-bg dark:text-[#EDEDED] overflow-hidden selection:bg-cherry-pink selection:text-cherry-text font-sans transition-colors duration-150 ${
          loading ? "h-screen pointer-events-none" : "overflow-y-auto"
        }`}
      >
        <div className="fixed inset-0 pointer-events-none z-[-2] bg-cherry-bg dark:bg-dark-bg transition-colors duration-150" />
        <div className="fixed top-0 right-0 w-[80vw] h-[80vh] pointer-events-none z-[-1] bg-radial-blush dark:opacity-30" />
        {!loading && (
          <div className="fixed top-0 left-0 w-full h-14 md:h-16 backdrop-blur-md bg-white/25 dark:bg-black/25 z-40 pointer-events-none transition-colors duration-150" />
        )}
        <Navbar currentView={view} onViewChange={changeView} theme={theme} onToggleTheme={toggleTheme} />
        <main className="relative z-10 w-full flex flex-col items-center min-h-screen">
          <div className="flex-1 w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {view === "home" && (
                <motion.div key="home" {...pageMotion}>
                  <Home onViewChange={changeView} theme={theme} />
                </motion.div>
              )}
              {view === "projects" && (
                <motion.div key="projects" {...pageMotion}>
                  <Projects />
                </motion.div>
              )}
              {view === "designs" && (
                <motion.div key="designs" {...pageMotion}>
                  <Designs resetSignal={resetSignal} />
                </motion.div>
              )}
              {view === "contact" && (
                <motion.div key="contact" {...pageMotion}>
                  <Contact />
                </motion.div>
              )}
              {view === "blog" && (
                <motion.div key={`blog-${resetSignal}`} {...pageMotion}>
                  <Blog />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
