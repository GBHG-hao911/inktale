const panels = {
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene'),
  prefs: document.getElementById('prefs'),
};

let lastActivePanel = 'scene';
let activePanel = 'scene';

function makePanelActive(panel = 'scene') {
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
