console.log("Running inside page:", window.location.href);

// Filter to find html elements that are visible
function filterElement(el) {
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

setTimeout(() => {
  // Determine scope of search
  const root = document.querySelector("main") || document.body;
  // Only look for divs
  const nodes = root.querySelectorAll("div, section, ul, article");
  const elements = Array.from(nodes).filter((el) => {
    if (!filterElement(el)) {
      return false;
    }
    if (el.children.length < 2) {
      return false;
    } else {
      const display = getComputedStyle(el).display;
      // Only return the elements that either have a grid or flex-grid layout
      return display.includes("flex") || display.includes("grid");
    }
  });
  console.log(
    "Containers with grid/flex layout and more than one child:",
    elements
  );
}, 2000);
