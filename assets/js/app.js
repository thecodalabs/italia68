function toggleMenu() {
  const menu = document.getElementById("appleMenu");
  const overlay = document.getElementById("menuOverlay");

  menu.classList.toggle("open");
  overlay.classList.toggle("active");

  if (window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
}

let startY = 0;
let currentY = 0;
const sheet = document.getElementById("bottomSheet");
const overlay = document.getElementById("sheetOverlay");

function openSheet(title, text, img) {
  document.getElementById("sheetTitle").innerText = title;
  document.getElementById("sheetImage").src = img;

  sheet.style.transition = "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";
  sheet.classList.add("half");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

sheet.addEventListener(
  "touchstart",
  (e) => {
    startY = e.touches[0].clientY;
    sheet.style.transition = "none";
  },
  { passive: true },
);

sheet.addEventListener(
  "touchmove",
  (e) => {
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (sheet.querySelector(".sheet-content").scrollTop <= 0) {
      if (deltaY > 0 || sheet.classList.contains("half")) {
      }
    }
  },
  { passive: true },
);

sheet.addEventListener("touchend", (e) => {
  const endY = e.changedTouches[0].clientY;
  const distance = startY - endY;

  sheet.style.transition = "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";

  if (distance > 100) {
    sheet.classList.remove("half");
    sheet.classList.add("full");
  } else if (distance < -100) {
    if (sheet.classList.contains("full")) {
      sheet.classList.remove("full");
      sheet.classList.add("half");
    } else {
      closeSheet();
    }
  } else {
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

async function loadArticle(articleId) {
  try {
    const response = await fetch("data/articles.json");
    if (!response.ok) throw new Error("Could not load news database.");

    const allArticles = await response.json();
    const article = allArticles[articleId];

    if (article) {
      document.getElementById("sheetCategory").innerText = article.category;
      document.getElementById("sheetTitle").innerText = article.title;
      document.getElementById("sheetMeta").innerText = article.date;
      document.getElementById("sheetImage").src = article.image;
      document.getElementById("sheetText").innerHTML = article.content;

      openAppleSheet();
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    alert("Check your internet connection to read the full story.");
  }
}

function openAppleSheet() {
  const sheet = document.getElementById("bottomSheet");
  const overlay = document.getElementById("sheetOverlay");

  if (window.innerWidth <= 768) {
    sheet.classList.add("half");
  } else {
    sheet.classList.add("full");
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
