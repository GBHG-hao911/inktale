import storyContent from "./story.js";
import * as utils from "./utils.js";

const storyContainer = document.querySelector("#story");
const outerScrollContainer = document.querySelector(".outerContainer");
let story;

function init() {
  story = new inkjs.Story(storyContent);

  if (story.globalTags) {
    for (let i = 0; i < story.globalTags.length; i++) {
      const globalTag = story.globalTags[i];
      const splitTag = utils.splitPropertyTag(globalTag);

      // THEME: dark
      if (splitTag && splitTag.property == "theme") {
        document.body.classList.add(splitTag.val);
      }

      // author: Your Name
      else if (splitTag && splitTag.property == "author") {
        const byline = document.querySelector(".byline");
        byline.innerHTML = "by " + splitTag.val;
      }
    }
  }

  // Kick off the start of the story!
  continueStory(true);
}

// Main story processing function. Each time this is called it generates
// all the next content up as far as the next set of choices.
function continueStory(firstTime) {
  let paragraphIndex = 0;
  let delay = 0.0;

  // Don't over-scroll past new content
  const previousBottomEdge = firstTime
    ? 0
    : utils.contentBottomEdgeY(storyContainer);

  // Generate story text - loop through available content
  while (story.canContinue) {
    // Get ink to generate the next paragraph
    const paragraphText = story.Continue();
    const tags = story.currentTags;

    // Any special tags included with this line
    const customClasses = [];
    const directClasses = ["send", "rec", "recv", "receive"];
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];

      //if we see any of our tags that are directly classes, push them
      if (directClasses.indexOf(tag) !== -1) {
        customClasses.push(tag);
      }

      // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
      // customised to be used for other things too.
      const splitTag = utils.splitPropertyTag(tag);

      // IMAGE: src
      if (splitTag && splitTag.property == "IMAGE") {
        const imageElement = document.createElement("img");
        imageElement.src = splitTag.val;
        storyContainer.appendChild(imageElement);

        utils.showAfter(delay, imageElement);
        delay += 200.0;
      } else if (splitTag && splitTag.property == "CLASS") {
        customClasses.push(splitTag.val);
      }

      // CLEAR - removes all existing content.
      // RESTART - clears everything and restarts the story from the beginning
      else if (tag == "CLEAR" || tag == "RESTART") {
        utils.removeAll("p", storyContainer);
        utils.removeAll("img", storyContainer);

        // Comment out this line if you want to leave the header visible when clearing
        utils.setVisible(".header", false, storyContainer);

        if (tag == "RESTART") {
          restart();
          return;
        }
      }
    }

    // Create paragraph element (initially hidden)
    const paragraphElement = document.createElement("p");
    paragraphElement.innerHTML = paragraphText;
    storyContainer.appendChild(paragraphElement);

    // Add any custom classes derived from ink tags
    for (let i = 0; i < customClasses.length; i++) {
      paragraphElement.classList.add(customClasses[i]);
    }

    // Fade in paragraph after a short delay
    utils.showAfter(delay, paragraphElement);
    delay += 200.0;
  }

  // Create HTML choices from ink choices
  story.currentChoices.forEach(function(choice) {
    // Create paragraph with anchor element
    const choiceParagraphElement = document.createElement("p");
    choiceParagraphElement.classList.add("choice");
    choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`;
    storyContainer.appendChild(choiceParagraphElement);

    // Fade choice in after a short delay
    utils.showAfter(delay, choiceParagraphElement);
    delay += 200.0;

    // Click on choice
    const choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
    choiceAnchorEl.addEventListener("click", function(event) {
      // Don't follow <a> link
      event.preventDefault();

      // Remove all existing choices
      utils.removeAll("p.choice", storyContainer);

      // Tell the story where to go next
      story.ChooseChoiceIndex(choice.index);

      // Aaand loop
      continueStory();
    });
  });

  // Extend height to fit
  // We do this manually so that removing elements and creating new ones doesn't
  // cause the height (and therefore scroll) to jump backwards temporarily.
  storyContainer.style.height = utils.contentBottomEdgeY(storyContainer) + "px";

  if (!firstTime) {
    utils.scrollDown(previousBottomEdge, outerScrollContainer);
  }
}

function restart() {
  story.ResetState();
  utils.setVisible(".header", true, storyContainer);
  continueStory(true);
  outerScrollContainer.scrollTo(0, 0);
}

init();
