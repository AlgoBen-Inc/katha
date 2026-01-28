#!/usr/bin/env bun
import { cac } from 'cac';
import path from 'path';
import { spawn } from 'child_process';

const cli = cac('katha');

cli
    .command('[file]', 'Start the presentation')
    .action((file, options) => {
        const rootDir = path.resolve(__dirname, '..');
        // Resolve the actual JS file instead of the bin wrapper
        const viteEntry = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

        if (file) {
            const absPath = path.resolve(process.cwd(), file);
            process.env.KATHA_SLIDES_PATH = absPath;
            process.env.KATHA_CWD = path.dirname(absPath);
            console.log(`\n🚀 Katha Starting...\n📂 Slides: ${absPath}\n`);
        } else {
            console.log(`\n✨ Katha Demo Mode\n`);
        }

        // Spawn Vite using Bun
        const child = spawn('bun', [viteEntry], {
            stdio: 'inherit',
            cwd: rootDir,
            env: { ...process.env }
        });

        child.on('exit', (code) => {
            process.exit(code);
        });
    });

cli.help();
cli.version('0.0.1');

cli.parse();
