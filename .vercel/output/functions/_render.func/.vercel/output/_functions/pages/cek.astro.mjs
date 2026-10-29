import { a as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_8HU8Ufti.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_PqYSUnJs.mjs';
export { renderers } from '../renderers.mjs';

const $$Cek = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Cek Nomor/Link - AwasScam", "description": "Cek apakah nomor telepon, link, atau akun terdaftar sebagai penipuan di database AwasScam." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" style="padding: 3rem 1.5rem; max-width: 700px;"> <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text); text-align: center;">Cek Nomor, Link & Akun</h1> <p style="color: var(--color-text-muted); text-align: center; margin-bottom: 2.5rem;">Masukkan nomor telepon, URL, username media sosial, atau nomor rekening untuk memeriksa database penipuan.</p> <form class="card" style="max-width: 100%;"> <div style="margin-bottom: 1.5rem;"> <label for="query" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--color-text);">Masukkan data yang ingin dicek</label> <div style="position: relative;"> <input type="text" id="query" name="query" placeholder="Contoh: 0812-3456-7890, bit.ly/xyz, @username, 1234567890 (rekening)" style="width: 100%; padding: 1rem 1rem 1rem 3rem; border: 2px solid var(--color-border); border-radius: var(--radius); font-size: 1rem; background: var(--color-bg); color: var(--color-text); outline: none; transition: border-color 0.2s;"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none;"> <circle cx="11" cy="11" r="8"></circle> <path d="M21 21l-4.35-4.35"></path> </svg> </div> <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.5rem;">Format didukung: nomor HP (08xx/628xx), URL, username (@), nomor rekening, email</p> </div> <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem;"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;"> <circle cx="11" cy="11" r="8"></circle> <path d="M21 21l-4.35-4.35"></path> </svg>
Cek Sekarang
</button> </form> <div style="margin-top: 2.5rem; padding: 1.5rem; background: var(--color-surface); border-radius: var(--radius); border: 1px solid var(--color-border);"> <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-text);">💡 Tips Pencarian</h3> <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; color: var(--color-text-muted); font-size: 0.875rem; list-style: none;"> <li>• Nomor HP: <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">081234567890</code> atau <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">6281234567890</code></li> <li>• Link: <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">bit.ly/xyz</code> atau <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">https://...</code></li> <li>• Username: <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">@namaakun</code> (Instagram, TikTok, Telegram)</li> <li>• Rekening: <code style="background: var(--color-bg); padding: 0.125rem 0.375rem; border-radius: 4px;">1234567890</code> (min. 8 digit)</li> </ul> </div> <div style="margin-top: 2rem; text-align: center; color: var(--color-text-muted); font-size: 0.875rem;"> <p>Belum ada di database? <a href="/lapor" style="font-weight: 600;">Lapor di sini</a> untuk membantu orang lain.</p> </div> </section> ` })}`;
}, "/home/hermes/awasscam/src/pages/cek.astro", void 0);

const $$file = "/home/hermes/awasscam/src/pages/cek.astro";
const $$url = "/cek";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cek,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
