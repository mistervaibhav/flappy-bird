import { time } from "./types";

const BIRD_SPEED_UP: number = 0.25;
const BIRD_SPEED_DOWN: number = 0.5;
const JUMP_DURATION: number = 150;

const bird: HTMLElement = document.querySelector("[data-bird]");

let timeSinceLastJump = Number.POSITIVE_INFINITY;

export function setupBird() {
  setTop(window.innerHeight / 2);
  document.removeEventListener("keydown", handleJump);
  document.addEventListener("keydown", handleJump);
}

export function updateBird(delta: time) {
  const top: number = getTop();

  if (timeSinceLastJump < JUMP_DURATION) {
    setTop(top - BIRD_SPEED_UP * delta);
  } else {
    setTop(top + BIRD_SPEED_DOWN * delta);
  }

  timeSinceLastJump += delta;
}

export function getBirdRect(): DOMRect {
  return bird.getBoundingClientRect();
}

function setTop(top: number) {
  bird.style.setProperty("--bird-top", String(top));
}

function getTop(): number {
  return parseFloat(getComputedStyle(bird).getPropertyValue("--bird-top"));
}

function handleJump(e: KeyboardEvent) {
  if (e.code !== "Space") return;
  timeSinceLastJump = 0;
}
