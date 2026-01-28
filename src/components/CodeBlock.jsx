import React, { useEffect, useState } from 'react';
import { createHighlighter } from 'shiki';

// Singleton highlighter to avoid re-creation
let highlighterPromise = null;

const getHighlighter = () => {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ['dracula'],
            langs: ['javascript', 'jsx', 'tsx', 'markdown', 'html', 'css', 'python', 'bash', 'json']
        });
    }
    return highlighterPromise;
};

export function CodeBlock({ className, children }) {
    const [html, setHtml] = useState(null);
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
                setHtml(highlighted);
            } catch (e) {
                console.warn(`Failed to highlight ${language}:`, e);
                // Fallback to plain text if lang not supported
                setHtml(`<pre class="shiki bg-[#282a36] p-4 rounded text-white overflow-auto"><code>${code}</code></pre>`);
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
