import { useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import * as prod from 'react/jsx-runtime';
import { defaultComponents } from '../../config/markdownComponents';

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

interface SlideRendererProps {
    content: string;
}

/**
 * SlideRenderer Component
 * 
 * Renders raw markdown content into React components.
 * Uses `unified` ecosystem (remark -> rehype -> react).
 */
export function SlideRenderer({ content }: SlideRendererProps) {
    const processedContent = useMemo(() => {
        try {
            const file = unified()
                .use(remarkParse)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeReact, { ...production, components: defaultComponents })
                .processSync(content);
            return file.result;
        } catch (e) {
            console.error("Markdown parsing error:", e);
            return <div className="text-red-500">Error rendering slide</div>;
        }
    }, [content]);

    return <div className="prose max-w-none">{processedContent}</div>;
}
