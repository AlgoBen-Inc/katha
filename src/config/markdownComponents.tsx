
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CodeBlock } from '../components/CodeBlock';
import { Toc } from '../components/Slide/Toc';
import { AnimatedComponent } from '../components/AnimatedComponent';
import { ClickReveal, RevealList } from '../components/ClickReveal';

/**
 * Default Component Map for Rehype React.
 * Maps HTML tags (and custom tags/components) to React components.
 * 
 * Future: We can export different maps for different themes.
 */
export const defaultComponents = {
    // Top-Level Typography
    // H1: Uses Accent Color for gradient or solid
    h1: (props: any) => (
        <h1
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent leading-tight py-2"
            style={{
                backgroundImage: `linear-gradient(to right, var(--k-accent), var(--k-text-primary))`
            }}
            {...props}
        />
    ),
    h2: (props: any) => (
        <h2
            className="text-3xl font-semibold mb-4"
            style={{ color: 'var(--k-text-primary)' }}
            {...props}
        />
    ),
    p: (props: any) => (
        <p
            className="text-xl mb-4 leading-relaxed"
            style={{ color: 'var(--k-text-secondary)' }}
            {...props}
        />
    ),
    ul: (props: any) => (
        <ul
            className="list-disc pl-6 space-y-2 mb-4 text-lg"
            style={{ color: 'var(--k-text-secondary)' }}
            {...props}
        />
    ),
    li: (props: any) => <li className="pl-1" {...props} />,
    blockquote: (props: any) => (
        <blockquote
            className="border-l-4 pl-4 italic my-4"
            style={{
                borderColor: 'var(--k-accent)',
                color: 'var(--k-text-secondary)'
            }}
            {...props}
        />
    ),

    // Shadcn Components (lowercase match for HTML tags)
    card: Card,
    cardheader: CardHeader,
    cardtitle: CardTitle,
    cardcontent: CardContent,
    button: (props: any) => (
        <Button
            className="bg-[var(--k-accent)] text-white hover:opacity-90 transition-all font-semibold px-8 py-4 rounded-xl shadow-lg border-2 border-white/10 hover:scale-105 active:scale-95"
            {...props}
        />
    ),
    animatedcomponent: AnimatedComponent,
    animated: AnimatedComponent,

    // Click Reveal (Step Animations)
    clickreveal: ClickReveal,
    reveallist: RevealList,

    // Navigation
    toc: Toc,

    // Code Blocks (Capture pre/code)
    pre: (props: any) => <div {...props} className="not-prose" />,
    code: CodeBlock
};
