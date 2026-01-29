import path from "path"
import fs from "fs"
import { defineConfig } from 'vite'

const SLIDES_MODULE_ID = 'virtual:slides';
const RESOLVED_SLIDES_MODULE_ID = '\0' + SLIDES_MODULE_ID;

/**
 * Loads slides from a markdown file.
 */
function loadSlides(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`[Katha] File not found: ${filePath}`);
        return `# Error: File not found\n\n${filePath}`;
    }
    return fs.readFileSync(filePath, 'utf-8');
}

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
                    slidesPath = path.resolve(process.cwd(), 'src/tutorial.md');
                    console.log(`[Katha] Loading tutorial: ${slidesPath}`);
                }

                const content = loadSlides(slidesPath);
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
