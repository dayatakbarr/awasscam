import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_Hl9iWPSF.mjs';
import { manifest } from './manifest_BDbFeI2e.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/report/_id_.astro.mjs');
const _page3 = () => import('./pages/api/report.astro.mjs');
const _page4 = () => import('./pages/api/reports.astro.mjs');
const _page5 = () => import('./pages/cek.astro.mjs');
const _page6 = () => import('./pages/lapor.astro.mjs');
const _page7 = () => import('./pages/laporan/_id_.astro.mjs');
const _page8 = () => import('./pages/laporan.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/report/[id].ts", _page2],
    ["src/pages/api/report.ts", _page3],
    ["src/pages/api/reports.ts", _page4],
    ["src/pages/cek.astro", _page5],
    ["src/pages/lapor.astro", _page6],
    ["src/pages/laporan/[id].astro", _page7],
    ["src/pages/laporan.astro", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "ff481db6-f040-4ae6-9eb2-468b20c2aef4",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
