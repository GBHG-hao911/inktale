const SAVE_PREFIX = 'inktale_save';
const FORMAT_VERSION = '1.0';
let GAME_SLUG = 'unnamed_game';

let storyRef = null;

const defaultPrefs = {
  delay: 'normal',
};

const defaultIndex = {
  saves: [],
};

export let data = {
  prefs: Object.assign({}, defaultPrefs),
  state: null,
};

export function init(gameName = 'unnamed_game') {
  GAME_SLUG = gameName.replace(/\w/g, '_').toLowerCase();
  const index = getIndex();
  let hasAutoSave = false;
  index.saves.forEach(save => {
    if (save.name === 'autosave') {
      hasAutoSave = true;
    }
  });

  return hasAutoSave;
}

function getSlug(name) {
  return [SAVE_PREFIX, GAME_SLUG, name].join('_');
}

export function getIndex() {
  const listString = localStorage.getItem(getSlug('__index'));
  if (!listString) {
    return Object.assign({}, defaultIndex);
  }

  let parsedList = null;
  try {
    parsedList = JSON.parse(listString);
  } catch (e) {
    console.log('Error loading list', name, e);
    return Object.assign({}, defaultIndex);
  }

  return parsedList;
}

export function updateIndex(newIndex) {
  if (!newIndex.version) {
    newIndex.version = FORMAT_VERSION;
  }
  const indexString = JSON.stringify(newIndex);
  localStorage.setItem(getSlug('__index'), indexString);
}

export function save(name = 'autosave', overrideData) {
  //update our data from our story
  if (storyRef) {
    data.state = storyRef.state.toJson();
  }
  const saveData = overrideData ? overrideData : data;
  const saveString = JSON.stringify(saveData);

  const index = getIndex();
  let saveObject = null;
  //do we have this save already?
  index.saves.forEach(save => {
    if (save.name === name) {
      saveObject = save;
    }
  });

  if (!saveObject) {
    saveObject = {
      name,
      date: Date.now() / 1000, //epoch
    };
    index.saves.push(saveObject);
  } else {
    saveObject.date = Date.now() / 1000; //update date
  }

  localStorage.setItem(getSlug(name), saveString);
  updateIndex(index);
}

export function setStoryRef(story) {
  storyRef = story;
}

export function load(name = 'autosave') {
  const saveString = localStorage.getItem(getSlug(name));

  if (!saveString) {
    return false;
  }

  let parsedSave = null;
  try {
    parsedSave = JSON.parse(saveString);
  } catch (e) {
    console.log('Error loading save', name, e);
  }

  data = parsedSave;
  return true;
}

export function getData() {
  return data;
}

export function setPref(pref, value) {
  data.prefs[pref] = value;
}

export function getPref(pref) {
  return data.prefs[pref];
}

export function getPrefs() {
  return data.prefs;
}

export function canSave() {
  return storyRef ? true : false;
}
