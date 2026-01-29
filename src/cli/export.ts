/**
 * PDF Export Module
 * 
 * Uses Playwright to render each slide and generate a PDF.
 * Requires: bun add playwright
 */
import { spawn } from 'child_process';
import path from 'path';

interface ExportOptions {
    slidesPath?: string;
    outputPath: string;
    rootDir: string;
}

/**
 * Export presentation to PDF
 * 
 * Strategy:
 * 1. Start a temporary Vite dev server
 * 2. Use Playwright to navigate to /print route
 * 3. Generate PDF from print view
 * 4. Shut down server
 */
export async function exportToPdf(options: ExportOptions): Promise<void> {
    // @ts-ignore - playwright is an optional dependency
    const { chromium } = await import('playwright');

    console.log('📡 Starting temporary server...');

    // Set environment for slides
    if (options.slidesPath) {
        process.env.KATHA_SLIDES_PATH = options.slidesPath;
        process.env.KATHA_CWD = path.dirname(options.slidesPath);
    }

    // Start Vite in background
    const viteEntry = path.join(options.rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
    const serverProcess = spawn('bun', [viteEntry, '--port', '4173'], {
        cwd: options.rootDir,
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe']
    });

    // Wait for server to be ready
    await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Server start timeout')), 30000);

        serverProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Local:') || output.includes('localhost')) {
                clearTimeout(timeout);
                resolve();
            }
        });

        serverProcess.stderr?.on('data', (data) => {
            console.error('Server error:', data.toString());
        });

        serverProcess.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });

    console.log('🌐 Server ready. Launching browser...');

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Navigate to print view
        await page.goto('http://localhost:4173/print', {
            waitUntil: 'networkidle',
            timeout: 60000
        });

        console.log('🖨️  Generating PDF...');

        // Generate PDF
        await page.pdf({
            path: options.outputPath,
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        console.log(`✅ PDF exported: ${options.outputPath}`);
    } finally {
        // Clean up server
        serverProcess.kill();
    }
}
