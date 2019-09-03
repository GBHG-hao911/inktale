// Fades in an element after a specified delay
export function showAfter(delay, el) {
  el.classList.add("hide");
  setTimeout(function() {
    el.classList.remove("hide");
  }, delay);
}

// Scrolls the page down, but no further than the bottom edge of what you could
// see previously, so it doesn't go too far.
export function scrollDown(previousBottomEdge, scrollContainer) {
  // Line up top of screen with the bottom of where the previous content ended
  let target = previousBottomEdge;

  // Can't go further than the very bottom of the page
  const limit = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  if (target > limit) target = limit;

  const start = scrollContainer.scrollTop;

  const dist = target - start;
  const duration = 300 + (300 * dist) / 100;
  let startTime = null;
  function step(time) {
    if (startTime == null) startTime = time;
    const t = (time - startTime) / duration;
    const lerp = 3 * t * t - 2 * t * t * t; // ease in/out
    scrollContainer.scrollTo(0, (1.0 - lerp) * start + lerp * target);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// The Y coordinate of the bottom end of all the story content, used
// for growing the container, and deciding how far to scroll.
export function contentBottomEdgeY(container) {
  const bottomElement = container.lastElementChild;
  return bottomElement
    ? bottomElement.offsetTop + bottomElement.offsetHeight
    : 0;
}

// Remove all elements that match the given selector. Used for removing choices after
// you've picked one, as well as for the CLEAR and RESTART tags.
export function removeAll(selector, container) {
  const allElements = container.querySelectorAll(selector);
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    el.parentNode.removeChild(el);
  }
}

// Used for hiding and showing the header when you CLEAR or RESTART the story respectively.
export function setVisible(selector, visible, container) {
  const allElements = container.querySelectorAll(selector);
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    if (!visible) el.classList.add("invisible");
    else el.classList.remove("invisible");
  }
}

// Helper for parsing out tags of the form:
//  # PROPERTY: value
// e.g. IMAGE: source path
export function splitPropertyTag(tag) {
  const propertySplitIdx = tag.indexOf(":");
  if (propertySplitIdx != null) {
    const property = tag.substr(0, propertySplitIdx).trim();
    const val = tag.substr(propertySplitIdx + 1).trim();
    return {
      property: property,
      val: val
    };
  }

  return null;
}
