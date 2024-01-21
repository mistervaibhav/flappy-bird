import * as Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
  }

  preload() {
    // this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("star", "assets/star.png");
    this.load.image("birdSprite", "assets/birdSprite.png");
  }

  create() {
    const image = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "sky"
    );
    const scaleX = this.cameras.main.width / image.width;
    const scaleY = this.cameras.main.height / image.height;
    const scale = Math.max(scaleX, scaleY);

    image.setScale(scale).setScrollFactor(0);

    this.add.image(100, this.cameras.main.height / 2, "bird").setScale(scale);

    // const emitter = this.add.particles(undefined, undefined, "star", {
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // });

    // const logo = this.physics.add.image(400, 100, "bird");

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);
  }
}
