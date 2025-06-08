import {
  Application,
  Assets,
  Sprite,
  TilingSprite,
  Text,
  Container,
} from "pixi.js";
import { gsap } from "gsap";
import { sound } from "@pixi/sound";

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

  const keyMap = {
    KeyW: "up",
    ArrowUp: "up",
  };
  let keys = {
    up: { pressed: false },
  };
  window.addEventListener("keydown", (event) => keydownHandler(event));
  window.addEventListener("keyup", (event) => keyupHandler(event));

  sound.add("jump", "/assets/Everything/sfx_wing.wav"); // or .mp3
  sound.add("hit", "/assets/Everything/sfx_hit.wav"); // or .mp3
  sound.add("die", "/assets/Everything/sfx_die.wav"); // or .mp3

  function keydownHandler(e) {
    const key = keyMap[e.code];
    if (!key) return;
    sound.play("die");
    keys[key].pressed = true;
  }
  function keyupHandler(e) {
    const key = keyMap[e.code];
    if (!key) return;
    keys[key].pressed = false;
  }
  const world = new Container();
  const bird = Sprite.from("bird");

  bird.x = 0;
  bird.y = app.screen.height / 2;
  const baseSample = Sprite.from("base");
  const baseWidth = baseSample.width;
  const bases = [];
  const numOfBases = Math.ceil(app.screen.width / baseSample.width) + 2;
  console.log(numOfBases);
  for (let i = 0; i < numOfBases; i++) {
    const base = Sprite.from("base");
    base.x = i * baseWidth;
    base.y = app.screen.height - base.height;
    world.addChild(base);
    bases.push(base);
  }
  // bases.forEach((base, i) => {
  //   base.y = app.screen.height - base.height;
  //   base.x += i * basePadding;
  //   world.addChild(base);
  //   console.log(base.x, -base.width, app.screen.height);
  //   if (base.x <= -(base.width + 1)) {
  //     plank.x += plankCount * base.width + 1 * 1.5;
  //   }
  // });
  // const baseTexture = Assets.get("base");
  // const base = new TilingSprite({
  //   texture: baseTexture,
  //   width: app.screen.width * 3,
  //   height: baseTexture.height,
  // });

  // base.y = app.screen.height - base.height;
  let score = 0;
  // pipeGreen.anchor.set(0.5);
  // reversePipeGreen.anchor.set(0.5);
  // pipeGreen.rotation = Math.PI * 1;
  // reversePipeGreen.x = 500;
  // reversePipeGreen.y = app.screen.height - base.height;
  // pipeGreen.x = 500;
  // pipeGreen.y = 0;
  const counter = new Text({
    text: score,
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff1010,
      align: "center",
    },
  });
  // world.addChild(base);
  // app.stage.awwwddChild(reversePipeGreen);
  // app.stage.addChild(base);
  // app.stage.addChild(pipeGreen);
  app.stage.addChild(world);
  app.stage.addChild(counter);
  app.stage.addChild(bird);
  const pipeGap = 150;
  const pipeSpacing = 300;
  const pipeSpeed = 2;
  const pipes = [];
  function createPipePair(x) {
    const top = Sprite.from("pipe-green");
    const bottom = Sprite.from("pipe-green");

    const offset = Math.random() * x + 100; // Random vertical gap start
    top.anchor.set(0.5, 1);
    bottom.anchor.set(0.5, 0);

    top.rotation = Math.PI;
    top.x = offset;
    bottom.x = offset;

    top.y = 0;
    (bottom.y = app.screen.height - baseSample.height - top.height),
      world.addChild(top, bottom);
    pipes.push({ top, bottom, passed: false });
  }

  for (let i = 0; i < 10; i++) {
    createPipePair(app.screen.width + i * pipeSpacing);
  }
  let fallingSpeed = 0.5;
  let jump = -8;
  let velocity = 0;
  // let floatTime = 0;
  let gameDistance = 0;
  const scrollSpeed = 2;
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

    if (bird.y > app.screen.height - baseSample.height - bird.height) {
      bird.y = app.screen.height - baseSample.height - bird.height;
      velocity = 0;
    }
    pipes.forEach((pipe) => {});
    bases.forEach((base) => {
      if (base.getGlobalPosition().x <= -base.width) {
        // ეს gptm მითრა დიდად არვიცი რაარი
        const rightmostX = Math.max(
          ...bases.map((b) => b.getGlobalPosition().x)
        );
        base.x = rightmostX - world.x + baseWidth;
      }
    });

    world.x -= 2;
    gameDistance += scrollSpeed;
    // base.tilePosition.x = gameDistance;
  });
})();

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
