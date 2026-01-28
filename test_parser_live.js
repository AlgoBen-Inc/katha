import { parseSlides } from './src/utils/slideParser.js';

const markdown = `---
layout: title
---

# Slide 1

---

# Slide 2

---
layout: split
---

# Slide 3
* Item 1
* Item 2

---

<Card>Component</Card>
`;

console.log("--- Testing Parser ---");
const slides = parseSlides(markdown);
console.log(JSON.stringify(slides, null, 2));
