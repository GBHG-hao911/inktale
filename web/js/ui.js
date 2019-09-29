import * as dataManager from './dataManager.js';

const panels = {
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene'),
  prefs: document.getElementById('prefs'),
};

let lastActivePanel = 'scene';
let activePanel = 'scene';
let notifyTimer = null;

export function init() {
  const prefs = dataManager.getPrefs();
  updatePrefs(prefs);
}

function makePanelActive(panel = 'scene') {
  clearNotify();
  if (!panels[panel]) return;
  panels[activePanel].classList.add('d-none');
  lastActivePanel = activePanel;
  activePanel = panel;
  panels[activePanel].classList.remove('d-none');
}

function toggleMenu() {
  if (activePanel !== 'scene') {
    return makePanelActive('scene');
  }
  makePanelActive('menu');
}

function togglePrefs() {
  const canSave = dataManager.canSave();
  if (!canSave) {
    document.querySelectorAll('.saveBtn').forEach(el => (el.disabled = true));
  } else {
    document.querySelectorAll('.saveBtn').forEach(el => (el.disabled = false));
  }
  if (activePanel !== 'prefs') {
    return makePanelActive('prefs');
  }
  makePanelActive(lastActivePanel);
}

function backToLastActivePanel() {
  makePanelActive(lastActivePanel);
}

function resumeScene() {
  makePanelActive('scene');
}

export function flashNotify(text) {
  //delete the timer if one is running
  if (notifyTimer) {
    clearTimeout(notifyTimer);
  }
  document.querySelectorAll('.notify').forEach(el => (el.innerText = text));
  notifyTimer = setTimeout(clearNotify, 5 * 1000);
}

function clearNotify() {
  if (notifyTimer) {
    clearTimeout(notifyTimer);
    notifyTimer = null;
  }
  document.querySelectorAll('.notify').forEach(el => (el.innerText = ''));
}

function saveScene() {
  dataManager.save();
  flashNotify('Saved!');
}

function setPrefs() {
  const form = document.getElementById('preferencesForm');
  console.log(form.elements);
  for (let i = 0; i < form.elements.length; i++) {
    const el = form.elements[i];
    if (el.nodeName.toLowerCase() !== 'input') continue; //skip non-inputs
    if (el.type.toLowerCase() === 'radio' && !el.checked) continue; //skip unchecked radios
    dataManager.setPref(el.name, el.value);
  }
}

function updatePrefs(prefs) {
  for (let pref in prefs) {
    const els = document.getElementsByName(pref);
    if (els[0].type.toLowerCase() === 'radio') {
      els.forEach(el => {
        if (el.value === prefs[pref]) {
          el.checked = true;
        }
      });
    } else {
      els.forEach(el => (el.value = prefs[pref]));
    }
  }
}

document
  .querySelectorAll('.menuBtn')
  .forEach(el => el.addEventListener('click', toggleMenu));
document
  .querySelectorAll('.prefsBtn')
  .forEach(el => el.addEventListener('click', togglePrefs));
document
  .querySelectorAll('.backBtn')
  .forEach(el => el.addEventListener('click', backToLastActivePanel));
document
  .querySelectorAll('.exitBtn')
  .forEach(el => el.addEventListener('click', resumeScene));
document
  .querySelectorAll('.saveBtn')
  .forEach(el => el.addEventListener('click', saveScene));
document
  .querySelectorAll('#preferencesForm input')
  .forEach(el => el.addEventListener('change', () => setPrefs()));
document.getElementById('preferencesForm').addEventListener('submit', e => {
  e.preventDefault();
  setPrefs();
});
