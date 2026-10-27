import { useEffect, useRef, useState, type CSSProperties } from "react";

// Sprite sheets are 3x3 grids. Cell order (row-major) for each sheet:
const DIRECTION_CELLS = ["up-left", "up", "up-right", "left", "center", "right", "down-left", "down", "down-right"];
const REACTION_CELLS = ["blink", "heart", "sparkle", "surprised", "wink", "bashful", "sleepy", "dizzy", "delighted"];
// Directions ordered by angle, starting at 0 rad (pointing right) and going clockwise.
const RING = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
const SECTOR = (Math.PI * 2) / RING.length;
const HYSTERESIS = 0.12;
const CENTER_RADIUS = 70;
const BOOP_REACTIONS = ["heart", "sparkle", "delighted"];
const BLINK_MS = 120;
const REACTION_MS = 560;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const COMBO_WINDOW_MS = 1600;
const DIZZY_MS = 1100;
const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];

const cellPosition = (i: number): CSSProperties => ({
  backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%`,
});
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const layer: CSSProperties = { position: "absolute", inset: 0, backgroundSize: "300% 300%", backgroundRepeat: "no-repeat" };

export default function Mascot({
  directions,
  reactions,
  size = 140,
  className,
  label = "mascot",
}: {
  directions: string;
  reactions: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const combo = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState("center");
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let sector = -1;
    let pointer: { x: number; y: number } | null = null;
    const update = () => {
      const el = buttonRef.current;
      if (!el || !pointer) return;
      const r = el.getBoundingClientRect();
      const dx = pointer.x - (r.left + r.width / 2);
      const dy = pointer.y - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < CENTER_RADIUS) {
        sector = -1;
        setDirection("center");
        return;
      }
      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrapAngle(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) return;
      sector = (Math.round(angle / SECTOR) + RING.length) % RING.length;
      setDirection(RING[sector]);
    };
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      update();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const boop = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const later = (ms: number, value: string | null) => {
      timers.current.push(window.setTimeout(() => setReaction(value), ms));
    };
    const now = Date.now();
    const c = combo.current;
    c.count = now - c.at < COMBO_WINDOW_MS ? c.count + 1 : 1;
    c.at = now;
    if (c.count >= DIZZY_AFTER) {
      c.count = 0;
      setReaction("dizzy");
      later(DIZZY_MS, null);
    } else {
      setReaction("blink");
      later(BLINK_MS, BOOP_REACTIONS[(c.count - 1) % BOOP_REACTIONS.length]);
      later(REACTION_MS, null);
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bodyRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: "linear" });
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={boop}
      aria-label={`Boop the ${label}`}
      className={className}
      style={{
        position: "relative",
        display: "block",
        flexShrink: 0,
        width: size,
        height: size,
        padding: 0,
        border: 0,
        background: "transparent",
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span ref={bodyRef} style={{ position: "relative", display: "block", width: "100%", height: "100%", transformOrigin: "50% 78%" }}>
        <span
          style={{
            ...layer,
            backgroundImage: `url(${directions})`,
            ...cellPosition(DIRECTION_CELLS.indexOf(direction)),
            opacity: reaction ? 0 : 1,
          }}
        />
        <span
          style={{
            ...layer,
            backgroundImage: `url(${reactions})`,
            ...cellPosition(REACTION_CELLS.indexOf(reaction ?? "blink")),
            opacity: reaction ? 1 : 0,
          }}
        />
      </span>
    </button>
  );
}
