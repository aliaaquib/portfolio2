import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Serves /api/ask during `npm run dev` with the same handler Vercel runs in production. */
function askApiDev(): Plugin {
  return {
    name: "ask-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/ask", async (req, res) => {
        const { handleAsk } = await server.ssrLoadModule("/server/ask.ts");
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const request = new Request(`http://localhost${req.url ?? ""}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
        });
        const response: Response = await handleAsk(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        if (!response.body) return res.end();
        const reader = response.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make ANTHROPIC_API_KEY from .env available to the dev API route (it is never sent to the browser).
  const env = loadEnv(mode, process.cwd(), "");
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY ??= env.ANTHROPIC_API_KEY;

  return {
    plugins: [react(), askApiDev()],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "framer-motion": ["framer-motion"],
            icons: ["lucide-react", "react-icons/fa", "react-icons/fa6", "react-icons/si"],
            "github-calendar": ["react-activity-calendar"],
          },
        },
      },
    },
  };
});
