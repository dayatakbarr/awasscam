import { a as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_8HU8Ufti.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_PqYSUnJs.mjs';
export { renderers } from '../../renderers.mjs';

const getStaticPaths = async () => {
  return [];
};
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Detail Laporan - AwasScam", "description": "Detail laporan penipuan terverifikasi dengan bukti, kronologi, dan informasi pelaku." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" style="padding: 3rem 1.5rem; max-width: 800px;"> <nav style="margin-bottom: 2rem;"> <a href="/laporan" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">← Kembali ke Daftar</a> </nav> <div id="reportContainer"> <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">Memuat detail laporan...</div> </div> <section class="container" style="padding: 2rem 1.5rem; max-width: 800px; text-align: center; background: var(--color-surface); border-radius: var(--radius); margin-top: 2rem;"> <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--color-text); margin-bottom: 0.5rem;">Punya pengalaman serupa?</h3> <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Tambahkan komentar atau bukti Anda untuk memperkuat laporan ini.</p> <a href="/lapor" class="btn btn-primary">Lapor Sekarang</a> </section> </section> ` })} `;
}, "/home/hermes/awasscam/src/pages/laporan/[id].astro", void 0);

const $$file = "/home/hermes/awasscam/src/pages/laporan/[id].astro";
const $$url = "/laporan/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
