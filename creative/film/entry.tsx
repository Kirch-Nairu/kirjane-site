// Bundled once, on demand, for the Kirjane Salryn page. NOT a second SPA.
// The film is mounted into a Shadow DOM to keep its POS-styled CSS isolated
// from the seven-page site's approved editorial identity and global directors.
import React from 'react';
import {createRoot} from 'react-dom/client';
import Film from './src/App';
import baseCss from './src/styles.css?inline';
import cinemaCss from './src/cinema-fullscreen.css?inline';

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();
export function mountSalrynCinema(host: HTMLElement) {
  if (roots.has(host)) return;
  const shadow = host.shadowRoot ?? host.attachShadow({mode:'open'});
  const stylesheet = document.createElement('style');
  stylesheet.textContent = "\n/* React island inside shadow root: global corporate CSS cannot leak in. */\n:host{display:block;position:relative;width:100%;color:#f1f5ee;background:#07131a;font-family:\"Segoe UI\",system-ui,-apple-system,sans-serif;font-synthesis:none;-webkit-font-smoothing:antialiased}\n:host *,:host *::before,:host *::after{box-sizing:border-box}\n.experience{color:#f1f5ee;min-height:0;background:#07131a}\n:host a{color:inherit}\n:host button{font-family:inherit}\n:host([data-cinema-load=\"error\"]){background:#07131a}\n@media(prefers-reduced-motion:reduce){:host{scroll-behavior:auto}}\n" + '\n' + baseCss + '\n' + cinemaCss;
  shadow.append(stylesheet);
  const mount = document.createElement('div');
  mount.className = 'salryn-film-root';
  shadow.append(mount);
  const root = createRoot(mount);
  roots.set(host,root);
  root.render(<Film />);
  host.dataset.cinemaLoad='ready';
  window.__KIRJANE_SALRYN_FILM__={version:'R5 site integration',source:'d21dbfcf2a4f24f8eba2547791a0164a2ca63521',shadow:true,standalone:false};
}
