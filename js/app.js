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
  // Force stop the voice when the user leaves the article
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  sheet.classList.remove("half", "full");
  overlay.classList.remove("active");
  document.body.style.overflow = "";

  // Reset the button icon manually just in case
  const voiceIcon = document.querySelector("#voiceBtn i");
  if (voiceIcon) voiceIcon.className = "fa-solid fa-volume-high";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
});

async function renderNewsGrid() {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;
  try {
    const response = await fetch("data/articles.json");
    if (!response.ok) throw new Error("Could not load articles.json");
    const articles = await response.json();
    grid.innerHTML = "";

    const shuffledKeys = Object.keys(articles).sort(() => Math.random() - 0.5);

    shuffledKeys.forEach((id) => {
      const item = articles[id];
      const cardHTML = `
        <div class="item">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="meta-data">
            <small>${item.date}</small>
            <a href="javascript:void(0)" class="like-btn" onclick="handleLike(this)">
              <i class="fa-regular fa-heart"></i>
              <span class="like-count">${item.likes || "0"}</span>
            </a>
            <span>${item.category}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.excerpt || item.content.replace(/<[^>]*>/g, "").substring(0, 120) + "..."}</p>
          <button class="read-more" onclick="loadArticle('${id}')">
            Read More <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      `;
      grid.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Grid automation error:", error);
  }
}

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
  }
}

function openAppleSheet() {
  if (window.innerWidth <= 768) {
    sheet.classList.add("half");
  } else {
    sheet.classList.add("full");
  }
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.addEventListener("DOMContentLoaded", () => {
  renderNewsGrid();
});

function handleLike(btn) {
  const icon = btn.querySelector("i");
  icon.classList.toggle("fa-regular");
  icon.classList.toggle("fa-solid");
  icon.style.color = icon.classList.contains("fa-solid") ? "#ff3b30" : "";
}

function toggleSpeech() {
  const btn = document.getElementById("voiceBtn");
  const icon = btn.querySelector("i");

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    resetVoiceUI();
    return;
  }

  const title = document.getElementById("sheetTitle").innerText;
  const body = document.getElementById("sheetText").innerText;
  const utterance = new SpeechSynthesisUtterance(`${title}. ${body}`);

  btn.classList.add("is-speaking");
  icon.className = "fa-solid fa-stop";

  utterance.onend = () => resetVoiceUI();
  utterance.onerror = () => resetVoiceUI();

  window.speechSynthesis.speak(utterance);
}

function resetVoiceUI() {
  const btn = document.getElementById("voiceBtn");
  const icon = btn.querySelector("i");

  if (btn) {
    btn.classList.remove("is-speaking");
    icon.className = "fa-solid fa-volume-high";
  }
}

function closeSheet() {
  window.speechSynthesis.cancel();
  resetVoiceUI();

  const sheet = document.getElementById("bottomSheet");
  const overlay = document.getElementById("sheetOverlay");

  sheet.classList.remove("half", "full");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}
