# FAQ

**The inspector says "No Chrome/Edge/Chromium found".**
Install one, or set `CHROME_PATH` to the executable, for example `CHROME_PATH="/usr/bin/chromium" node inspect.mjs index.html`.

**It says Node 22+ is required.**
`inspect.mjs` uses Node's built-in WebSocket client. Upgrade Node, or run only `lint.mjs` (Node 18+) and take screenshots with your own browser tool; say so in the report.

**A FAIL looks wrong for my page.**
Use `--allow <rule>` and state the reason. Examples: a brand logo that sits on a gradient, a deliberate third font.

**Why does `imagery` warn on my typographic page?**
It counts real pictures and videos. A purely typographic design may be deliberate: `--allow imagery`.

**Does it check backend, tests or performance?**
No. These skills cover visual and interaction quality and content completeness. They do not review server code, write tests or profile speed.

**Will it work with Tailwind, React, Vue, plain HTML?**
Yes. The skills read your project first and use its stack; the scripts inspect the rendered page, so they are framework-agnostic.

**Can I change the rules?**
Fork the repo. Rules are plain arrays in `lint.mjs`, and checks are inline in `inspect.mjs`. The `SKILL.md` files are the method; edit them to suit your taste.

**Is this affiliated with other design skills?**
No. It is independent. See the credit in the README.
