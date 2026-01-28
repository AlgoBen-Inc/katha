import matter from 'gray-matter';
import {
    SLIDE_DELIMITER_REGEX,
    SLOT_DELIMITER_REGEX,
    NOTES_REGEX,
    DEFAULT_SLOT_KEY,
    FIRST_H1_REGEX
} from '../constants/patterns';
import { Slide, SlideSlots } from '../types';

/**
 * Parses raw markdown content into structured Slide objects.
 */
export function parseSlides(rawMarkdown: string): Slide[] {
    if (!rawMarkdown) return [];

    // 1. Split by explicit delimiter
    const chunks = rawMarkdown.split(SLIDE_DELIMITER_REGEX);

    const slides = chunks.map((chunk, index): Slide | null => {
        const trimmed = chunk.trim();
        if (!trimmed) return null;

        try {
            // 2. Parse individual slide frontmatter using gray-matter
            const parsed = matter(trimmed);

            // 3. Parse Slots and Notes
            const rawContent = parsed.content || "";
            const slots: SlideSlots = { [DEFAULT_SLOT_KEY]: "" };
            let notes = "";

            // Extract Notes
            const contentWithoutNotes = rawContent.replace(NOTES_REGEX, (match, capturedNotes) => {
                notes += capturedNotes.trim() + "\n";
                return ""; // Remove notes from renderable content
            });

            // Split by `::slotName::` pattern
            const parts = contentWithoutNotes.split(SLOT_DELIMITER_REGEX);

            // parts[0] is always the default content
            slots[DEFAULT_SLOT_KEY] = parts[0].trim();

            // Subsequent parts are pairs of [slotName, slotContent]
            for (let i = 1; i < parts.length; i += 2) {
                const name = parts[i];
                const content = parts[i + 1] || "";
                slots[name] = content.trim();
            }

            // ID Generation Strategy
            let slideId = parsed.data.id;

            if (!slideId) {
                // Try to find first H1
                const h1Match = rawContent.match(FIRST_H1_REGEX);
                if (h1Match) {
                    slideId = h1Match[1]
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-') // slugify
                        .replace(/(^-|-$)/g, '');
                }
            }

            return {
                id: index,
                slug: slideId || String(index + 1), // Ensure slug is present
                meta: parsed.data || {},
                content: rawContent,
                slots: slots,
                notes: notes.trim()
            };
        } catch (e) {
            console.error(`Slide ${index} Parsing Error:`, e);
            return {
                id: index,
                slug: String(index + 1),
                meta: {},
                style: {}, // Ensure style object exists
                content: trimmed,
                slots: { [DEFAULT_SLOT_KEY]: trimmed },
                notes: ""
            };
        }
    }).filter((slide): slide is Slide => slide !== null);

    return slides;
}
