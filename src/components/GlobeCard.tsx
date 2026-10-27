import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { site } from "../data";
import type { Theme } from "./Navbar";

type Visitor = { city: string; lat: number; lng: number };

const weatherWords = (code: number) =>
  code === 0 ? "clear" :
  code <= 3 ? "partly cloudy" :
  code <= 48 ? "foggy" :
  code <= 57 ? "drizzling" :
  code <= 67 ? "raining" :
  code <= 77 ? "snowing" :
  code <= 82 ? "showery" :
  code <= 86 ? "snowy" :
  "stormy";

/** Great-circle distance in km. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}

// cobe's phi/theta that put a lat/lng in the middle of the globe.
const anglesFor = (lat: number, lng: number) => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];

function Globe({ theme, visitor }: { theme: Theme; visitor: Visitor | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; phi: number } | null>(null);
  const offset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dark = theme === "dark";
    const [phi0, theta0] = anglesFor(
      visitor ? (visitor.lat + site.coords.lat) / 2 : site.coords.lat,
      visitor ? (visitor.lng + site.coords.lng) / 2 : site.coords.lng,
    );
    let phi = phi0;
    let width = canvas.offsetWidth;
    const onResize = () => (width = canvas.offsetWidth);
    window.addEventListener("resize", onResize);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: Math.min(Math.max(theta0, 0.2), 0.8),
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.2 : 0.9,
      mapSamples: 16000,
      mapBrightness: dark ? 4 : 2.2,
      mapBaseBrightness: dark ? 0 : 0.05,
      baseColor: dark ? [0.3, 0.3, 0.32] : [1, 0.96, 0.97],
      markerColor: dark ? [0.91, 0.47, 0.64] : [0.76, 0.09, 0.36],
      glowColor: dark ? [0.32, 0.16, 0.22] : [0.98, 0.86, 0.9],
      markers: [
        { location: [site.coords.lat, site.coords.lng], size: 0.11 },
        ...(visitor ? [{ location: [visitor.lat, visitor.lng] as [number, number], size: 0.08 }] : []),
      ],
      onRender: (state) => {
        if (!drag.current && !reduceMotion) phi += 0.0008;
        state.phi = phi + offset.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });
    requestAnimationFrame(() => (canvas.style.opacity = "1"));
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theme, visitor]);

  return (
    <div className="relative w-full max-w-[340px] aspect-square mx-auto">
      <canvas
        ref={canvasRef}
        aria-label="Globe showing where you are and where Aaquib is"
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none opacity-0 transition-opacity duration-700"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, phi: offset.current };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) offset.current = drag.current.phi + (e.clientX - drag.current.x) / 120;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      />
    </div>
  );
}

export default function GlobeCard({ theme }: { theme: Theme }) {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && typeof d.latitude === "number" && d.city)
          setVisitor({ city: d.city, lat: d.latitude, lng: d.longitude });
      })
      .catch(() => {});
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${site.coords.lat}&longitude=${site.coords.lng}&current=temperature_2m,weather_code&timezone=auto`,
    )
      .then((r) => r.json())
      .then((d) => {
        const c = d?.current;
        if (!cancelled && c && typeof c.temperature_2m === "number")
          setWeather(`${Math.round(c.temperature_2m)}°C and ${weatherWords(c.weather_code)}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const km = visitor ? distanceKm(visitor, site.coords) : null;
  const strong = "font-semibold text-gray-900 dark:text-white";

  return (
    <div className="dashed-border-anim rounded-2xl w-full">
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 grid md:grid-cols-[1fr_300px] items-center gap-6 md:gap-8 transition-colors duration-150 overflow-hidden">
        <div className="space-y-4 font-instrument-sans text-base md:text-[17px] text-gray-700 dark:text-white/60 leading-relaxed">
          <p>
            You are reading this from {visitor ? <>somewhere near <span className={strong}>{visitor.city}</span></> : "somewhere out there"}.
          </p>
          <p>
            I am in <span className={strong}>Manas</span>
            {weather ? (
              <>
                , where it is <span className={strong}>{weather}</span>
              </>
            ) : null}
            .{" "}
            {km !== null && km > 50 ? (
              <>
                That's <span className="font-semibold text-[#c2185b]">{km.toLocaleString()} km</span> apart. Small world.
              </>
            ) : (
              "Small world."
            )}
          </p>
          <p className="flex items-center gap-2 pt-1">
            <span className="font-signature text-2xl text-[#c2185b] dark:text-[#e879a3]">give it a spin</span>
            <svg width="38" height="20" viewBox="0 0 38 20" fill="none" className="text-[#c2185b] dark:text-[#e879a3] hidden md:block">
              <path d="M2 6 C 12 18, 24 18, 34 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M28 7 L 35 9.5 L 31 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-white/70 bg-[#FCE7EC]/60 dark:bg-white/10 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2185b]" /> Aaquib
            </span>
            {visitor && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-white/70 bg-[#FCE7EC]/60 dark:bg-white/10 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2185b]/60" /> You
              </span>
            )}
          </div>
        </div>
        <Globe theme={theme} visitor={visitor} />
      </div>
    </div>
  );
}
