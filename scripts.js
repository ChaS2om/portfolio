function openLightbox(src, el) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  const rect = el.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  img.src = src;
  img.style.transformOrigin = `${originX}px ${originY}px`;

  lb.classList.remove("closing");
  img.classList.remove("closing");
  lb.style.display = "flex";
  lb.classList.add("opening");
  img.classList.add("opening");
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  lb.classList.remove("opening");
  img.classList.remove("opening");
  lb.classList.add("closing");
  img.classList.add("closing");

  setTimeout(() => {
    lb.style.display = "none";
    lb.classList.remove("closing");
    img.classList.remove("closing");
  }, 350);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
