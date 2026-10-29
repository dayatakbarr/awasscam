# AwasScam

Platform komunitas untuk mengecek & melaporkan penipuan online (investasi bodong, pinjol ilegal, phishing, dll). Deploy gratis di **Cloudflare Pages**.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server (localhost:4321)
npm run dev

# Build production (output ke ./dist/)
npm run build

# Preview build locally
npm run preview
```

## 📁 Struktur Project

```
awasscam/
├── public/                 # Static assets (favicon, robots.txt, dll)
├── src/
│   ├── components/         # Reusable UI components
│   ├── layouts/            # BaseLayout.astro (layout utama)
│   ├── pages/              # Routes (file-based routing)
│   │   ├── index.astro     # Beranda
│   │   ├── cek.astro       # Cek nomor/link
│   │   ├── lapor.astro     # Form lapor penipuan
│   │   ├── laporan.astro   # Daftar laporan
│   │   ├── laporan/[id].astro  # Detail laporan (dynamic route)
│   │   └── 404.astro       # Halaman tidak ditemukan
│   ├── styles/             # Global CSS (jika perlu)
│   └── scripts/            # Client-side JS (jika perlu)
├── astro.config.mjs        # Konfigurasi Astro
├── tsconfig.json           # TypeScript config
├── package.json
└── .gitignore
```

## ☁️ Deploy ke Cloudflare Pages (Gratis)

### Otomatis via GitHub (Rekomendasi)

1. Push repo ke GitHub
2. Buka [Cloudflare Pages](https://dash.cloudflare.com/pages)
3. **Create a project** → **Connect to Git** → Pilih repo `awasscam`
4. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (atau folder project jika di subfolder)
5. **Save and Deploy** → Selesai! URL gratis: `https://awasscam.pages.dev`

### Manual via Wrangler CLI

```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Build & deploy
npm run build
wrangler pages deploy dist --project-name=awasscam
```

## 🔧 Konfigurasi Tambahan

### Custom Domain (Gratis)
Di Cloudflare Pages → **Custom domains** → Add domain → Ikuti instruksi DNS.

### Environment Variables
Di Cloudflare Pages → **Settings** → **Environment variables** (untuk API keys, database URL, dll).

### Functions (API/Backend)
Buat folder `src/pages/api/` untuk serverless functions (Edge runtime).

```astro
// src/pages/api/check.ts
export async function GET({ url }) {
  const query = url.searchParams.get('q');
  // Query database / external API
  return new Response(JSON.stringify({ results: [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## 📝 Todo / Roadmap

- [ ] Database (Cloudflare D1 / KV / R2) untuk menyimpan laporan
- [ ] API endpoint untuk pencarian (`/api/check`)
- [ ] Admin panel verifikasi laporan
- [ ] Email notification (Cloudflare Email Workers / Resend / SendGrid)
- [ ] Rate limiting & spam protection
- [ ] PWA (offline support)
- [ ] Dark mode toggle
- [ ] RSS feed laporan terbaru
- [ ] Sitemap.xml otomatis

## 🛡️ Keamanan & Privasi

- Tidak menyimpan data pribadi pelapor (anonim)
- Validasi & sanitasi input di client & server
- CSP headers via `_headers` file
- Rate limit di Cloudflare (gratis)

## 📄 Lisensi

MIT License — bebas digunakan, dimodifikasi, didistribusikan.

---

**Dibangun dengan** ❤️ **menggunakan [Astro](https://astro.build) + [Cloudflare Pages](https://pages.cloudflare.com)**