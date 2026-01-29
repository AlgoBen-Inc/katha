import { useEffect, useState } from 'react';
import { renderMermaid, THEMES } from 'beautiful-mermaid';

interface MermaidProps {
    code: string;
    theme?: string;
    className?: string;
}

/**
 * Mermaid Component
 * 
 * Renders Mermaid diagrams using beautiful-mermaid (SVG).
 */
export function Mermaid({ code, theme = 'dracula', className = '' }: MermaidProps) {
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function render() {
            try {
                // Get theme colors from beautiful-mermaid's THEMES registry
                // fallback to 'zinc' if requested theme isn't found
                const themeColors = (THEMES as any)[theme] || THEMES.zinc || { bg: '#ffffff', fg: '#27272a' };

                const result = await renderMermaid(code, {
                    ...themeColors,
                    transparent: true,
                    font: 'Inter, system-ui, sans-serif'
                });

                if (mounted) {
                    setSvg(result);
                    setError(null);
                }
            } catch (err) {
                console.error('Mermaid render error:', err);
                if (mounted) {
                    setError('Failed to render diagram');
                }
            }
        }

        render();

        return () => { mounted = false; };
    }, [code, theme]);

    if (error) {
        return (
            <div className="p-4 border border-red-500/20 bg-red-500/10 rounded text-red-500 text-sm">
                {error}
                <pre className="mt-2 text-xs opacity-50">{code}</pre>
            </div>
        );
    }

    if (!svg) {
        return (
            <div className="w-full h-40 bg-slate-900/50 animate-pulse rounded flex items-center justify-center text-slate-500">
                Rendering diagram...
            </div>
        );
    }

    return (
        <div
            className={`mermaid-diagram my-6 flex justify-center ${className}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
