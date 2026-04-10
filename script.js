
// =========================
// ELEMENTS
// =========================
const announcementContainer = document.querySelector(".announcement");
const announcements = document.querySelectorAll(".announcement span");

const menuBtn = document.querySelector(".menu-btn");
const dropdownMenu = document.getElementById("dropdownMenu");

const slider = document.getElementById("slider");

const searchIcon = document.querySelector(".search-icon");
const searchBox = document.getElementById("search");

const lider = document.getElementById("lider");
const ards = document.querySelectorAll(".ard");

const introButton = document.getElementById("introButton");
const heroSection = document.getElementById("hero");

const header = document.querySelector("header");

// =========================
// HERO SCROLL
// =========================
function scrollToHero(e) {
  if (!introButton || !heroSection) return;

  e.preventDefault();

  const headerOffset = header?.offsetHeight || 0;
  const elementPosition = heroSection.getBoundingClientRect().top;

  const offsetPosition =
    elementPosition + window.scrollY - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
}

introButton?.addEventListener("click", scrollToHero);

// =========================
// MENU TOGGLE
// =========================
function toggleMenu() {
  menuBtn.classList.toggle("active");
  dropdownMenu.classList.toggle("show");
}

menuBtn?.addEventListener("click", toggleMenu);

// close menu outside click
document.addEventListener("click", (e) => {
  const clickedOutside =
    !menuBtn.contains(e.target) &&
    !dropdownMenu.contains(e.target);

  if (clickedOutside) {
    dropdownMenu.classList.remove("show");
    menuBtn.classList.remove("active");
  }
});

// =========================
// ANNOUNCEMENTS SYSTEM
// =========================
let currentAnnouncement = 0;
let announcementInterval;

function showAnnouncement(index) {
  announcements.forEach((ann, i) => {
    ann.classList.toggle("active", i === index);
  });
}

function startAnnouncements() {
  announcementInterval = setInterval(() => {
    currentAnnouncement =
      (currentAnnouncement + 1) % announcements.length;

    showAnnouncement(currentAnnouncement);
  }, 4000);
}

function stopAnnouncements() {
  clearInterval(announcementInterval);
}

// init
showAnnouncement(currentAnnouncement);
startAnnouncements();

// hover pause
announcementContainer?.addEventListener("mouseenter", stopAnnouncements);
announcementContainer?.addEventListener("mouseleave", startAnnouncements);

// =========================
// ANNOUNCEMENT SCROLL HIDE/SHOW
// =========================
let lastScrollY = window.scrollY;
let isHidden = false;
const SCROLL_THRESHOLD = 50;

function handleAnnouncementScroll() {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  if (!isHidden && delta > SCROLL_THRESHOLD) {
    announcementContainer.classList.add("hidden");
    isHidden = true;
  } else if (isHidden && delta < -SCROLL_THRESHOLD) {
    announcementContainer.classList.remove("hidden");
    isHidden = false;
  }

  if (Math.abs(delta) > SCROLL_THRESHOLD) {
    lastScrollY = currentScrollY;
  }
}

window.addEventListener(
  "scroll",
  () => requestAnimationFrame(handleAnnouncementScroll)
);

// =========================
// SLIDER CONTROL
// =========================
function scrollSlider(direction) {
  const scrollAmount = 220;

  slider.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}

window.scrollSlider = scrollSlider; // keep HTML compatibility

// center slider on load
window.addEventListener("load", () => {
  const cards = document.querySelectorAll(".card");
  const centerIndex = 2;

  const card = cards[centerIndex];
  if (!card) return;

  const offset =
    card.offsetLeft -
    slider.offsetWidth / 2 +
    card.offsetWidth / 2;

  slider.scrollLeft = offset;
});

// =========================
// SEARCH TOGGLE
// =========================
function toggleSearch() {
  const isOpen = searchBox.style.display === "block";

  if (isOpen) {
    searchBox.style.display = "none";
  } else {
    searchBox.style.display = "block";
    searchBox.focus();
  }
}

searchIcon?.addEventListener("click", toggleSearch);

// =========================
// SECOND SLIDER CENTER (LIDER)
// =========================
window.addEventListener("load", () => {
  const centerIndex = 2;
  const ard = ards[centerIndex];

  if (!ard) return;

  const offset =
    ard.offsetLeft -
    lider.offsetWidth / 2 +
    ard.offsetWidth / 2;

  lider.scrollLeft = offset;
});