/* -----------------------------------------
   Focus Outline for Keyboard Users
----------------------------------------- */

const handleFirstTab = (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove("user-is-tabbing");
  window.removeEventListener("mousedown", handleMouseDownOnce);
  window.addEventListener("keydown", handleFirstTab);
};

window.addEventListener("keydown", handleFirstTab);

/* -----------------------------------------
   Back-to-Top Button Visibility on Scroll
----------------------------------------- */
const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

const alterStyles = (isRendered) => {
  backToTopButton.style.visibility = isRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isRendered ? 1 : 0;
  backToTopButton.style.transform = isRendered ? "scale(1)" : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

/* -----------------------------------------
   Infinite Auto-Scroll with Manual Control
   for Skills Section (.skills-marquee)
----------------------------------------- */
const marquee = document.querySelector(".skills-marquee");
if (marquee) {
  const logos = marquee.querySelector(".skill__logos");
  let manualScrollRAF = null;
  let manualDirection = "none";

  const scrollWidth = logos.scrollWidth / 2;
  const speed = 1.5;

  marquee.addEventListener("mouseenter", () => {
    logos.style.animationPlayState = "paused";
  });

  marquee.addEventListener("mousemove", (e) => {
    const { left, width } = marquee.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width * 0.25) {
      manualDirection = "left";
    } else if (x > width * 0.75) {
      manualDirection = "right";
    } else {
      manualDirection = "none";
    }

    if (manualDirection !== "none" && !manualScrollRAF) {
      manualScroll();
    }
  });

  marquee.addEventListener("mouseleave", () => {
    manualDirection = "none";
    cancelAnimationFrame(manualScrollRAF);
    manualScrollRAF = null;

    const computedStyle = window.getComputedStyle(logos).transform;
    const matrix = new DOMMatrixReadOnly(computedStyle);
    const currentX = matrix.m41;

    const progress = Math.abs(currentX) / scrollWidth;
    const durationSeconds = 20;
    const delay = -(progress * durationSeconds);

    logos.style.transform = "";
    logos.style.animationDelay = `${delay}s`;
    logos.style.animationPlayState = "running";
  });

  const manualScroll = () => {
    if (manualDirection === "none") {
      cancelAnimationFrame(manualScrollRAF);
      manualScrollRAF = null;
      return;
    }

    const computedStyle = window.getComputedStyle(logos).transform;
    const matrix = new DOMMatrixReadOnly(computedStyle);
    let currentX = matrix.m41;

    if (manualDirection === "left") {
      currentX += speed;
      if (currentX > 0) {
        currentX = currentX - scrollWidth;
      }
    } else if (manualDirection === "right") {
      currentX -= speed;
      if (currentX <= -scrollWidth) {
        currentX = 0;
      }
    }

    logos.style.transform = `translateX(${currentX}px)`;
    manualScrollRAF = requestAnimationFrame(manualScroll);
  };
}
