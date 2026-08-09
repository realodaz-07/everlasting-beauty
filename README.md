# Everlasting Beauty Aesthetics — Website

A high-end, single-page marketing site for **Everlasting Beauty Aesthetics** (Quezon City),
built from content scraped from their [Facebook page](https://www.facebook.com/profile.php?id=61553950053744).

## Design
- **Vibe & palette** taken from the brand's own promo poster + logo: warm greige base,
  silver gradients, charcoal ink, and a gold accent. Elegant editorial serif (Cormorant
  Garamond) paired with a clean geometric sans (Jost).
- **Layout** follows the provided reference structure (centered logo nav, fanned hero
  gallery, feature row, mixed-size treatment grid, results/stats, about, contact) — the
  reference's colors were **not** used, only its layout.

## Structure
```
index.html            # the page
assets/css/styles.css # all styles (design tokens at the top)
assets/js/main.js     # sticky nav, mobile menu, scroll reveals, hero parallax
assets/img/           # logo + curated editorial photography
```

## Content (scraped)
- Tagline: *The Beauty that Lasts.*
- Signature packages: Extra Glow Facial (₱13,999), Lip Rejuvenation (₱8,999),
  Underarm Treatment (₱8,999), Scar-Free Leg Treatment (₱13,999).
- Permanent hair removal (unlimited / 1 year): Half Legs ₱17,999 · Full Legs ₱20,999 ·
  Brazilian ₱22,999 · Arms ₱14,999 · Beard ₱10,999 · Mustache ₱12,999.
- Contact: 1506 Joshua Jordan Plains, Quezon City · 0917 831 2324 · IG @everlastingbeauty.ph.
- Social proof: 100% recommend · 2.2K+ followers · 12 five-star reviews.

## Photography
Editorial stock photography (Unsplash, free license) was used as high-end placeholder
imagery, matching the brand's clean/glowing aesthetic. The client's own treatment photos
can be dropped into `assets/img/` (same filenames) to personalise before launch.
Testimonials are representative samples — replace with real attributed reviews before publishing.

## Notes
- The nav logo uses `mix-blend-mode: multiply` to sit on the greige background. For a
  perfectly clean mark, supply a transparent-PNG version of the logo.
- Fully responsive (desktop / tablet / mobile) with a slide-down mobile menu.

## Preview / Deploy
Open `index.html` in any browser, or serve the folder statically:
```
python3 -m http.server 8080   # then visit http://localhost:8080
```
Ready to deploy to any static host (Cloudflare Pages, Hostinger, etc.).
