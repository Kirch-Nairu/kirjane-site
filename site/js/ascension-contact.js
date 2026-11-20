import { initSiteShell, isReducedMotion } from './motion-system.js';

initSiteShell('contact');
if (isReducedMotion()) document.body.dataset.contactMotion = 'static';

const form = document.getElementById('contact-brief-form');
const topicInputs = Array.from(form.querySelectorAll('input[name="topic"]'));
const scopeNodes = document.querySelectorAll('#contact-scope-diagram [data-scope-node]');
const scopeSummary = document.getElementById('c-scope-summary');
const phoneSummary = document.getElementById('c-phone-summary');
const topicGroup = document.getElementById('c-topic-group');
const scopeInput = document.getElementById('c-scope');
const contactName = document.getElementById('c-name');
const organization = document.getElementById('c-org');
const sector = document.getElementById('c-sector');
const errorSummary = document.getElementById('c-error');
const result = document.getElementById('c-result');
const resultTitle = document.getElementById('brief-result-title');
const resultText = document.getElementById('c-brief-pre');
const copyNote = document.getElementById('c-copy-note');
let attempted = false;

function selectedTopics() {
  return topicInputs.filter((input) => input.checked);
}

function updateScope() {
  const selected = selectedTopics();
  const keys = new Set(selected.map((input) => input.dataset.scope));
  for (const node of scopeNodes) {
    const mark = node.querySelector('rect');
    if (keys.has(node.dataset.scopeNode)) mark.setAttribute('stroke', '#D3F66B');
    else mark.removeAttribute('stroke');
  }
  const summary = selected.length
    ? selected.map((input) => input.value).join(' · ')
    : 'Choose a topic to start.';
  scopeSummary.textContent = summary;
  phoneSummary.textContent = summary;
}

const query = new URLSearchParams(location.search);
if (query.get('topic') === 'salryn') {
  document.getElementById('chk-salryn').checked = true;
  document.getElementById('chk-software').checked = false;
  const details = [
    ['Industry', query.get('industry')],
    ['Sites and workstations', query.get('scale')],
    ['Capabilities to discuss', query.get('caps')]
  ].filter(([, value]) => value);
  if (details.length) {
    scopeInput.value = ['Salryn inquiry', ...details.map(([label, value]) => `${label}: ${value}`)].join('\n');
  }
}
updateScope();

function showFieldError(element, errorId, hintId, invalid) {
  document.getElementById(errorId).hidden = !invalid;
  if (invalid) element.setAttribute('aria-invalid', 'true');
  else element.removeAttribute('aria-invalid');
  const description = [hintId, invalid && errorId].filter(Boolean).join(' ');
  if (description) element.setAttribute('aria-describedby', description);
  else element.removeAttribute('aria-describedby');
}

function validate() {
  const missingTopic = selectedTopics().length === 0;
  const missingScope = !scopeInput.value.trim();
  const missingName = !contactName.value.trim();
  showFieldError(topicGroup, 'c-topic-error', 'c-topic-hint', missingTopic);
  if (missingTopic) topicInputs[0].setAttribute('aria-describedby', 'c-topic-error');
  else topicInputs[0].removeAttribute('aria-describedby');
  showFieldError(scopeInput, 'c-scope-error', 'c-scope-hint', missingScope);
  showFieldError(contactName, 'c-name-error', '', missingName);
  const invalid = [
    missingTopic && topicInputs[0],
    missingScope && scopeInput,
    missingName && contactName
  ].filter(Boolean);
  errorSummary.hidden = !invalid.length;
  return invalid[0];
}

function clearBrief() {
  result.hidden = true;
  result.classList.remove('visible');
  resultText.textContent = '';
  copyNote.textContent = '';
}

form.addEventListener('input', (event) => {
  if (event.target.name === 'topic') updateScope();
  if (attempted) validate();
  if (!result.hidden) clearBrief();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  attempted = true;
  const invalidField = validate();
  if (invalidField) {
    errorSummary.textContent = 'Complete the required fields to create your brief.';
    invalidField.focus();
    return;
  }

  const org = organization.value.trim();
  resultText.textContent = [
    'Kirjane Labs project brief',
    '',
    `Name: ${contactName.value.trim()}`,
    org ? `Organization: ${org}` : null,
    sector.value ? `Organization type: ${sector.value}` : null,
    `Discussion topics: ${selectedTopics().map((input) => input.value).join(', ')}`,
    '',
    'Current workflow and goals',
    scopeInput.value.trim()
  ].filter((line) => line !== null).join('\n');
  result.hidden = false;
  result.classList.add('visible');
  copyNote.textContent = '';
  resultTitle.focus();
});

document.getElementById('btn-c-copy').addEventListener('click', async () => {
  const brief = resultText.textContent;
  if (!brief) return;
  try {
    await navigator.clipboard.writeText(brief);
    copyNote.textContent = 'Brief copied to clipboard.';
  } catch {
    copyNote.textContent = 'Clipboard access is unavailable. Select the draft text or download a copy.';
  }
});

document.getElementById('btn-c-dl').addEventListener('click', () => {
  if (!resultText.textContent) return;
  const content = new Blob([resultText.textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kirjane-project-brief.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  copyNote.textContent = 'Brief is ready to save.';
});

form.hidden = false;
window.__SITE_READY__ = true;
