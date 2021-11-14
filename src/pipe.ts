import { Pipe, time } from "./types";

const HOLE_HEIGHT: number = 170;
const PIPE_INTERVAL: time = 1750;
const PIPE_SPEED: number = 0.25;
const PIPE_WIDTH: number = 60;

let pipes: Array<Pipe> = [];
let timeSinceLastPipe: time = 0;
let passesPipesCount: number = 0;

export function setupPipes() {
  document.documentElement.style.setProperty(
    "--pipe-width",
    String(PIPE_WIDTH)
  );
  document.documentElement.style.setProperty(
    "--hole-height",
    String(HOLE_HEIGHT)
  );

  pipes.forEach((pipe) => pipe.remove());

  timeSinceLastPipe = PIPE_INTERVAL;
  passesPipesCount = 0;
}

export function getPassedPipesCount() {
  return passesPipesCount;
}

export function updatePipes(delta: time) {
  timeSinceLastPipe += delta;

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL;
    createPipe();
  }

  pipes.forEach((pipe) => {
    if (pipe.left + PIPE_WIDTH < 0) {
      passesPipesCount++;
      pipe.remove();
      return;
    }

    pipe.left = pipe.left - delta * PIPE_SPEED;
  });
}

export function getPipeRects(): Array<DOMRect> {
  return pipes.flatMap((pipe) => pipe.rects());
}

function createPipe() {
  const pipeElement: HTMLElement = document.createElement("div");
  const topSegment: HTMLElement = createPipeSegment("top");
  const bottomSegment: HTMLElement = createPipeSegment("bottom");

  pipeElement.append(topSegment);
  pipeElement.append(bottomSegment);

  pipeElement.classList.add("pipe");

  pipeElement.style.setProperty(
    "--hole-top",
    randomNumberBetween(
      HOLE_HEIGHT * 1.5,
      window.innerHeight - HOLE_HEIGHT * 0.5
    )
  );

  const pipe: Pipe = {
    get left() {
      return parseFloat(
        getComputedStyle(pipeElement).getPropertyValue("--pipe-left")
      );
    },
    set left(value: number) {
      pipeElement.style.setProperty("--pipe-left", String(value));
    },
    remove() {
      pipes = pipes.filter((p) => p !== pipe);
      pipeElement.remove();
    },
    rects(): Array<DOMRect> {
      return [
        topSegment.getBoundingClientRect(),
        bottomSegment.getBoundingClientRect(),
      ];
    },
  };

  pipe.left = window.innerWidth;
  document.body.append(pipeElement);
  pipes.push(pipe);
}

function createPipeSegment(position): HTMLElement {
  const segment: HTMLElement = document.createElement("div");
  segment.classList.add("segment", position);
  return segment;
}

function randomNumberBetween(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
