# AI Hack Day Hub

Create a modern, stunning, single-page, scrollable website for an event called "Hacktoberfest Hack Day Hamirpur". 

Design Aesthetic & UI Mix:
The UI should be a creative hybrid of the official Hacktoberfest website (retro-futuristic, neon accents, dark mode by default, terminal/monospace fonts) and the GDG Community platform (clean, accessible, rounded corners, professional event layouts with Google-style accent colors).

Tech Stack & Libraries to use:
- React (functional components)
- Tailwind CSS (for styling, strict dark mode)
- Framer Motion (for smooth scroll animations and hero effects)
- Lucide React (for icons)
- shadcn/ui (for standard components like cards, buttons, nav)

Global Layout Rules:
- A sticky top Navbar for smooth scrolling to sections: Home, About, Benefits, Prizes, Sponsors, Contact.
- Smooth scrolling behavior enabled on the whole page.
- Theme: "Open Source AI". Incorporate subtle Git/GitHub visual elements (like branching lines, commit dots, pull request icons) and AI elements (neural network nodes, glowing weights) throughout the backgrounds and section dividers.

Please build the following sections sequentially:

1. HERO SECTION:
- A striking full-screen (100vh) hero area.
- Animated background: Use Framer Motion to create a glowing Git branch animation or floating AI nodes that connect to each other in the background.
- Big Heading: "Hacktoberfest Hack Day Hamirpur"
- Subheading: "Build the Future with Open Source & Open-Weight AI"
- Date & Location tags: October 10, 2026 | Mini Auditorium, New Lecture Hall, NIT Hamirpur.
- Call to Action Buttons: "Register Now" (primary glowing button) and "Join Community" (secondary outline button).

2. ABOUT THE EVENT:
- Two-column layout. Left: Text content. Right: An interactive graphic or a terminal-style mock code window showing a mock Git commit or AI prompt.
- Content: "Presented by NIT Hamirpur Chapter : GDG Ludhiana in partnership with Major League Hacking (MLH). Get ready to innovate, build, and connect! Hacktoberfest Hack Day Hamirpur is a high-energy, one-day in-person mini hackathon hosted at NIT Hamirpur. This year's theme centers on open source and open-weight AI (like Gemma models). Whether you are a complete beginner, first-year student, or seasoned coder, there is a seat at the table for you. No prior open-source experience needed!"

3. WHAT IS THERE FOR YOU:
- A grid of 3 beautiful, interactive cards with hover effects (e.g., slight lift and a subtle neon border glow).
- Card 1 (Icon: Gift): "Prizes, Swag & Goodies" - Inclusive tracks, exclusive goodies, and awesome swags from MLH.
- Card 2 (Icon: Mic): "Community & Tech Talks" - Interactive workshops, expert-led talks on open-source and modern AI tools.
- Card 3 (Icon: Code): "Hands-on Mentorship" - Work with mentors to publish a working GitHub repo in just one day.

4. PRIZES SECTION:
- Big glowing heading centered: "Prize Pool".
- Create a highly reusable React component called `<PrizeCard />` so we can easily add more later.
- Display a demo row of 3 Prize Cards (e.g., "First Overall", "Best AI Hack using Gemma", "Best Beginner Hack").
- Each card should feature a 3D-looking trophy or medal icon, the prize title, and placeholder text for the reward description. Give the cards a glassmorphism effect.

5. OUR SPONSORS:
- Section with a subtle dot-grid background.
- Categorized sponsor tiers (use neat, center-aligned typography and placeholder logo boxes with glassmorphism effects).
- Community Partner: MLH (Major League Hacking)
- Title Sponsor: Gemma
- Technical Partners: xyz domain, OSEN, Eleven Labs
- Add grayscale-to-color hover transitions for the sponsor logos.

6. CALL FOR SPONSORSHIP:
- A beautifully designed "Support Us" banner or card spanning the width of the container.
- Text: "Want to empower the next generation of developers? Partner with us!"
- Buttons/Links: 
  - A WhatsApp button with the Lucide WhatsApp (or MessageCircle) icon linking to `https://wa.me/qr/3SSYXRFDEDARK1`
  - An Email button linking to `mailto:harshbhushan001@gmail.com`

7. FOOTER:
- Clean, minimal footer inspired by GDG design guidelines.
- Text: "Organised by NIT Hamirpur Chapter - GDG Ludhiana"
- Social media links (GitHub, LinkedIn, X/Twitter).
- Text at the bottom: "Made with ❤️ for the open-source community."

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
