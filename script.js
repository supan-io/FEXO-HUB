const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const loginModal = document.getElementById("loginModal");
const playerName = document.getElementById("playerName");
const formMessage = document.getElementById("formMessage");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function openModal() {
  loginModal.classList.add("open");
  loginModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  playerName.focus();
}
function closeModal() {
  loginModal.classList.remove("open");
  loginModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  formMessage.textContent = "";
}

document.getElementById("loginOpen").addEventListener("click", openModal);
document.getElementById("loginClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);

document.getElementById("demoLogin").addEventListener("click", () => {
  const name = playerName.value.trim();
  if (!name) {
    formMessage.textContent = "Enter a nickname to preview your player profile.";
    playerName.focus();
    return;
  }
  formMessage.textContent = `Welcome, ${name}! This is a front-end preview — secure accounts are not connected yet.`;
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && loginModal.classList.contains("open")) closeModal();
});
