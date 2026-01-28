import path from "path"
import fs from "fs"
import { defineConfig } from 'vite'

const SLIDES_MODULE_ID = 'virtual:slides';
const RESOLVED_SLIDES_MODULE_ID = '\0' + SLIDES_MODULE_ID;

function markdownSlidesPlugin() {
    return {
        name: 'vite-plugin-markdown-slides',
        resolveId(id) {
            if (id === SLIDES_MODULE_ID) {
                return RESOLVED_SLIDES_MODULE_ID;
            }
        },
        load(id) {
            if (id === RESOLVED_SLIDES_MODULE_ID) {
                let slidesPath = process.env.KATHA_SLIDES_PATH;

                if (!slidesPath) {
                    // Fallback to internal tutorial.md
                    // We can use process.cwd() joined with src/tutorial.md assuming we run from root
                    // Or better, since we don't have __dirname easily and this is a plugin:
                    // We know the relative path structure.
                    slidesPath = path.resolve(process.cwd(), 'src/tutorial.md');
                    console.log(`[Katha] No file provided, loading tutorial: ${slidesPath}`);
                } else {
                    console.log(`[Katha] Loading user slides: ${slidesPath}`);
                }

                if (!fs.existsSync(slidesPath)) {
                    // If tutorial is missing (e.g. distributed package), fallback to simple string
                    console.error(`[Katha] Slides file not found: ${slidesPath}`);
                    return `export default "# Welcome to Katha\\n\\nFile not found."`;
                }

                const content = fs.readFileSync(slidesPath, 'utf-8');
                return `export default ${JSON.stringify(content)};`;
            }
        },
        configureServer(server) {
            const userCwd = process.env.KATHA_CWD;
            if (userCwd) {
                server.middlewares.use('/', (req, res, next) => {
                    const filePath = path.join(userCwd, req.url.split('?')[0]);
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        res.write(fs.readFileSync(filePath));
                        res.end();
                        return;
                    }
                    next();
                });
            }
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        markdownSlidesPlugin()
    ],
    resolve: {
        alias: {
            // Mapping @ to src
            "@": path.resolve(process.cwd(), "./src"),
        },
    },
})
