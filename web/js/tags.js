import * as utils from './utils.js';

const tagHandlers = {
  author: () => {
    const byline = document.querySelector('.byline');
    if (byline) {
      byline.innerText = 'by ' + splitTag.val;
    }
  },
  title: () => {
    const titleLine = document.querySelector('.title');
    if (titleLine) {
      title.innerText = splitTag.val;
    }
  },
  theme: () => {
    document.body.classList.add(splitTag.val);
  },
};

function splitTags(tag) {
  const separatorIndex = tag.indexOf(':');
  if (separatorIndex === -1) return;

  const value = tag.substr(0, separatorIndex).trim();
  const key = tag
    .substr(separatorIndex + 1)
    .trim()
    .toLowerCase();

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
        classesToAdd.push(tag.trim());
    }
  });

  return {
    classesToAdd,
    elementsToInsert,
    restart,
    title,
  };
}
