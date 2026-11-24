# vitepress-next-prev-nav

A VitePress plugin that automatically generates and displays **Previous / Next (`Prev / Next`)** navigation links for documentation pages based on your custom article list.

✨ **Key Features:**
- **Zero theme customization required**: 100% compatible out-of-the-box with the default VitePress theme via standard `frontmatter.prev` and `frontmatter.next`.
- **Built-in CLI (`gennav`)**: Automatically scans `.md` files in a target directory and generates navigation JSON files (`nav.json`) as well as a markdown table of contents (`mucluc.md`).
- **Multi-nav list support**: Easily configure separate navigation flows for different document categories or topics.

---

## 📦 Installation

```bash
npm install vitepress-next-prev-nav
# or
yarn add vitepress-next-prev-nav
# or
pnpm add vitepress-next-prev-nav
```

---

## 🚀 Usage (Single Step Setup)

Configure the plugin inside `.vitepress/config.ts` using `defineConfig` and `FilelistNav` exported from the package:

```ts
// .vitepress/config.ts
import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'

// List of articles in reading order
const myList = [
  { text: 'Table of Contents', link: '/guide/toc' },
  { text: 'Chapter 1: Introduction', link: '/guide/chapter-1' },
  { text: 'Chapter 2: Installation', link: '/guide/chapter-2' },
]

export default defineConfig({
  // ... Your other VitePress configuration options
  plugins: [
    FilelistNav(myList)
  ]
})
```

🎉 **That's it!** VitePress will automatically display the navigation buttons at the bottom of each documentation page in the list.

---

## 🛠 Auto-generate Navigation Lists with `gennav` CLI

Instead of manually constructing navigation arrays, use the `gennav` CLI tool to scan `.md` files in a folder automatically. It creates both `nav.json` and a markdown table of contents `mucluc.md`:

```bash
# Scan docs/feynman/ directory and generate docs/feynman/nav.json & docs/feynman/mucluc.md
npx gennav docs/feynman/

# Optionally specify custom output paths:
npx gennav docs/feynman/ -o docs/feynman/nav.json --toc docs/feynman/mucluc.md

```

### 📋 Role of `mucluc.md` (Table of Contents)

`mucluc.md` serves as a structured listing of all pages in your documentation collection or book—functioning just like the Table of Contents in a printed book:

```markdown
- [1. Chapter Title](/docs/feynman/01-chapter.md)
- [2. Next Chapter](/docs/feynman/02-chapter.md)
```

You can effortlessly embed this table of contents into your book's landing page or `index.md` using VitePress's native Markdown file inclusion:

```markdown
# My Book

<!--@include: ./meta/mucluc.md-->
```

This keeps your book's table of contents always in sync with your document structure without having to maintain links manually.

Then import the generated `nav.json` files into `.vitepress/config.ts`:

```ts
// .vitepress/config.ts
import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'
import feynmanNav from '../docs/feynman/nav.json'
import mathNav from '../docs/math/nav.json'

export default defineConfig({
  plugins: [
    // Pass multiple navigation lists as separate arguments:
    FilelistNav(feynmanNav, mathNav)

    // ...or pass them inside an array: FilelistNav([feynmanNav, mathNav])
  ]
})
```

---

## 💡 How It Works

The `FilelistNav` plugin hooks into the VitePress build and dev processes. It automatically calculates the previous (`prev`) and next (`next`) links based on their sequence in the provided list, then injects them into the page's frontmatter (`pageData.frontmatter.prev` & `pageData.frontmatter.next`).

Because of this, the VitePress Default Theme seamlessly detects the injected frontmatter and renders the navigation links at the end of each article.

---

## 🛠 Local Development & Testing

```bash
# Install dependencies
npm install

# Build TypeScript & CLI using tsup
npm run build

# Test locally with another VitePress project
npm link
# Inside your test VitePress project directory:
npm link vitepress-next-prev-nav
```

### Project Structure

```
vitepress-next-prev-nav/
├── bin/
│   └── gennav.ts           # CLI entry point
├── src/
│   ├── index.ts            # Main package entry point (exports FilelistNav, defineConfig)
│   ├── core/
│   │   └── filelist-nav.ts # Core logic for frontmatter prev/next calculation
│   ├── cli/
│   │   └── generate.ts     # Directory scanning logic for gennav CLI
│   └── theme/              # Optional Vue UI component
│       ├── index.js        # registerNextPrevNav(app)
│       ├── NextPrevNav.vue # Custom UI component
│       └── useNextPrevNav.js
```

---

## 📄 License

[MIT](LICENSE)
