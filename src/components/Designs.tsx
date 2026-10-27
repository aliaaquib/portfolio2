import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Ellipsis, Folder, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { archive } from "../data";

type Category = (typeof archive)[number];

const FOLDER_PATH =
  "M0,24 C0,10.7 10.7,0 24,0 L100,0 C112,0 118,5 125,15 C132,25 138,30 150,30 L296,30 C309.3,30 320,40.7 320,54 L320,196 C320,209.3 309.3,220 296,220 L24,220 C10.7,220 0,209.3 0,196 Z";

function LazyImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-white/[0.04]">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/[0.06] dark:via-white/[0.03] dark:to-white/[0.06]" />
      )}
      <img
        src={src}
        alt=""
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function FolderCard({ category, index, onOpen }: { category: Category; index: number; onOpen: () => void }) {
  return (
    <motion.button
      layoutId={`folder-${category.name}`}
      onClick={onOpen}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative w-full aspect-[17/21] md:aspect-[32/33] text-left rounded-[22px] md:rounded-[30px] transition-all duration-150 ease-out hover:-translate-y-2 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/10 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_18px_34px_-8px_rgba(0,0,0,0.55),0_4px_10px_-2px_rgba(0,0,0,0.4)] group-hover:shadow-[0_18px_34px_-8px_rgba(0,0,0,0.16),0_4px_10px_-2px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_26px_46px_-10px_rgba(0,0,0,0.65),0_6px_14px_-2px_rgba(0,0,0,0.5)]"
      aria-label={`Open ${category.name} folder`}
    >
      <div className="absolute inset-x-0 top-0 h-[100px] md:h-[145px] rounded-t-[22px] md:rounded-t-[30px] bg-gradient-to-b from-[#FCE6EE] via-[#F7C8D9] to-[#F3D9E3] dark:from-[#D97B9F] dark:via-[#B86887] dark:to-[#8D566E] opacity-90 dark:opacity-80 group-hover:brightness-105 transition-all duration-150 ease-out" />
      <div className="absolute inset-x-0 top-[15%] md:top-[12%] flex justify-center z-10">
        <div className="relative w-[70%] aspect-[5/6] max-w-[170px] max-h-[200px] transition-transform duration-150 ease-out group-hover:-translate-y-[6px]">
          <img
            src={category.previews[0]}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover rounded-[14px] md:rounded-[18px] shadow-sm origin-bottom transform -rotate-[7deg] group-hover:-rotate-[12deg] -translate-x-2 group-hover:-translate-x-4 transition-transform duration-150 ease-out"
          />
          <img
            src={category.previews[1]}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover rounded-[14px] md:rounded-[18px] shadow-sm origin-bottom transform rotate-[7deg] group-hover:rotate-[12deg] translate-x-2 group-hover:translate-x-4 transition-transform duration-150 ease-out"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[65%] md:h-[68%] z-20">
        <svg
          viewBox="0 0 320 220"
          preserveAspectRatio="none"
          className="w-full h-full text-white dark:text-[#232325] drop-shadow-[0_18px_45px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-150 group-hover:drop-shadow-[0_24px_55px_rgba(0,0,0,0.12)] dark:group-hover:drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
        >
          <path d={FOLDER_PATH} fill="currentColor" />
          <path d={FOLDER_PATH} fill="none" className="stroke-black/[0.04] dark:stroke-white/[0.05]" strokeWidth="2" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end h-full pointer-events-none">
          <h3 className="font-instrument font-semibold text-[20px] md:text-[28px] text-[#121212] dark:text-[#FAFAFA] leading-tight mb-1">
            {category.name}
          </h3>
          <p className="font-sans font-normal text-[13px] md:text-[15px] text-[#808080] dark:text-white/[0.65]">Collection</p>
          <div className="flex justify-between items-end mt-3 md:mt-4">
            <Folder size={18} className="text-[#808080] dark:text-white/[0.65] md:w-5 md:h-5" />
            <Ellipsis size={18} className="text-[#808080] dark:text-white/[0.65] md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function Gallery({ category, onBack }: { category: Category; onBack: () => void }) {
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(null);
        else onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, onBack]);

  return (
    <>
      <motion.div
        layoutId={`folder-${category.name}`}
        className="fixed inset-0 z-40 bg-[#FFFEFD] dark:bg-[#0F0F10] overflow-y-auto transition-colors duration-150"
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24 relative z-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-medium text-[#808080] dark:text-white/[0.65] hover:text-[#121212] dark:hover:text-[#FAFAFA] transition-colors duration-150 mb-8 focus:outline-none focus:underline"
            aria-label="Back to Design Archive"
          >
            <ArrowLeft size={16} className="transition-transform duration-150 group-hover:-translate-x-1" />
            Back
          </button>
          <div className="mb-12">
            <h2 className="font-instrument font-semibold text-gray-800 dark:text-white text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2">
              {category.name}
            </h2>
            <p className="text-[#808080] dark:text-white/50 text-sm md:text-[15px]">
              Hover to preview, click any image to view in fullscreen
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {category.gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.05, ease: "easeOut" }}
                onClick={() => setFullscreen(src)}
                className="relative rounded-[20px] overflow-hidden border border-black/[0.04] dark:border-white/[0.05] bg-white dark:bg-[#181818] cursor-pointer group hover:z-20 hover:scale-[1.35] transition-transform duration-200 ease-out hover:shadow-2xl"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setFullscreen(src);
                }}
              >
                <LazyImage src={src} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      {createPortal(
        <AnimatePresence>
          {fullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullscreen(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
            >
              <button
                onClick={() => setFullscreen(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors focus:outline-none"
                aria-label="Close fullscreen"
              >
                <X size={32} />
              </button>
              <motion.img
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                src={fullscreen}
                alt="Fullscreen Preview"
                className="max-w-full max-h-full rounded-[12px] md:rounded-[24px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={() => setFullscreen(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export default function Designs({ resetSignal }: { resetSignal?: number }) {
  const [open, setOpen] = useState<Category | null>(null);

  useEffect(() => setOpen(null), [resetSignal]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative z-20 pt-[140px] pb-32"
    >
      <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-instrument font-semibold text-gray-800 dark:text-white text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2 md:mb-4 text-center"
        >
          Design Archive
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="font-sans text-[16px] md:text-[20px] text-[#808080] dark:text-white/[0.65] max-w-[520px] text-center mb-16 md:mb-20"
        >
          Explore my work across different categories.
        </motion.p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-[880px] mx-auto">
          {archive.map((c, i) => (
            <FolderCard key={c.name} category={c} index={i} onOpen={() => setOpen(c)} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <Gallery key="gallery" category={open} onBack={() => setOpen(null)} />}</AnimatePresence>
    </motion.section>
  );
}
