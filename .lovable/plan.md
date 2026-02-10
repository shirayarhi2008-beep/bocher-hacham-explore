

# בוחר חכם (Bocher Hacham) — Israeli Candidate Research Platform

A Hebrew RTL web app helping Israeli voters explore, compare, and research Knesset candidates and party lists through interactive visualizations and smart filtering.

---

## 🌐 Global Layout & Navigation

- **RTL layout** throughout the entire app with Hebrew UI
- **Sticky header** with logo, navigation links (אנשים, רשימות, חקר), favorites counter (⭐ badge), and share menu
- **Mobile bottom navigation** bar with icons for People, Lists, and Explore
- **Share dropdown menu** with options: copy link, WhatsApp, Facebook, save as image, export PDF
- **Favorites drawer** (right sidebar) showing saved candidates with "share my picks" and "clear all" actions
- Favorites stored in **localStorage** for persistence across sessions

---

## 📄 Page 1: אנשים (People Grid)

- RTL search bar: "...חפש מועמד"
- Filter row with dropdowns: Gender (מגדר), Region (אזור), Party (מפלגה), and a "Surprise me" (🎲) random button
- 3-column responsive card grid (single column on mobile)
- Each card shows: photo placeholder, candidate name, party affiliation, and a favorite star toggle
- Infinite scroll loading more candidates as user scrolls
- ~120 mock candidates with realistic Hebrew data

---

## 📄 Page 2: רשימות (Party Lists)

- 2-column grid of party cards with logo, name, key stats, and a selection checkbox
- Selection counter showing "X/2 נבחרו" status
- "!השווה" (Compare) button appears when 2+ parties are selected (max 2)
- Comparison modal with side-by-side table showing metrics like gender ratio, average age, education levels, and experience
- Comparison modal can be opened also from the list modal itself (bottom). 

---

## 📄 Page 3: חקר (Explore Categories)

- Landing page with title "?מה חשוב לך" (What matters to you?)
- 3×2 grid of category cards with icons: Gender, Periphery, Professionalism, Education, Age, Seniority
- Each card links to a deep-dive detail page

---

## 📄 Page 4: Category Detail (e.g., Gender Deep-Dive)

- Breadcrumb navigation: חקר > מגדר
- Interactive **pie chart** (using Recharts) with hover tooltips and clickable segments
- "💡 Did you know?" insight box with a fun fact
- Ranking table showing parties sorted by the selected metric
- CTA button to filter the People page by the relevant criteria

---

## 📦 Data Layer

- Full mock dataset (~120 candidates across 10+ parties) with fields: name, photo, party, gender, region, age, education, seniority, profession
- Centralized data module structured for easy future migration to Supabase
- Filtering, sorting, and search logic abstracted into reusable hooks

---

## 🎨 Design & Style

DESIGN STYLE: Vibrant, Playful, Engaging (NOT minimalist/clean)

We want a design that is:
- COLORFUL - not minimalist or sterile
- Uses color strategically to highlight important elements
- Playful but not cluttered
- Inviting and fun to interact with
- Smooth, delightful animations throughout
- Makes users WANT to explore and engage

Visual characteristics:
- Rich color palette with vibrant accents
- Gradient backgrounds and overlays
- Colorful icons and illustrations. no emojies
- Strategic use of color to draw attention to CTAs and key data
- Visual hierarchy through color, not just size
- Generous use of white/negative space to prevent clutter despite colorfulness

Animation philosophy:
- Smooth micro-interactions on every interactive element
- Delightful hover states (color shifts, gentle lifts, subtle rotations)
- Satisfying click feedback
- Smooth transitions between states (300-400ms)
- Playful but purposeful - animations should guide attention
- Examples:
  * Cards lift and glow on hover
  * Stars sparkle when clicked
  * Numbers count up when revealed
  * Charts animate in progressively
  * Buttons have ripple effects
  * Drawer slides in with bounce easing
  * Filters cascade in staggered timing

Color usage examples:
- Primary CTAs: Vibrant gradients (not flat colors)
- Data visualizations: Bold, contrasting color schemes
- Category cards: Each with its own accent color
- Hover states: Color intensifies or shifts hue
- Active states: Glowing borders or backgrounds
- Success actions: Green pulse animation
- Badges and tags: Bright background colors

NOT minimalist - we want personality and energy!
Think: Duolingo's playfulness meets data visualization
NOT: Plain white cards with gray text
YES: Colorful cards with gradients, shadows, and life

Key principle: Strategic colorfulness
- Use color to guide the eye
- Important elements are vibrant
- Supporting elements are more muted
- Color creates visual hierarchy and flow- Responsive: desktop grid layouts collapse gracefully to single-column on mobile
- Consistent Hebrew typography with proper RTL alignment

