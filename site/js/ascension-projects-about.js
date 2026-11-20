import { initSiteShell } from './motion-system.js';
import { initTopographyField } from './topography-canvas.js';

const page = document.body.dataset.editorial;
initSiteShell(page);

initTopographyField({
  warp: 0.71,
  density: 9.6,
  energy: 0.28,
  focusX: 0.73,
  focusY: 0.48,
  visibleAt: page === 'about' ? '.about-essay-cover' : '.project-close'
});

function textElement(tag, value) {
  const element = document.createElement(tag);
  element.textContent = value;
  return element;
}

function renderStudy(template, study) {
  const article = template.content.firstElementChild.cloneNode(true);
  article.id = study.id;
  article.querySelector('h2').textContent = study.title;
  article.querySelector('.study-category').textContent = study.categoryLabel;
  article.querySelector('.study-summary').textContent = study.summary;
  const artwork = article.querySelector('.study-art img');
  if (study.visualSources?.length) {
    artwork.sizes = '(max-width: 900px) calc(100vw - 2.5rem), (max-width: 1520px) 62vw, 940px';
    artwork.srcset = study.visualSources.map(({ src, width }) => `${src} ${width}w`).join(', ');
  }
  artwork.src = study.visualPlate;
  artwork.alt = study.visualAlt;

  const controls = article.querySelector('.study-controls');
  const panel = article.querySelector('.study-context');
  const views = study.interfacePreview.views.map((view) => ({
    label: view.tab,
    heading: view.heading,
    rows: view.rows.map(({ name, detail }) => ({ title: name, detail }))
  }));
  views.push({
    label: 'Architecture',
    heading: 'How the system could be built',
    rows: study.architectureNotes.map((detail) => ({ detail }))
  });
  const buttons = views.map(({ label }, index) => {
    const button = textElement('button', label);
    button.type = 'button';
    button.className = 'ex-ui-tab';
    button.dataset.ex = study.id;
    button.dataset.vw = index < views.length - 1 ? String(index) : 'invariants';
    button.setAttribute('aria-controls', `view-${study.id}`);
    button.addEventListener('click', () => selectView(index));
    return button;
  });
  controls.append(...buttons);
  panel.id = `view-${study.id}`;

  function selectView(index) {
    const view = views[index];
    buttons.forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
    const examples = document.createElement('ul');
    for (const row of view.rows) {
      const item = document.createElement('li');
      if (row.title) item.append(textElement('strong', row.title));
      item.append(textElement('span', row.detail));
      examples.append(item);
    }
    panel.replaceChildren(textElement('h3', view.heading), examples);
  }

  selectView(0);
  return { article, category: study.category };
}

async function initGallery() {
  const response = await fetch('./data/projects.json');
  if (!response.ok) throw new Error('Project manifest unavailable');
  const manifest = await response.json();
  if (!manifest.exhibitions.length) return;
  const mount = document.getElementById('exhibitions-mount');
  const template = document.getElementById('project-study-template');
  const navigation = document.getElementById('projects-filter-tabs');
  const status = document.getElementById('project-match-count');
  const studies = manifest.exhibitions.map((study) => renderStudy(template, study));
  const cats = manifest.categories.filter(({ id }) => id === 'all' || studies.some(({ category }) => category === id));
  const filters = cats.map((category) => {
    const button = textElement('button', category.label);
    button.type = 'button';
    button.dataset.cat = category.id;
    button.setAttribute('aria-controls', mount.id);
    button.addEventListener('click', () => filterStudies(category.id));
    return button;
  });
  mount.replaceChildren(...studies.map(({ article }) => article));
  navigation.append(...filters);
  navigation.hidden = false;
  filterStudies('all');

  function filterStudies(id) {
    let count = 0;
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.cat === id)));
    for (const { article, category } of studies) {
      article.hidden = id !== 'all' && category !== id;
      if (!article.hidden) count++;
    }
    status.textContent = `${count} ${count === 1 ? 'study' : 'studies'} shown.`;
  }

  function revealAnchor() {
    const match = studies.find(({ article }) => `#${article.id}` === location.hash);
    if (!match) return;
    if (match.article.hidden) filterStudies('all');
    match.article.scrollIntoView({ block: 'start' });
  }

  if (location.hash) {
    await document.fonts.ready;
    revealAnchor();
  }
  window.addEventListener('hashchange', revealAnchor);
}

try {
  if (page === 'projects') await initGallery();
} catch {
  const reminder = textElement('p', 'The study previews could not load. The project summaries are still available.');
  reminder.className = 'wrap study-load-message';
  reminder.setAttribute('role', 'status');
  document.getElementById('exhibitions-mount').prepend(reminder);
} finally {
  window.__SITE_READY__ = true;
}
