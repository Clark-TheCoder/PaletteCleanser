function waitForProducts() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const cards = document.querySelectorAll("img[src*='cdn'], li, article");
      if (cards.length > 20) {
        clearInterval(interval);
        resolve(document.body);
      }
    }, 300);
  });
}

async function findContainers() {
  let root = await waitForProducts(); // gets either the body or main
  const validContainers = root.querySelectorAll("div, section, ul, article"); // only get these elements within the body or main

  // For each element in the body or main, determine if it is a visible element
  const containers = Array.from(validContainers).filter((el) => {
    if (!visibleElements(el)) return false;

    const display = getComputedStyle(el).display;
    // Only return the elements that either have a grid or flex-grid layout
    return display.includes("flex") || display.includes("grid");
  });

  filterContainers(containers);
}
findContainers();

// Filter to find html elements that are visible
function visibleElements(el) {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    parseFloat(style.opacity) > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

// Function which filters which parent container`s in the dom meet certain criteria
function filterContainers(containersArray) {
  let validContainers = containersArray.filter((container) => {
    const children = Array.from(container.children);

    // Criteria #1: length of children needs to be greater than one
    if (children.length <= 1) return;

    // Criteria #2: children in container need to contain html elments that are
    // potential product cards (usually these product cards are div, a, li, et.)
    if (!hasValidProductTag(children)) return;

    // Re-analyzes to ensure that length is still greater than 1
    if (children.length <= 1) return;
    return true;

    // Now analyze to see if the children have matching siblings
  });

  // Now analyze the contents within the containers
  filterChildren(validContainers); // keep only the children in the containers that are product tags
}

function hasValidProductTag(children) {
  const potentialProductTags = new Set([
    "DIV",
    "LI",
    "ARTICLE",
    "SECTION",
    "A",
    "BUTTON",
  ]);

  return children.some(
    (el) => el.tagName && potentialProductTags.has(el.tagName)
  );
}

// Function to compare the children within the containers to see if they are product cards or not
function filterChildren(containersArray) {
  console.log(containersArray.length);
  let validContainers = containersArray.filter((container) => {
    // First remove all the elements that are clearly not product tags (eg. script)
    let productTags = filterProductTags(container);

    // If there is less than 2 element, container probably does not hold product cards
    if (productTags.length < 2) return;

    // If the first and second elements are not the same, then container probably does not
    // hold many of the same elements sequentially
    if (productTags[0].tagName !== productTags[1].tagName) return;

    // If conatiner's children do not have a image and a button, then not product cards

    const validCards = productTags.filter(cardHasProductSignals);

    if (validCards.length < 2) return false;
    return true;
  });

  console.log(validContainers);
  console.log(validContainers.length);
}

function filterProductTags(container) {
  let children = Array.from(container.children);

  const potentialProductTags = new Set([
    "DIV",
    "LI",
    "ARTICLE",
    "SECTION",
    "A",
    "BUTTON",
  ]);
  // Filter the array: keep only elements whose tagName is in the Set
  const validChildren = children.filter((el) => {
    return el.tagName && potentialProductTags.has(el.tagName);
  });

  return validChildren;
}

function cardHasProductSignals(card) {
  const PRICE_REGEX = /(\$\s?\d+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?\s?\$)/;

  const hasImage = card.querySelector("img");
  const hasPrice = card.innerText && PRICE_REGEX.test(card.innerText);

  return hasImage && hasPrice; // button optional
}
