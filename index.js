/* -----------------------------------------
   Focus Outline for Keyboard Users 
----------------------------------------- */
const handleFirstTab = (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
    self.removeEventListener("keydown", handleFirstTab);
    self.addEventListener("mousedown", handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove("user-is-tabbing");
  self.removeEventListener("mousedown", handleMouseDownOnce);
  self.addEventListener("keydown", handleFirstTab);
};

self.addEventListener("keydown", handleFirstTab);

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

self.addEventListener("scroll", () => {
  if (self.scrollY > 700) {
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
  let manualDirection = "none"; // "left", "right", or "none"

  // Calculate the distance for a seamless loop.
  const scrollWidth = logos.scrollWidth / 2; // Because the logos are duplicated
  const speed = 1.5; // Adjust this value to control manual scroll speed

  // Pause the CSS animation on mouseenter
  marquee.addEventListener("mouseenter", () => {
    logos.style.animationPlayState = "paused";
  });

  // On mousemove, determine manual scroll direction
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

  // On mouseleave, cancel manual control and resume CSS animation
  marquee.addEventListener("mouseleave", () => {
    manualDirection = "none";
    cancelAnimationFrame(manualScrollRAF);
    manualScrollRAF = null;
    logos.style.transform = "";
    logos.style.animationPlayState = "running";
  });

  // Manual scroll function
  const manualScroll = () => {
    // Get the current X translation value
    const computedStyle = window.getComputedStyle(logos).transform;
    let matrix = new DOMMatrixReadOnly(computedStyle);
    let currentX = matrix.m41; // current translateX value

    if (manualDirection === "left") {
      currentX += speed; // moving the container to the right
      if (currentX > 0) {
        currentX = currentX - scrollWidth;
      }
    } else if (manualDirection === "right") {
      currentX -= speed; // moving the container to the left
      if (currentX <= -scrollWidth) {
        currentX = 0;
      }
    }
    logos.style.transform = `translateX(${currentX}px)`;
    manualScrollRAF = requestAnimationFrame(manualScroll);
  };
}
