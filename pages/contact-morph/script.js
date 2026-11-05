import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

const cta = document.querySelector("#cta");
const openBtn = document.querySelector("#openBtn");
const closeBtn = document.querySelector("#closeBtn");
const form = document.querySelector("#form");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// two facts decide where the button lives
let scrolled = false; // has the user scrolled past the top?
let open = false; // is the form open?

// The one function that moves the button:
// 1. remember how it looks now  2. change the classes  3. let Flip animate the difference
function update(ease, duration) {
  Flip.killFlipsOf(cta); // if a move is still running, stop it first
  const state = Flip.getState(cta);

  cta.classList.toggle("docked", scrolled || open);
  cta.classList.toggle("open", open);

  Flip.from(state, {
    duration: reduce ? 0 : duration,
    ease: ease,
    scale: false, // animate real width/height so the form text never stretches
  });
}

// scroll down a little -> dock in the corner, scroll back to top -> go home
ScrollTrigger.create({
  trigger: ".hero",
  start: "top top-=20",
  end: "max",
  onEnter: () => {
    scrolled = true;
    update("shineInOut", 1); // fast start, long soft landing

    // once it lands, the icon pops
    gsap.fromTo(
      "#openBtn svg",
      { scale: 0.5, rotation: -30 },
      { scale: 1, rotation: 0, ease: "back.out(3)", duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.6 }
    );
  },
  onLeaveBack: () => {
    scrolled = false;
    update("shineOut", 0.8);
  },
});

function openForm() {
  open = true;
  update("expo.out", 0.9); // starts fast, glides to a stop

  // fields fade up one after another while the box is growing
  gsap.from(".field", {
    y: 24,
    opacity: 0,
    stagger: 0.07,
    ease: "back.out(1.7)",
    duration: reduce ? 0 : 0.6,
    delay: reduce ? 0 : 0.2,
  });
  form.querySelector("#name").focus({ preventScroll: true });
}

function closeForm() {
  open = false;
  update("expo.out", 0.8);
}

openBtn.addEventListener("click", openForm);
closeBtn.addEventListener("click", closeForm);

form.addEventListener("submit", (e) => {
  e.preventDefault(); // demo only: no real sending
  form.reset();
  closeForm();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && open) closeForm();
});
