import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

// CSS smooth scrolling fights with GSAP setting the scroll position every frame
document.documentElement.style.scrollBehavior = "auto";

const button = document.querySelector(".scroll-to-top");

// Wrap the arrow in a span so it can move separately from the button
button.innerHTML = `<span>↑</span>`;
const arrow = button.querySelector("span");

const sparkColors = ["#0984e3", "#74b9ff", "#ffeaa7", "#ffffff"];

let isVisible = false;
let isLaunching = false;

gsap.set(button, { scale: 0 });
gsap.set(arrow, { display: "inline-block" });

const float = gsap.to(button, {
    y: -10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    paused: true,
});

// Written in the browser's computed order (color first) so GSAP can match the values
const glow = gsap.to(button, {
    boxShadow: "rgba(9, 132, 227, 0.9) 0px 8px 32px 0px",
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    paused: true,
});

const arrowBounce = gsap.to(arrow, {
    y: -5,
    duration: 0.35,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    paused: true,
});

function updateButton() {
    if (isLaunching) return;

    const shouldShow = window.scrollY > 300;
    if (shouldShow === isVisible) return;

    isVisible = shouldShow;
    button.classList.toggle("show", shouldShow);

    if (shouldShow) {
        // Spin in, then start floating and glowing
        gsap.fromTo(
            button,
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "sine.out", overwrite: "auto" }
        );
        float.restart();
        glow.restart();
    } else {
        float.pause();
        glow.pause();
        gsap.to(button, { scale: 0, rotation: 180, duration: 0.3, ease: "sine.in", overwrite: "auto" });
    }
}

function burstSparks() {
    const { left, top, width, height } = button.getBoundingClientRect();

    for (let i = 0; i < 14; i++) {
        const spark = document.createElement("span");
        document.body.append(spark);

        gsap.set(spark, {
            position: "fixed",
            left: left + width / 2,
            top: top + height / 2,
            width: 6,
            height: 6,
            xPercent: -50,
            yPercent: -50,
            borderRadius: "50%",
            backgroundColor: gsap.utils.random(sparkColors),
            pointerEvents: "none",
        });

        gsap.to(spark, {
            x: gsap.utils.random(-60, 60),
            y: gsap.utils.random(30, 110),
            scale: 0,
            duration: gsap.utils.random(0.5, 0.9),
            ease: "sine.out",
            onComplete: () => spark.remove(),
        });
    }
}

function launch() {
    if (isLaunching) return;
    isLaunching = true;

    float.pause();
    glow.pause();
    arrowBounce.pause();

    gsap.timeline({
        onComplete: () => {
            // Reset off screen, then let the scroll position decide if it comes back
            isLaunching = false;
            isVisible = false;
            button.classList.remove("show");
            gsap.set(button, { y: 0, scale: 0, rotation: 0 });
            gsap.set(arrow, { y: 0 });
            updateButton();
        },
    })
        // Crouch down, squashed like a spring
        .to(button, { scaleX: 1.25, scaleY: 0.7, y: 8, duration: 0.2, ease: "sine.inOut", overwrite: "auto" })
        .add(burstSparks)
        // Blast off past the top of the screen, stretching as it speeds up
        .to(button, { scaleX: 0.75, scaleY: 1.3, y: -window.innerHeight, duration: 0.7, ease: "sine.in" })
        // autoKill hands control back if the user scrolls during the trip
        .to(window, { scrollTo: { y: 0, autoKill: true }, duration: 1.2, ease: "sine.inOut" }, 0.2);
}

window.addEventListener("scroll", updateButton);

button.addEventListener("mouseenter", () => {
    if (isLaunching) return;

    gsap.to(button, { scale: 1.15, duration: 0.3, ease: "sine.out", overwrite: "auto" });
    arrowBounce.restart();
});

button.addEventListener("mouseleave", () => {
    if (isLaunching) return;

    gsap.to(button, { scale: 1, duration: 0.3, ease: "sine.out", overwrite: "auto" });
    arrowBounce.pause();
    gsap.to(arrow, { y: 0, duration: 0.2, ease: "sine.out" });
});

button.addEventListener("click", launch);

// Covers a page refresh that restores a scrolled position
updateButton();
