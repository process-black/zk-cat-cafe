# How to Add a New Google Font to This Project

Whenever you want to add a new font, follow these steps (or prompt your LLM assistant to do them for you):

---

## 1. Import the Font in `layout.tsx`
- Import the font from `next/font/google` at the top of `src/app/layout.tsx` (e.g., `import { Delius_Unicase } from "next/font/google";`).
- Create a font variable using the font's function. Example:
  ```ts
  const deliusUnicase = Delius_Unicase({
    variable: "--font-delius-unicase",
    subsets: ["latin"],
    weight: ["400", "700"], // use available weights for the font
  });
  ```
- Add the font variable to the `<body>` class list:
  ```tsx
  <body className={`... ${deliusUnicase.variable} ...`}>
  ```

## 2. Add a CSS Variable and Utility Class in `globals.css`
- In `src/app/globals.css`, add the font to the `@theme inline` block:
  ```css
  --font-delius-unicase: 'Delius Unicase', cursive;
  ```
- Add a utility class for the font:
  ```css
  .font-delius-unicase {
    font-family: var(--font-delius-unicase);
  }
  ```

## 3. Add the Font to Tailwind Config
- In `tailwind.config.js`, extend the `fontFamily` theme:
  ```js
  theme: {
    extend: {
      fontFamily: {
        'delius-unicase': ["var(--font-delius-unicase)", "cursive"],
      },
    },
  },
  ```
- This enables you to use `className="font-delius-unicase"` as a Tailwind utility.

## 4. Create a Sample Page Using the Font
- Create a new file in `/samples`, e.g., `samples/font-demo.tsx`:
  ```tsx
  export default function FontDemo() {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-delius-unicase">Delius Unicase Sample</h1>
        <p className="mt-4 font-delius-unicase text-lg">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    );
  }
  ```
- Visit `/samples/font-demo` in your app to see the font in action.

---

**Tip:**
- Always restart your dev server after editing `tailwind.config.js` so Tailwind picks up new utility classes.
- You can use either the Tailwind utility (`font-delius-unicase`) or the custom CSS class (`font-delius-unicase`) in your components.
