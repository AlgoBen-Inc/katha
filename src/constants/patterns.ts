/**
 * Application Constants & Regex Patterns
 * Central source of truth for parsing rules.
 */

// Delimiter for splitting slides in the markdown file
// Matches: ---slide--- surrounded by newlines
export const SLIDE_DELIMITER_REGEX = /(?:^|\n)---slide---(?:\n|$)/;

// Delimiter for splitting slots within a slide
// Matches: ::slotName::
export const SLOT_DELIMITER_REGEX = /(?:^|\n)::([a-z0-9_-]+)::(?:\n|$)/gi;

// Regex to capture HTML comments for speaker notes
// Matches: <!-- any content -->
export const NOTES_REGEX = /<!--([\s\S]*?)-->/g;

// Fallback Key for default content slot
export const DEFAULT_SLOT_KEY = 'default';

// Regex to find primary H1 for slug generation
export const FIRST_H1_REGEX = /^#\s+(.+)$/m;

// Navigation Keys
export const KEY_NEXT = 'ArrowRight';
export const KEY_PREV = 'ArrowLeft';
