import matter from 'gray-matter';

export function parseSlides(rawMarkdown) {
    if (!rawMarkdown) return [];

    // 1. Split by explicit `---slide---` delimiter
    // The regex handles optional surrounding whitespace
    const chunks = rawMarkdown.split(/(?:^|\n)---slide---(?:\n|$)/);

    const slides = chunks.map((chunk, index) => {
        const trimmed = chunk.trim();
        if (!trimmed) return null;

        try {
            // 2. Parse individual slide frontmatter using gray-matter
            const parsed = matter(trimmed);

            // 3. Parse Slots and Notes
            const rawContent = parsed.content || "";
            const slots = { default: "" };
            let notes = "";

            // Extract Notes: look for <!-- ... -->
            const notesRegex = /<!--([\s\S]*?)-->/g;
            const contentWithoutNotes = rawContent.replace(notesRegex, (match, capturedNotes) => {
                notes += capturedNotes.trim() + "\n";
                return ""; // Remove notes from renderable content
            });

            // Split by `::slotName::` pattern
            const slotRegex = /(?:^|\n)::([a-z0-9_-]+)::(?:\n|$)/gi;
            const parts = contentWithoutNotes.split(slotRegex);

            // parts[0] is always the default content (before any slot)
            slots.default = parts[0].trim();

            // Subsequent parts are pairs of [slotName, slotContent]
            for (let i = 1; i < parts.length; i += 2) {
                const name = parts[i];
                const content = parts[i + 1] || "";
                slots[name] = content.trim();
            }

            return {
                id: index,
                meta: parsed.data || {},
                content: rawContent, // Keep raw for backward compat if needed
                slots: slots,        // Structured content
                notes: notes.trim()  // Speaker notes
            };
        } catch (e) {
            console.error(`Slide ${index} Parsing Error:`, e);
            return {
                id: index,
                meta: {},
                style: {}, // Ensure style object exists
                content: trimmed,
                slots: { default: trimmed },
                notes: ""
            };
        }
    }).filter(slide => slide !== null);

    return slides;
}
