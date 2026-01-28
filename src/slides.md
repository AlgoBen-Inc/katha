---
layout: title
---

# Welcome to Antigravity v2
## The "Code-First" Presentation System

<!--
Welcome everyone!
This is the new "Speaker View" driven by our React engine.
Points to cover:
1. Speed
2. Control
3. React Ecosystem
-->

![Test Asset](/assets/placeholder.png)

---slide---

# Why Code-First?

*   **Version Control**: Your slides are just text.
*   **Component Power**: Use React components directly.
*   **Speed**: No more dragging boxes.

---slide---

---
layout: split
---
  

# UI Components

We can now use **Shadcn UI** directly in markdown!

<Card className="w-[350px] mt-8">
  <CardHeader>
    <CardTitle>Interactive Elements</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="mb-4 text-sm text-gray-500">
      This is a real React component rendered from Markdown.
    </p>
    <Button>Click Me</Button>
    <Button variant="destructive" className="ml-2">Danger</Button>
  </CardContent>
</Card>

---slide---

console.log("It works!");
```

---slide---

# Syntax Highlighting

```javascript
import React from 'react';

function App() {
  return (
    <div className="p-4">
      <h1>Hello from Shiki!</h1>
      <p>This code is highlighted at runtime.</p>
    </div>
  );
}
```

---slide---

# Conclusion

It works!

---slide---

---
layout: split
---

# Split Layout Demo

This content is on the **left**.

- Bullet 1
- Bullet 2

::right::

# Right Side

This content is on the **right**.

<Card>
  <CardHeader><CardTitle>Dynamic Slot</CardTitle></CardHeader>
  <CardContent> It works! </CardContent>
</Card>
