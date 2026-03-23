function toggleMenu() {
  const menu = document.getElementById("appleMenu");
  const overlay = document.getElementById("menuOverlay");

  menu.classList.toggle("open");
  overlay.classList.toggle("active");

  // Optional: Vibrate on mobile for haptic feedback
  if (window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
}

let startY = 0;
let currentY = 0;
const sheet = document.getElementById("bottomSheet");
const overlay = document.getElementById("sheetOverlay");

// 1. Trigger from "Read More"
function openSheet(title, text, img) {
  document.getElementById("sheetTitle").innerText = title;
  document.getElementById("sheetImage").src = img;
  // Set content here if needed

  sheet.style.transition = "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";
  sheet.classList.add("half");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// 2. Touch Gestures Logic
sheet.addEventListener(
  "touchstart",
  (e) => {
    startY = e.touches[0].clientY;
    sheet.style.transition = "none"; // Disable transitions while dragging
  },
  { passive: true },
);

sheet.addEventListener(
  "touchmove",
  (e) => {
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    // Only allow dragging if we are at the top of the content
    if (sheet.querySelector(".sheet-content").scrollTop <= 0) {
      if (deltaY > 0 || sheet.classList.contains("half")) {
        // Logic to visually follow the finger (optional complexity)
        // For now, we'll focus on the "Release to Snap" logic
      }
    }
  },
  { passive: true },
);

sheet.addEventListener("touchend", (e) => {
  const endY = e.changedTouches[0].clientY;
  const distance = startY - endY; // Positive = Swiped Up, Negative = Swiped Down

  sheet.style.transition = "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";

  if (distance > 100) {
    // Swiped Up significantly -> Go Full
    sheet.classList.remove("half");
    sheet.classList.add("full");
  } else if (distance < -100) {
    // Swiped Down significantly
    if (sheet.classList.contains("full")) {
      sheet.classList.remove("full");
      sheet.classList.add("half");
    } else {
      closeSheet();
    }
  } else {
    // Snap back to current state if swipe was too short
    if (sheet.classList.contains("full")) sheet.classList.add("full");
    else sheet.classList.add("half");
  }
});

function closeSheet() {
  sheet.classList.remove("half", "full");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSheet();
  }
});
