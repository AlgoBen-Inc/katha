import matter from 'gray-matter';

const case1 = `---
layout: split
---
# Slide Content`;

const case2 = `---
# Slide Content (No FM)`;

const case3 = `---
layout: title
---`;

console.log("--- Case 1 (Valid FM) ---");
console.log(matter(case1));

console.log("\n--- Case 2 (Single Dash) ---");
try {
    console.log(matter(case2));
} catch (e) { console.log("Error:", e.message); }

console.log("\n--- Case 3 (Only FM) ---");
console.log(matter(case3));
