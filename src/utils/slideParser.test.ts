import { describe, test, expect } from "bun:test";
import { parseSlides } from "./slideParser";

describe("parseSlides", () => {
    test("splits slides by delimiter", () => {
        const markdown = `
# Slide 1
---slide---
# Slide 2
`;
        const slides = parseSlides(markdown);
        expect(slides.length).toBe(2);
        expect(slides[0].slots.default).toContain("# Slide 1");
        expect(slides[1].slots.default).toContain("# Slide 2");
    });

    test("extracts frontmatter and ID", () => {
        const markdown = `
---slide---
---
layout: center
id: my-custom-id
---
# Content
`;
        const slides = parseSlides(markdown);
        expect(slides[0].meta.layout).toBe("center");
        expect(slides[0].slug).toBe("my-custom-id");
    });

    test("generates slug from H1 if no ID provided", () => {
        const markdown = `
---slide---
# My Great Title
`;
        const slides = parseSlides(markdown);
        expect(slides[0].slug).toBe("my-great-title");
    });

    test("extracts slots", () => {
        const markdown = `
---slide---
Left Column
::right::
Right Column
`;
        const slides = parseSlides(markdown);
        expect(slides[0].slots.default).toBe("Left Column");
        expect(slides[0].slots.right).toBe("Right Column");
    });

    test("extracts speaker notes", () => {
        const markdown = `
---slide---
# Slide
<!-- Note: Don't forget to smile -->
`;
        const slides = parseSlides(markdown);
        expect(slides[0].notes).toBe("Note: Don't forget to smile");
        expect(slides[0].slots.default.trim()).toBe("# Slide"); // Notes removed from content
    });
});
