import React, { useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import * as prod from 'react/jsx-runtime';

import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CodeBlock } from '../CodeBlock';
import { AnimatedComponent } from '../AnimatedComponent';

// Define custom components mapping here
const components = {
    h1: (props) => <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" {...props} />,
    h2: (props) => <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100" {...props} />,
    p: (props) => <p className="text-xl mb-4 leading-relaxed text-gray-600 dark:text-gray-300" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 space-y-2 mb-4 text-lg text-gray-700 dark:text-gray-300" {...props} />,
    li: (props) => <li className="pl-1" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />,

    // Shadcn Components (lowercase match for HTML tags)
    card: Card,
    cardheader: CardHeader,
    cardtitle: CardTitle,
    cardcontent: CardContent,
    button: Button,
    animatedcomponent: AnimatedComponent,

    // Code Blocks (Capture pre/code)
    pre: (props) => <div {...props} className="not-prose" />, // Remove prose styles from container
    code: CodeBlock
};

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export function SlideRenderer({ content }) {
    const processedContent = useMemo(() => {
        try {
            const file = unified()
                .use(remarkParse)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeReact, { ...production, components })
                .processSync(content);
            return file.result;
        } catch (e) {
            console.error("Markdown parsing error:", e);
            return <div className="text-red-500">Error rendering slide</div>;
        }
    }, [content]);

    return <div className="prose max-w-none">{processedContent}</div>;
}
