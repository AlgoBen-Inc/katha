# Katha 📖

> **The Developer-First Presentation System.**
> Write in Markdown. Render in React. Style with Tailwind.

It converts Markdown, code blocks, Mermaid diagrams, and structured content into web-based presentations — reproducibly and version-controlled.

Katha favors structure over design tools and treats presentations as code.
## ✨ Features

*   **Markdown First**: Write your content in standard Markdown.
*   **React Powered**: Import and use React components directly in your slides.
*   **Tailwind CSS**: Full customization using Tailwind utilities.
*   **Built-in Layouts**: Split columns, centered titles, and more.
*   **Animations**: declarative `<AnimatedComponent />` wrapper for Framer Motion.
*   **Code Highlighting**: Beautiful code blocks powered by Shiki (Dracula theme).
*   **Hot Reloading**: Instant updates as you type.

## 🚀 Quick Start

### Installation
Currently, Katha is a local tool. Clone the repo and link it globally:

```bash
git clone https://github.com/AlgoBen-Inc/katha.git
cd katha
npm install -g bun # If not installed
bun install
bun link
```

### Running a Presentation
To run the **Demo Tutorial**:
```bash
katha
```

To run **Your Own Slides**:
```bash
katha path/to/my-presentation.md
```

## 📝 Syntax Guide

### Slide Separation
Use `---slide---` to separate your slides.

```markdown
# Slide 1 Content

---slide---

# Slide 2 Content
```

### Slide Metadata (Frontmatter)
To add metadata like layouts, place a YAML block **immediately after** the slide separator.

```markdown
---slide---
---
layout: split
---

# Left Column Content...

::right::

# Right Column Content...
```

### Layouts
*   `default`: Standard title + content.
*   `title`: Centered, large text with gradient background.
*   `split`: Two-column layout. Use `::right::` to mark the start of the second column.

### Code Blocks
Standard markdown code blocks are supported. You can customize the background color using the component syntax:

```jsx
<CodeBlock className="language-js bg-slate-900">
console.log("Custom Background!");
</CodeBlock>
```

### Animations
Wrap content in `<AnimatedComponent>` to animate it.

```jsx
<AnimatedComponent animation="bounce" duration={1}>
  Hello World!
</AnimatedComponent>
```
Supported animations: `fadeIn`, `slideUp`, `slideRight`, `scaleUp`, `bounce`, `pulse`, `spin`.

## 🛠️ Development

If you want to contribute or modify Katha:

```bash
# Start the dev server manually
bun run dev

# Build the package
bun run build
```

## 📄 License
MIT
