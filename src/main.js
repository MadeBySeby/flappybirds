import { Application, Assets, Sprite, TilingSprite, Text } from "pixi.js";
import { gsap } from "gsap";
(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);
  await Assets.load([
    {
      alias: "bird",
      src: "/assets/bluebird.png",
    },
    {
      alias: "pipe-green",
      src: "/assets/pipe-green.png",
    },
    {
      alias: "pipe-red",
      src: "/assets/pipe-red.png",
    },
    {
      alias: "base",
      src: "/assets/base.png",
    },
  ]);
  const bird = Sprite.from("bird");
  const pipeGreen = Sprite.from("pipe-green");
  const reversePipeGreen = Sprite.from("pipe-green");
  const keyMap = {
    KeyW: "up",
    ArrowUp: "up",
  };
  let keys = {
    up: { pressed: false },
  };
  window.addEventListener("keydown", (event) => keydownHandler(event));
  window.addEventListener("keyup", (event) => keyupHandler(event));
  function keydownHandler(e) {
    const key = keyMap[e.code];
    if (!key) return;
    keys[key].pressed = true;
  }
  function keyupHandler(e) {
    const key = keyMap[e.code];
    if (!key) return;
    keys[key].pressed = false;
  }
  bird.x = 0;
  bird.y = app.screen.height / 2;
  // let birdAnim = gsap.to(bird, {
  //   x: bird.x + 15,
  //   y: bird.y - 40,
  //   // rotation: 20,
  //   fill: "yellow",
  //   duration: 0.3,
  // });
  // let birdDown = gsap.to(bird, {
  //   x: bird.x + 5,
  //   y: bird.y + 40,
  //   duration: 1, // slower falling
  //   paused: true,
  // });
  // birdAnim.pause();
  // birdDown.pause();
  const baseTexture = Assets.get("base");
  const base = new TilingSprite({
    texture: baseTexture,
    width: app.screen.width,
    height: baseTexture.height,
  });
  base.y = app.screen.height - base.height;
  let score = 0;
  pipeGreen.anchor.set(0.5);
  reversePipeGreen.anchor.set(0.5);
  pipeGreen.rotation = Math.PI * 1;
  reversePipeGreen.x = 500;
  reversePipeGreen.y = app.screen.height - base.height;
  pipeGreen.x = 500;
  pipeGreen.y = 0;
  const counter = new Text({
    text: score,
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff1010,
      align: "center",
    },
  });
  app.stage.addChild(reversePipeGreen);
  app.stage.addChild(counter);
  app.stage.addChild(base);
  app.stage.addChild(pipeGreen);
  app.stage.addChild(bird);

  let fallingSpeed = 0.5;
  let jump = -8;
  let velocity = 0;
  const baseScrollSpeed = 2;
  // let floatTime = 0;
  app.ticker.add((time) => {
    if (keys.up.pressed) {
      velocity = jump;
    }

    velocity += fallingSpeed; //ესეიგი ყოველ ფრეიმზე 0.5 ით ქვემოთ ეცემა
    bird.y += velocity;
    if (velocity > 10) velocity = 10;

    bird.rotation = velocity * 0.05;

    if (bird.y < 0) {
      bird.y = 0;
      velocity = 0;
    }

    if (bird.y > app.screen.height - base.height - bird.height) {
      bird.y = app.screen.height - base.height - bird.height;
      velocity = 0;
    }
    base.tilePosition.x -= baseScrollSpeed;
  });
})();
