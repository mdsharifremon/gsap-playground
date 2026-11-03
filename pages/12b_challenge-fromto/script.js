import gsap from "gsap";

const imojis = document.querySelectorAll("[data-emoji]");

imojis.forEach((imoji, index) => {
    imoji.addEventListener("click", () => {
        // Create a bubble element
        const bubble = document.createElement("span");
        bubble.className = "bubble";
        bubble.textContent = imoji.dataset.emoji;
        
        // Position the bubble at the same location as the clicked imoji
        const rect = imoji.getBoundingClientRect();
        bubble.style.left = `${rect.left + window.scrollX}px`;
        bubble.style.top = `${rect.top + window.scrollY}px`;
        document.body.appendChild(bubble);


        // Animate the bubble using GSAP
        gsap.fromTo(
            bubble,
            {
               y: 0,
               scale: 1,
               rotate: 0,
                opacity: 1,
            },
            {
                y: -120,
                scale: 1.5,
                rotate: 45,
                opacity: 0,
                duration: 1.2,
                ease: "sine.out",
                // Remove the bubble from the DOM after the animation completes
                onComplete: () => bubble.remove(),
            }
        );
    })
});
