import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContextMenuProps {
    next: () => void;
    prev: () => void;
    toggleOverview: () => void;
}

/**
 * ContextMenu Component
 * 
 * Provides a custom right-click menu for navigation.
 */
export function ContextMenu({ next, prev, toggleOverview }: ContextMenuProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setPosition({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };

        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] bg-slate-900 border border-slate-700 rounded shadow-2xl py-2 min-w-[160px] text-sm text-slate-200"
            style={{
                left: position.x,
                top: Math.min(position.y, window.innerHeight - 150) // Basic flip-up 
            }}
        >
            <button
                onClick={() => { next(); setVisible(false); }}
                className="w-full text-left px-4 py-2 hover:bg-blue-600 transition-colors flex justify-between items-center"
            >
                Next <span>Space</span>
            </button>
            <button
                onClick={() => { prev(); setVisible(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors flex justify-between items-center"
            >
                Previous <span>Left</span>
            </button>
            <div className="border-t border-slate-700 my-1" />
            <button
                onClick={() => { toggleOverview(); setVisible(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors flex justify-between items-center"
            >
                Overview <span>O</span>
            </button>
            <button
                onClick={() => { navigate('/print'); setVisible(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors flex justify-between items-center"
            >
                Print Mode <span>P</span>
            </button>
        </div>
    );
}
