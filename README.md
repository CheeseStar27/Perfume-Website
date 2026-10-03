# Perfume-Website

A five-page website for **Sillage**, a fictional small-batch perfume house. It's built with plain HTML, CSS and JavaScript: no frameworks, build step or dependencies.

## Pages

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Hero, the meaning of “sillage”, four featured fragrances, scent families, discovery set, materials teaser |
| Menu | `menu.html` | The full fragrance menu with prices for 30 / 50 / 100 ml, a scent-family filter, and sets & services |
| Showcase | `showcase.html` | A spotlight for each of the eight fragrances, with notes, longevity, sillage, season and when to wear it |
| Materials | `materials.html` | The fragrance pyramid, a filterable library of 23 raw materials, concentrations explained, sourcing promise |
| About Us | `about.html` | Brand story, values, how it’s made, key numbers, opening hours and contact |

## Project structure

```
├── index.html
├── menu.html
├── showcase.html
├── materials.html
├── about.html
├── css/
│   └── style.css      # all styles; colours and fonts are tokens at the top
├── js/
│   └── main.js        # bottle illustrations, mobile menu, filters, scroll reveal
└── assets/
    └── favicon.svg
```

## Run it locally

Open `index.html` in a browser, or serve the folder so every link behaves as it would online:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

1. Merge the work into `main`.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
4. The site will appear at `https://<your-username>.github.io/Perfume-Website/` after a minute or two.

## Customising

- **Brand name:** “Sillage” is a placeholder. Search and replace it across the HTML files. It also appears on the bottle labels, in `label()` inside `js/main.js`.
- **Colours and fonts:** edit the tokens at the top of `css/style.css`. Fonts load from Google Fonts in each page's `<head>`.
- **Fragrances and prices:** prices live in `menu.html`. Each fragrance also appears in `showcase.html` and, for the featured four, in `index.html`.
- **Bottle illustrations:** these are drawn by `js/main.js`, so no image files are needed. Any element like the one below becomes a bottle:

  ```html
  <div data-bottle="tall" data-liquid="#e3bf62" data-cap="gold" data-label="N°01"></div>
  ```

  Shapes are `tall`, `round` and `square`. Caps are `gold`, `black`, `wood` and `silver`.
- **Contact details:** `hello@sillage.example`, the opening hours and the prices (in USD) are placeholders. Replace them with real details before publishing.
