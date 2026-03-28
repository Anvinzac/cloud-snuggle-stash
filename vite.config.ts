import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

function saveHiddenThemePlugin() {
  return {
    name: 'save-hidden-theme',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/hide-theme' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { themeId } = JSON.parse(body);
              if (themeId) {
                const filePath = path.resolve(__dirname, 'hidden_themes.json');
                let hiddenThemes = [];
                if (fs.existsSync(filePath)) {
                  hiddenThemes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
                if (!hiddenThemes.includes(themeId)) {
                  hiddenThemes.push(themeId);
                  fs.writeFileSync(filePath, JSON.stringify(hiddenThemes, null, 2));
                }
              }
            } catch (e) {
              console.error(e);
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/cloud-snuggle-stash/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), saveHiddenThemePlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
