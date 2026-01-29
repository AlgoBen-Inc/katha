#!/usr/bin/env bun
/**
 * Katha CLI
 * 
 * Commands:
 *   katha [file]     Start dev server (default)
 *   katha build      Build static site
 *   katha export     Export to PDF
 */
import { cac } from 'cac';
import path from 'path';
import { spawn } from 'child_process';

const cli = cac('katha');
const rootDir = path.resolve(__dirname, '..');
const viteEntry = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

/**
 * Helper: Spawn Vite process
 */
function spawnVite(args: string[], options: { file?: string } = {}) {
    if (options.file) {
        const absPath = path.resolve(process.cwd(), options.file);
        process.env.KATHA_SLIDES_PATH = absPath;
        process.env.KATHA_CWD = path.dirname(absPath);
    }

    const child = spawn('bun', [viteEntry, ...args], {
        stdio: 'inherit',
        cwd: rootDir,
        env: { ...process.env }
    });

    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
}

// ============================================================
// Command: dev (default)
// ============================================================
cli
    .command('[file]', 'Start the presentation dev server')
    .action((file) => {
        if (file) {
            console.log(`\n🚀 Katha Starting...\n📂 Slides: ${path.resolve(process.cwd(), file)}\n`);
        } else {
            console.log(`\n✨ Katha Demo Mode\n`);
        }
        spawnVite([], { file });
    });

// ============================================================
// Command: build
// ============================================================
cli
    .command('build [file]', 'Build static site for deployment')
    .option('-o, --outDir <dir>', 'Output directory', { default: 'dist' })
    .action((file, options) => {
        console.log(`\n🔨 Katha Build\n`);

        if (file) {
            const absPath = path.resolve(process.cwd(), file);
            process.env.KATHA_SLIDES_PATH = absPath;
            process.env.KATHA_CWD = path.dirname(absPath);
            console.log(`📂 Slides: ${absPath}`);
        }

        console.log(`📦 Output: ${options.outDir}\n`);

        spawnVite(['build', '--outDir', path.resolve(process.cwd(), options.outDir)]);
    });

// ============================================================
// Command: export (PDF)
// ============================================================
cli
    .command('export [file]', 'Export presentation to PDF')
    .option('-o, --output <file>', 'Output PDF file', { default: 'slides.pdf' })
    .action(async (file, options) => {
        console.log(`\n📄 Katha Export to PDF\n`);

        // Dynamic import to avoid requiring playwright for dev/build
        try {
            const { exportToPdf } = await import('../src/cli/export.js');
            await exportToPdf({
                slidesPath: file ? path.resolve(process.cwd(), file) : undefined,
                outputPath: path.resolve(process.cwd(), options.output),
                rootDir
            });
        } catch (err: any) {
            if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes('playwright')) {
                console.error('❌ PDF export requires Playwright. Install it with:');
                console.error('   bun add playwright');
                process.exit(1);
            }
            throw err;
        }
    });

cli.help();
cli.version('0.1.0');

cli.parse();
