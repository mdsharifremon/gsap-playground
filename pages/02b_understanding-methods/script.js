import gsap from "gsap";

const animation = gsap.to(".box", {
  opacity: 1,
  rotate: 360,
  borderRadius: "50%",
  scale: 1.25,
  duration: 2,
  ease: "power2.inOut"
});

const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const resume = document.querySelector(".resume");
const restart = document.querySelector(".restart");
const reverse = document.querySelector(".reverse");
const kill = document.querySelector(".kill");
const yoyo = document.querySelector(".yoyo");
const repeat = document.querySelector(".repeat");

play.addEventListener("click", () => {
  animation.play();
});
pause.addEventListener("click", () => {
  animation.pause();
});
resume.addEventListener("click", () => {
  animation.resume();
});
restart.addEventListener("click", () => {
  animation.restart();
});
reverse.addEventListener("click", () => {
  animation.reverse();
});
kill.addEventListener("click", () => {
  animation.kill();
});
yoyo.addEventListener("click", () => {
  animation.yoyo(true);
}); 

repeat.addEventListener("click", () => {
  animation.repeat(2);
});
