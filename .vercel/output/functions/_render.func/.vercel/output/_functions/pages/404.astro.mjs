import { a as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_8HU8Ufti.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_PqYSUnJs.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Halaman Tidak Ditemukan - AwasScam" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" style="padding: 6rem 1.5rem; text-align: center; min-height: 60vh; display: flex; flex-direction: column; justify-content: center;"> <h1 style="font-size: 6rem; font-weight: 700; color: var(--color-primary); line-height: 1; margin-bottom: 1rem;">404</h1> <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--color-text); margin-bottom: 1rem;">Halaman Tidak Ditemukan</h2> <p style="color: var(--color-text-muted); margin-bottom: 2rem; max-width: 400px; margin-left: auto; margin-right: auto;">Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.</p> <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;"> <a href="/" class="btn btn-primary">Kembali ke Beranda</a> <a href="/cek" class="btn btn-outline">Cek Nomor/Link</a> </div> </section> ` })}`;
}, "/home/hermes/awasscam/src/pages/404.astro", void 0);

const $$file = "/home/hermes/awasscam/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
