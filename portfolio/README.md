# Portfolio

Modern, responsive portfolio with dark/light theme, animations, and a 3D hero.

## Quick start

- Windows: `start .\\portfolio\\index.html`
- Or serve locally:
  - Python: `python -m http.server 5173` → open `http://localhost:5173/portfolio/`
  - Node: `npx serve -s . --listen 5173` → open `http://localhost:5173/portfolio/`

## Customize

Edit `js/data.js` to set your name, role, about, social links, skills, projects, experience, and contact.

## Assets

Place your profile image in `assets/` and set `basics.profileImage`.

## Theme

Theme toggle cycles Auto → Dark → Light and persists.

## 3D

Three.js hero is in `js/three-hero.js`. Remove its script tag to disable.
