---
layout: title
---

# Welcome to Katha

The developer-first presentation system.

<span className="text-gray-400">Press Arrow Keys to Navigate</span>

---slide---

# Why Katha?

*   **Markdown Based**: Write slides in your favorite editor.
*   **React Components**: Import and use React components directly.
*   **Themable**: Built with Tailwind CSS.
*   **Developer Friendly**: Code highlighting, Hot Module Reloading.

---slide---
---
layout: split
id: layouts-demo
---

# Layouts

Katha supports different layouts.

This is the **Split Layout**. It allows you to put content on the left...

::right::

# ...and content on the right.

Perfect for comparisons or code explanations.

---slide---
---
id: architecture-deep-dive
theme: neon
---

# Code Highlighting

Katha uses Shiki for beautiful code highlighting.

```javascript

// Example Code
function hello() {
  console.log("Hello Katha!");
}

```

---slide---

# Interactive Components

You can embed React components directly in your markdown!

<Card className="w-96 bg-slate-800 text-white border-none">
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={() => alert('Clicked!')}>Click Me</Button>
  </CardContent>
</Card>

---slide---

# Animations

Bring your slides to life with component-based animations.

<div className="flex gap-4">
    <AnimatedComponent animation="bounce">Bouncing</AnimatedComponent>
    <AnimatedComponent animation="pulse" duration={1}>Pulsing</AnimatedComponent>
    <AnimatedComponent animation="spin" className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center">Spinning</AnimatedComponent>
</div>

---slide---
---
layout: title
---

# Ready to Start?

Run:
`katha my-presentation.md`

[Documentation](https://github.com/algoben-inc/katha)
