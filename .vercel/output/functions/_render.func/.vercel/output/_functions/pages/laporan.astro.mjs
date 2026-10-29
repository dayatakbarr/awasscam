import { a as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_8HU8Ufti.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_PqYSUnJs.mjs';
export { renderers } from '../renderers.mjs';

const $$Laporan = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Daftar Laporan - AwasScam", "description": "Daftar laporan penipuan terverifikasi dari komunitas AwasScam. Filter berdasarkan jenis, status, dan waktu." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" style="padding: 3rem 1.5rem;"> <header style="margin-bottom: 2rem;"> <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text);">Daftar Laporan Penipuan</h1> <p style="color: var(--color-text-muted);">Laporan yang telah diverifikasi komunitas. Urutkan & filter untuk menemukan informasi yang dibutuhkan.</p> </header> <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; align-items: center;"> <div style="flex: 1; min-width: 250px; position: relative;"> <input type="search" id="search" placeholder="Cari nomor, link, kata kunci..." style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 2px solid var(--color-border); border-radius: var(--radius); font-size: 0.9375rem; background: var(--color-bg); color: var(--color-text); outline: none;"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none;"> <circle cx="11" cy="11" r="8"></circle> <path d="M21 21l-4.35-4.35"></path> </svg> </div> <select id="filterType" style="padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius); font-size: 0.9375rem; background: var(--color-bg); color: var(--color-text); outline: none; min-width: 180px;"> <option value="">Semua Jenis</option> <option value="investasi">Investasi Bodong</option> <option value="pinjol">Pinjol Ilegal</option> <option value="phishing">Phishing</option> <option value="belanja">Penipuan Belanja</option> <option value="lowongan">Lowongan Palsu</option> <option value="hadiah">Hadiah Palsu</option> </select> <select id="filterStatus" style="padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius); font-size: 0.9375rem; background: var(--color-bg); color: var(--color-text); outline: none; min-width: 160px;"> <option value="verified">Terverifikasi</option> <option value="pending">Menunggu Verifikasi</option> <option value="rejected">Ditolak</option> </select> </div> <div id="reportsList"> <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">Memuat laporan...</div> </div> <nav id="pagination" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;" aria-label="Pagination"></nav> </section> ` })} `;
}, "/home/hermes/awasscam/src/pages/laporan.astro", void 0);

const $$file = "/home/hermes/awasscam/src/pages/laporan.astro";
const $$url = "/laporan";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Laporan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
