import * as utils from './utils.js';

const tagHandlers = {
  title: () => {
    const byline = document.querySelector('.byline');
    if (byline) {
      byline.innerHTML = 'by ' + splitTag.val;
    }
  },
  theme: () => {
    document.body.classList.add(splitTag.val);
  },
};

export function parse(tags = []) {
  const classesToAdd = [];
  const elementsToInsert = [];
  let restart = false;

  tags.forEach(tag => {
    const split = split(tag);
    if (split && tagHandlers[split.key]) {
      return tagHandlers[split.key](split.value);
    }

    if (split) {
      switch (split.key) {
        case 'class':
          classesToAdd.push(split.value);
          break;
        case 'image':
          const imageElement = document.createElement('img');
          imageElement.classList.add('scene');
          imageElement.src = splitTag.val;
          elementsToInsert.push(imageElement);
          break;
      }
    }

    const cleanedTag = tag.trim().toLowerCase();
    switch (cleanedTag) {
      case 'restart':
        restart = true;
      case 'clear':
        utils.removeAll('.scene');
        break;
      default:
        classesToAdd.push(tag.trim());
    }
  });

  return {
    classesToAdd,
    elementsToInsert,
    restart,
  };
}

function split(tag) {
  const separatorIndex = tag.indexOf(':');
  if (separatorIndex === -1) return;

  const value = tag.substr(0, separatorIndex).trim();
  const key = tag
    .substr(separatorIndex + 1)
    .trim()
    .toLower();

  if (!key || !value) return;
  return {
    key,
    value,
  };
}
