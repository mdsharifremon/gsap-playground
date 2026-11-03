import gsap from "gsap";

const repeatBtn = document.querySelector(".repeat");

// gsap.from(".card-1", {
//   y: -100,
//   scale: 0.95,
//   opacity: 0,
//   duration: 1,
//   delay: 0.2,
//   ease: "power4.out",
// });

// gsap.from(".card-2", {
//   y: -100,
//   scale: 0.95,
//   opacity: 0,
//   duration: 1,
//   delay: 0.4,
//   ease: "power4.out",
// });

// gsap.from(".card-3", {
//   y: -100,
//   scale: 0.95,
//   opacity: 0,
//   duration: 1,
//     delay: 0.6,
//   ease: "power4.out",
// });

// aming to animate all cards at once, but with a staggered effect, we can use the `stagger` property in GSAP. This allows us to apply the same animation to multiple elements while introducing a delay between each one.
const animation = gsap.from(".card", {
  y: -100,
  scale: 0.95,
  opacity: 0,
  duration: 1,
  delay: 0.2,
  ease: "power4.out",
  stagger: 0.2,
});

repeatBtn.addEventListener("click", () => {
  animation.restart();
});