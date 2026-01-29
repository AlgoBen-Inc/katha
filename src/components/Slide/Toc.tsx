import { useNavigate } from 'react-router-dom';
import { useDeck } from '../../hooks/useDeck';

/**
 * Toc Component
 * 
 * Automatically generates a Table of Contents based on slide titles.
 */
export function Toc() {
    const { slides, loading } = useDeck();
    const navigate = useNavigate();

    if (loading) return <div className="animate-pulse h-20 bg-slate-100 rounded" />;

    // Filter slides that have titles (from frontmatter or H1)
    const tocItems = slides
        .map((slide, index) => ({
            title: slide.meta?.title as string | undefined,
            index: index + 1,
            slug: slide.slug
        }))
        .filter(item => item.title);

    return (
        <nav className="toc my-8">
            <ul className="space-y-4">
                {tocItems.map((item) => (
                    <li key={item.index} className="flex gap-4 items-baseline group">
                        <span className="text-sm font-mono text-slate-400 opacity-60 w-8">
                            {String(item.index).padStart(2, '0')}
                        </span>
                        <button
                            onClick={() => navigate(`/${item.index}`)}
                            className="text-left py-1 text-slate-600 hover:text-blue-500 hover:underline transition-colors"
                        >
                            {item.title}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
