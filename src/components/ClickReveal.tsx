/**
 * ClickReveal Component
 * 
 * Reveals its children based on the current step in the presentation.
 * Uses the StepContext to determine visibility.
 * 
 * Architecture:
 * - Pure presentational component (no side effects)  
 * - Visibility determined by comparing `at` prop with `currentStep` from context
 * - Step count is declared in frontmatter (`clicks: N`)
 * 
 * Usage:
 * ```markdown
 * ---
 * clicks: 3
 * ---
 * 
 * <ClickReveal at={1}>First item</ClickReveal>
 * <ClickReveal at={2}>Second item</ClickReveal>  
 * <ClickReveal at={3}>Third item</ClickReveal>
 * ```
 * 
 * @module components/ClickReveal
 */
import React, { ReactNode, createContext, useContext, CSSProperties } from 'react';

// ============================================================
// Step Context
// ============================================================

/**
 * Context value for step-based animations.
 * currentStep: 0 = base state, 1+ = reveals
 * totalSteps: Total number of steps declared in frontmatter
 */
interface StepContextValue {
    currentStep: number;
    totalSteps: number;
}

/**
 * Default context shows all elements (for print/export views).
 * currentStep = Infinity means all ClickReveal elements are visible.
 */
export const StepContext = createContext<StepContextValue>({
    currentStep: Infinity,
    totalSteps: 0
});

/**
 * Hook to access the current step state.
 */
export function useStep(): StepContextValue {
    return useContext(StepContext);
}

// ============================================================
// ClickReveal Component
// ============================================================

interface ClickRevealProps {
    /**
     * Content to reveal.
     */
    children: ReactNode;

    /**
     * Step number at which this element becomes visible.
     * Steps are 1-indexed. If not provided, defaults to 1.
     * Accepts string (from markdown), number, or object (parser artifact).
     */
    at?: number | string | object;

    /**
     * If true, element is visible UNTIL this step, then hidden.
     * Useful for "show then replace" animations.
     */
    hide?: boolean;

    /**
     * Additional CSS classes for the wrapper element.
     */
    className?: string;
}

/**
 * ClickReveal - Step-based content visibility component.
 * 
 * Renders content that appears/disappears based on navigation steps.
 * Pure component with no side effects.
 */
export function ClickReveal({
    children,
    at = 1,
    hide = false,
    className = ''
}: ClickRevealProps): React.ReactElement {
    const { currentStep } = useStep();

    // Parse `at` prop - markdown parsers pass it as string (e.g., at="1")
    // Use string syntax in markdown: <ClickReveal at="1">
    let stepNum: number;

    if (typeof at === 'string') {
        // Primary case: markdown passes string props
        // Strip curly braces if present (parser artifact: "{1}" instead of "1")
        const cleaned = at.replace(/[{}]/g, '');
        stepNum = parseInt(cleaned, 10);
    } else if (typeof at === 'number') {
        // Direct React usage with number
        stepNum = at;
    } else if (typeof at === 'object' && at !== null) {
        // Fallback: JSX expression at={1} becomes object in some parsers
        const keys = Object.keys(at);
        stepNum = keys.length > 0 ? parseInt(keys[0], 10) : 1;
    } else {
        stepNum = 1;
    }
    if (Number.isNaN(stepNum)) stepNum = 1;

    // Determine visibility based on step comparison
    const isVisible = hide
        ? currentStep < stepNum   // Hide mode: visible until step
        : currentStep >= stepNum; // Show mode: visible from step onwards

    // Styles for smooth transitions
    const style: CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none'
    };

    return (
        <span
            className={`click-reveal ${className}`.trim()}
            style={style}
            aria-hidden={!isVisible}
            data-step={at}
        >
            {children}
        </span>
    );
}

// ============================================================
// RevealList Component
// ============================================================

interface RevealListProps {
    /**
     * List items that will be revealed sequentially.
     * Each direct child gets an auto-incrementing step number.
     */
    children: ReactNode;

    /**
     * Starting step number for the first child.
     * Defaults to 1.
     */
    startAt?: number;

    /**
     * Additional CSS classes for the container.
     */
    className?: string;
}

/**
 * RevealList - Automatically wraps each child in a ClickReveal.
 * 
 * Convenience component for revealing list items sequentially.
 * 
 * Usage:
 * ```jsx
 * <RevealList>
 *   <li>First (at step 1)</li>
 *   <li>Second (at step 2)</li>
 *   <li>Third (at step 3)</li>
 * </RevealList>
 * ```
 */
export function RevealList({
    children,
    startAt = 1,
    className = ''
}: RevealListProps): React.ReactElement {
    let currentOffset = 0;

    /**
     * Recursively wraps children in ClickReveal components.
     * If a child is a list (ul/ol), it wraps its li children individually.
     */
    const wrapChildren = (node: ReactNode): ReactNode => {
        return React.Children.map(node, (child) => {
            if (!React.isValidElement(child)) return child;

            // If it's a list, we want to reveal its items, not the list itself
            if (child.type === 'ul' || child.type === 'ol') {
                const listChild = child as React.ReactElement<any>;
                return React.cloneElement(listChild, {
                    children: wrapChildren(listChild.props.children)
                });
            }

            // If it's an li or any other direct child of RevealList, wrap it
            const step = startAt + currentOffset;
            currentOffset++;

            return (
                <ClickReveal at={step}>
                    {child}
                </ClickReveal>
            );
        });
    };

    return (
        <div className={`reveal-list ${className}`.trim()}>
            {wrapChildren(children)}
        </div>
    );
}
