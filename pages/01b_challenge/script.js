import gsap from "gsap";

// Grow a soft blue glow around the card, then fade it back, forever
gsap.to(".card", {
    boxShadow: "0px 0px 60px 20px rgba(84, 160, 255, 0.9)",
    duration:2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
});

