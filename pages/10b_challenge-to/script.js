import gsap from "gsap";
const toasts = document.querySelectorAll(".toast");    
const showToastLoop = (index = 0) => {
  gsap.to(toasts[index], {
    y: -120,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "power4.out",
    onComplete: () => {
      gsap.to(toasts[index], {
        y: 0,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power4.in",
        onComplete: () => {
          // Move to the next toast, going back to the first after the last one
          const nextIndex = (index + 1) % toasts.length;
          setTimeout(() => showToastLoop(nextIndex), 1000);
        }
      });
    }

});
}

showToastLoop();

