import { useEffect, useState } from 'react';
import { createHighlighter, Highlighter } from 'shiki';

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
}

export function CodeBlock({ className, children }: CodeBlockProps) {
    const [html, setHtml] = useState<string | null>(null);
    const language = className?.replace('language-', '') || 'text';

    // Ensure children is a string (React children can be complex)
    const code = Array.isArray(children) ? children.join('') : String(children || '');

    useEffect(() => {
        let mounted = true;

        getHighlighter().then(highlighter => {
            if (!mounted) return;
            try {
                const highlighted = highlighter.codeToHtml(code, {
                    lang: language,
                    theme: 'dracula'
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
    }, [code, language]);

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
