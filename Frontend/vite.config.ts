import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this project from /PJ1; Vercel and local root hosting use /.
const base = process.env.VERCEL ? "/" : "/PJ1/";

export default defineConfig({ base, plugins: [react()] });
