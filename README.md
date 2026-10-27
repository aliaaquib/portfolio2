# aaquibali

Aaquib Ali's portfolio. Same stack and design system as palakonweb.in:
Vite + React + TypeScript, Tailwind CSS v3, Framer Motion, lucide-react + react-icons,
react-fast-marquee, react-activity-calendar and react-markdown.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Where things live

- `src/data.tsx` holds all the content: name, roles, about text, tech stack, experience, projects, socials, design-archive folders and the Winter Arc log.
- `src/content/blog/*.md` holds the blog posts (front matter: slug, title, subheading, category, date, thumbnail).
- `public/` holds the images, mascot sprites, banner videos and fonts.

## Setup notes

- **Contact form:** create a free key at https://web3forms.com and put it in `.env` as `VITE_WEB3FORMS_KEY=...`. Without a key, the form opens the visitor's email app.
- **Winter Arc:** add dates to `winterArc.days` in `src/data.tsx`, for example `"2026-10-27": 1`.
- **Before publishing:** `public/banner-light.mp4`, `public/banner-dark.mp4` and `public/animals.png` are palakonweb's own artwork. Replace them with your own.

## Ask AI

The floating **Ask AI** chat streams answers from Claude (`claude-opus-5-5`, low effort) about Aaquib.

- Front end: `src/components/AskAI.tsx`. Back end: `api/ask.ts` (a Vercel Function), which calls `server/ask.ts`. The same handler also runs on `npm run dev` through a small Vite middleware.
- The assistant knows `server/profile.ts` plus every post in `src/content/blog/`. Update `profile.ts` when your facts change.
- **To switch it on:** add `ANTHROPIC_API_KEY` to the Vercel project's environment variables (and to `.env` for local dev). The key stays on the server and is never sent to the browser. Without it, the chat replies "Ask AI isn't switched on yet".
- **Limits:** 20 messages per visitor per day (in the browser, plus a best-effort per-IP check on the server). History is capped at 12 messages and each message at 1,000 characters. The system prompt is prompt-cached, and declined requests fall back to another model automatically (`fallbacks: "default"`).

## Live data on Home

- **Navbar clock:** Aaquib's local time (`Asia/Bishkek`), set in `site.timeZone` in `src/data.tsx`.
- **Two dots on a globe:** finds the visitor's city with ipapi.co and gets the Manas weather from open-meteo (both free, no key). The globe is drawn with `cobe`.
- **On LinkedIn:** the posts live in `linkedin.posts` in `src/data.tsx`. Add new ones at the top.
