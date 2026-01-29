import { useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
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
 * Remark plugin to transform container directives into HAST-compatible elements.
 * 
 * This is the Slidev-style pattern for custom components in Markdown.
 * Syntax: :::componentName[label]{attributes}
 * 
 * Example:
 * :::reveallist
 * - Item 1
 * - Item 2
 * :::
 * 
 * Becomes: <reveallist>...</reveallist>
 */
function remarkDirectiveToHtml() {
    return (tree: any) => {
        const visit = (node: any, parent: any, index: number) => {
            // Handle container directives (:::name ... :::)
            if (node.type === 'containerDirective') {
                // Convert to a generic HTML element that rehype-react can map
                node.data = node.data || {};
                node.data.hName = node.name; // Use directive name as tag name
                node.data.hProperties = node.attributes || {};
            }

            // Handle leaf directives (::name)
            if (node.type === 'leafDirective') {
                node.data = node.data || {};
                node.data.hName = node.name;
                node.data.hProperties = node.attributes || {};
            }

            // Handle text directives (:name[text])
            if (node.type === 'textDirective') {
                node.data = node.data || {};
                node.data.hName = 'span';
                node.data.hProperties = {
                    ...node.attributes,
                    'data-directive': node.name
                };
            }

            // Recurse into children
            if (node.children) {
                node.children.forEach((child: any, i: number) => visit(child, node, i));
            }
        };

        visit(tree, null, 0);
    };
}

/**
 * Remark plugin to capture code block meta strings.
 */
function remarkCodeMeta() {
    return (tree: any) => {
        const visit = (node: any) => {
            if (node.type === 'code' && node.meta) {
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.meta = node.meta;
            }
            if (node.children) node.children.forEach(visit);
        };
        visit(tree);
    };
}

/**
 * SlideRenderer Component
 * 
 * Renders raw markdown content into React components.
 * Uses `unified` ecosystem with directive support:
 * 
 * Pipeline: markdown → remarkParse → remarkDirective → remarkRehype → rehypeRaw → rehypeReact
 * 
 * Supports Slidev-style container directives:
 * :::componentName
 * content
 * :::
 */
export function SlideRenderer({ content }: SlideRendererProps) {
    const processedContent = useMemo(() => {
        try {
            const file = unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkDirective)
                .use(remarkDirectiveToHtml)
                .use(remarkCodeMeta)
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
