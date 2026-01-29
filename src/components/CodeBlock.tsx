import { useEffect, useState } from 'react';
import { createHighlighter, Highlighter } from 'shiki';
import { Mermaid } from './Mermaid';

// Singleton highlighter to avoid re-creation
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = () => {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ['dracula'],
            langs: ['javascript', 'jsx', 'tsx', 'typescript', 'markdown', 'html', 'css', 'python', 'bash', 'json']
        });
    }
    return highlighterPromise;
};

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
    meta?: string;
}

/**
 * Parses line ranges from meta string like "{1,3-5}"
 */
function parseLineRanges(meta: string): number[] {
    const rangeMatch = meta.match(/\{([\d,\-\s]+)\}/);
    if (!rangeMatch) return [];

    const lines: number[] = [];
    const parts = rangeMatch[1].split(',');

    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(p => parseInt(p.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) lines.push(i);
            }
        } else {
            const line = parseInt(part.trim(), 10);
            if (!isNaN(line)) lines.push(line);
        }
    }
    return lines;
}

export function CodeBlock({ className, children, meta }: CodeBlockProps) {
    const [html, setHtml] = useState<string | null>(null);
    const language = className?.replace('language-', '') || 'text';

    // Ensure children is a string (React children can be complex)
    const code = Array.isArray(children) ? children.join('') : String(children || '');

    // Handle Mermaid diagrams
    if (language === 'mermaid') {
        return <Mermaid code={code} />;
    }

    useEffect(() => {
        let mounted = true;

        getHighlighter().then(highlighter => {
            if (!mounted) return;
            try {
                const highlightedLines = meta ? parseLineRanges(meta) : [];

                const highlighted = highlighter.codeToHtml(code, {
                    lang: language,
                    theme: 'dracula',
                    transformers: [
                        {
                            line(node, line) {
                                if (highlightedLines.includes(line)) {
                                    this.addClassToHast(node, 'highlighted');
                                }
                            }
                        }
                    ]
                });

                // Inject padding class (p-6 for more space)
                let finalHtml = highlighted.replace('<pre class="shiki', '<pre class="shiki p-6');

                // If the user passed a custom background class (e.g. via <CodeBlock className="bg-red-900">),
                // we need to strip Shiki's default inline background-color style so the class takes effect.
                if (className && className.includes('bg-')) {
                    finalHtml = finalHtml.replace(/style="[^"]*background-color:[^"]*"/, 'style=""');
                }

                setHtml(finalHtml);
            } catch (e) {
                console.warn(`Failed to highlight ${language}:`, e);
                // Fallback
                setHtml(`<pre class="shiki bg-[#282a36] p-6 rounded text-white overflow-auto"><code>${code}</code></pre>`);
            }
        });

        return () => { mounted = false; };
    }, [code, language, meta]);

    if (!html) {
        return (
            <pre className="bg-slate-900 p-4 rounded text-slate-400 overflow-auto animate-pulse">
                <code>{code}</code>
            </pre>
        );
    }

    return (
        <div
            className="rounded-lg overflow-hidden my-4 text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
