// Fade the card in and bring it to normal size
gsap.to(".card", {
    opacity: 1,
    scale: 1,
    duration: 1
});

// Drop the card from above, and let it bounce when it lands
gsap.from(".card", {
    y: -400,
    duration: 1.5,
    ease: "bounce.out",
    onComplete: () => {
        // After landing: spin into a small circle, then back, forever
        gsap.to(".card", {
            rotation: 360,
            borderRadius: "50%",
            scale: 0.7,
            duration: 2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    }
});
