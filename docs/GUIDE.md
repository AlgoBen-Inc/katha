# Antigravity Presentation System v2 - User Guide

Welcome to the "Code-First" presentation system. This guide documents how to create slides, use layouts, and integrate rich components.

## 1. Slide Structure

### Delimiters
We use **explicit delimiters** to separate slides. This avoids ambiguity with horizontal rules or frontmatter.

```markdown
# Slide 1 Content...

---slide---

# Slide 2 Content...
```

### Metadata (Frontmatter)
Use standard YAML frontmatter **immediately after** the slide delimiter (or at the start of the file) to configure the slide.

```markdown
---slide---

---
layout: split
---

# Title shows on left
Content shows on right...
```

## 2. Layouts

Currently supported layouts:

| Layout | Description |
| :--- | :--- |
| `default` | Standard centered content. Used if no layout is specified. |
| `title` | Large, centered title text. Ideal for opening slides. |
| `split` | Two-column layout. The FIRST top-level heading (`#`) becomes the left column. Everything else goes right. |

## 3. Rich Components (Shadcn UI)

You can use Shadcn React components directly in your Markdown.

**Supported Components:**
- `<Button>Click Me</Button>`
- `<Card>...</Card>` (with `CardHeader`, `CardTitle`, `CardContent`)

**Example:**
```jsx
<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Action</Button>
  </CardContent>
</Card>
```

## 4. Code Blocks (Coming Soon)
Native syntax highlighting using Shiki.

```javascript
console.log("Hello World");
```
