import { time } from "./types";
import { setupBird, updateBird, getBirdRect } from "./bird";
import {
  getPassedPipesCount,
  getPipeRects,
  setupPipes,
  updatePipes,
} from "./pipe";

document.addEventListener("keypress", handleStart, { once: true });

const title: HTMLElement = document.querySelector("[data-title]");
const subTitle: HTMLElement = document.querySelector("[data-subtitle]");

let lastTime: time = null;

function handleStart() {
  lastTime = null;
  title.classList.add("hidden");
  setupBird();
  setupPipes();
  window.requestAnimationFrame(updateLoop);
}

function updateLoop(time: time) {
  if (lastTime === null) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }

  const delta: time = time - lastTime;

  if (checkLose()) {
    handleLose();
    return;
  }

  updateBird(delta);
  updatePipes(delta);

  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function checkLose(): boolean {
  const birdRect: DOMRect = getBirdRect();
  const isInsidePipe = getPipeRects().some((rect) =>
    isColliding(birdRect, rect)
  );
  const isOutsideWorld =
    birdRect.top < 0 || birdRect.bottom > window.innerHeight;

  return isInsidePipe || isOutsideWorld;
}

function handleLose() {
  setTimeout(() => {
    let rects: Array<DOMRect> = getPipeRects();
    console.log({ rects });
    title.classList.remove("hidden");
    subTitle.classList.remove("hidden");
    subTitle.textContent = `${getPassedPipesCount()} PIPES PASSED !!`;
    document.addEventListener("keypress", handleStart, { once: true });
  }, 200);
}

function isColliding(rectOne: DOMRect, rectTwo: DOMRect): boolean {
  return (
    rectOne.left < rectTwo.right &&
    rectOne.top < rectTwo.bottom &&
    rectOne.right > rectTwo.left &&
    rectOne.bottom > rectTwo.top
  );
}
