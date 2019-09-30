import * as utils from './utils.js';

const tagHandlers = {
  author: value => {
    const byline = document.querySelectorAll('.byline');
    byline.forEach(el => (el.innerText = value));
  },
  title: value => {
    const titleline = document.querySelectorAll('.titleline');
    titleline.forEach(el => (el.innerText = value));
    const pageTitle = document.querySelector('title');
    pageTitle.innerText = value;
  },
  theme: value => {
    document.body.classList.add(value);
  },
};

function splitTags(tag) {
  const separatorIndex = tag.indexOf(':');
  if (separatorIndex === -1) return;

  const key = tag
    .substr(0, separatorIndex)
    .toLowerCase()
    .trim();
  const value = tag.substr(separatorIndex + 1).trim();

  if (!key || !value) return;
  return {
    key,
    value,
  };
}

export function parse(tags = []) {
  const classesToAdd = [];
  const elementsToInsert = [];
  let restart = false;
  let title = 'Untitled';

  tags.forEach(tag => {
    const split = splitTags(tag);
    console.log(split, tag);
    if (split && tagHandlers[split.key]) {
      tagHandlers[split.key](split.value);
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
        case 'title':
          title = split.value;
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
      //classesToAdd.push(tag.trim());
    }
  });

  return {
    classesToAdd,
    elementsToInsert,
    restart,
    title,
  };
}
