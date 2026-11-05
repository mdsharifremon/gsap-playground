import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

const cta = document.querySelector("#cta");
const openBtn = document.querySelector("#openBtn");
const closeBtn = document.querySelector("#closeBtn");
const doneBtn = document.querySelector("#doneBtn");
const sendBtn = document.querySelector("#sendBtn");
const errorBox = document.querySelector("#error");
const form = document.querySelector("#form");
const scrim = document.querySelector("#scrim");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fail = location.search.includes("fail"); // add ?fail to the URL to test the error state

// three facts decide how the button looks
let scrolled = false; // past the top of the page?
let open = false; // form open?
let sent = false; // message sent?

// 1. remember how it looks  2. change the classes  3. Flip animates the difference
function update(ease, duration) {
  Flip.killFlipsOf(cta);
  const state = Flip.getState(cta);

  cta.classList.toggle("docked", scrolled || open);
  cta.classList.toggle("open", open);
  cta.classList.toggle("sent", sent);

  Flip.from(state, {
    duration: reduce ? 0 : duration,
    ease: ease,
    scale: false,
  });
}

function showScrim(show) {
  gsap.to(scrim, { autoAlpha: show ? 1 : 0, duration: reduce ? 0 : 0.4 });
}

// ---------- page load ----------
if (!reduce) {
  gsap.from(".hero__text > :not(.slot)", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "power3.out",
    clearProps: "all",
  });
  // the button's wrapper only fades: a transform on a parent would break position: fixed inside it
  gsap.from(".slot", { opacity: 0, duration: 0.6, delay: 0.4, clearProps: "opacity" });
  gsap.from(".hero__visual", {
    y: 40,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.out",
    clearProps: "all",
  });
}

// ---------- scroll: dock / undock ----------
ScrollTrigger.create({
  trigger: ".hero",
  start: "top top-=20",
  end: "max",
  onEnter: () => {
    scrolled = true;
    update("power4.out", 0.9);
    gsap.fromTo(
      "#openBtn svg",
      { scale: 0.5, rotation: -30 },
      { scale: 1, rotation: 0, ease: "back.out(3)", duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.6 }
    );
  },
  onLeaveBack: () => {
    scrolled = false;
    update("expo.out", 0.8);
  },
});

// ---------- open / close ----------
function openForm() {
  open = true;
  update("expo.out", 0.9);
  showScrim(true);
  openBtn.setAttribute("aria-expanded", "true");

  gsap.from(".cta__form .field", {
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
  sent = false;
  errorBox.hidden = true;
  update("expo.out", 0.8);
  showScrim(false);
  openBtn.setAttribute("aria-expanded", "false");
  openBtn.focus({ preventScroll: true }); // keyboard users land back where they started
}

openBtn.addEventListener("click", openForm);
closeBtn.addEventListener("click", closeForm);
doneBtn.addEventListener("click", closeForm);
scrim.addEventListener("click", closeForm);

// ---------- sending: loading, success, error ----------
function fakeSend() {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject() : resolve()), 900);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  try {
    await fakeSend();
    form.reset();
    sent = true;
    update("expo.out", 0.7);

    gsap.from(".cta__done > *", {
      y: 16,
      opacity: 0,
      stagger: 0.08,
      ease: "back.out(1.7)",
      duration: reduce ? 0 : 0.5,
      delay: reduce ? 0 : 0.2,
    });
    gsap.from(".cta__check path", {
      strokeDashoffset: 1, // draws the tick
      duration: reduce ? 0 : 0.5,
      delay: reduce ? 0 : 0.4,
      ease: "power2.out",
    });
    doneBtn.focus({ preventScroll: true });
  } catch {
    errorBox.hidden = false;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send message";
  }
});

// ---------- keyboard: Escape closes, Tab stays inside the form ----------
document.addEventListener("keydown", (e) => {
  if (!open) return;

  if (e.key === "Escape") closeForm();

  if (e.key === "Tab") {
    const items = [...cta.querySelectorAll("button, input, textarea")].filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
