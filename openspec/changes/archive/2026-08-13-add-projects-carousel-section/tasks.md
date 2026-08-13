## 1. Placeholder data

- [x] 1.1 Add a local placeholder dataset of 4 example projects (name, description, stack tags, repo URL), following the existing pattern used for other mock data (e.g. `client/src/data/mock`)

## 2. Projects section component

- [x] 2.1 Create `client/src/components/sections/Projects.jsx` with `<section id="projects">`, a `SectionLabel`, and an `h2` heading
- [x] 2.2 Add previous/next navigation buttons next to the heading, wired to a `useRef` on the scroll container via `scrollBy({ left: ±320, behavior: 'smooth' })`
- [x] 2.3 Render the horizontally scrollable carousel container (`overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-behavior: smooth`)
- [x] 2.4 Render one fixed-width (~300px) card per project with `scroll-snap-align: start`

## 3. Project card content

- [x] 3.1 Display project name in mono font, bold, accent color
- [x] 3.2 Display the short description
- [x] 3.3 Render stack tags using the existing `Badge` component
- [x] 3.4 Render a repo link with a GitHub icon that opens in a new tab (`target="_blank" rel="noopener noreferrer"`)

## 4. Hover interaction

- [x] 4.1 Add hover styling: slight scale-up (~1.02), accent-colored glow (box-shadow), highlighted border, with a smooth transition (Tailwind transition classes or Framer Motion)

## 5. Integration

- [x] 5.1 Wire the `Projects` section into `client/src/App.jsx` in the appropriate position among existing sections
- [x] 5.2 Verify carousel scroll-snap, nav buttons, hover effects, and repo links work in the browser (light and dark theme)
