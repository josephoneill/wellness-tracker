import { useCallback } from "react";
import heartImg from '@/assets/heart.png';

const SPRITE_TTL = 10000;

type Position = {
  x: number;
  y: number;
}

class HeartSprite {
  img = new Image();
  pos: Position;
  velocity: number;
  angle: number;
  MIN_VELOCITY = 50;
  MAX_VELOCITY = 25;
  MIN_ANGLE = 10;
  MAX_ANGLE = 170;
  IMAGE_WIDTH = 25;
  IMAGE_HEIGHT = 23;
  createdAt: number = 0;

  constructor(containerWidth: number, containerHeight: number, spawnRadius: number) {
    this.img.src = heartImg;
    this.velocity = Math.random() * (this.MAX_VELOCITY - this.MIN_VELOCITY) + this.MIN_VELOCITY;
    this.angle = (Math.random() * (this.MAX_ANGLE - this.MIN_ANGLE) + this.MIN_ANGLE) * (Math.PI / 180);
    this.pos = this.generatePosition(containerWidth, containerHeight, spawnRadius);
    this.createdAt = performance.now();
  }

  generatePosition(containerWidth: number, containerHeight: number, spawnRadius: number): Position {
    const x = Math.cos(this.angle) * spawnRadius + (containerWidth / 2);
    const y = containerHeight - (Math.sin(this.angle) * spawnRadius);
    return {
      x,
      y,
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
  }

  update(delta: number) {
    this.pos.x += (Math.cos(this.angle) * delta * this.velocity);
    this.pos.y -= (Math.sin(this.angle) * delta * this.velocity);
  }
}

class HeartSpriteManager {
  heartSprites: HeartSprite[];
  ctx: CanvasRenderingContext2D;
  containerWidth = 0;
  containerHeight = 0;
  spawnRadius = 0;
  lastSpawn = 0;
  SPAWN_FREQ = 300;

  constructor(
    ctx: CanvasRenderingContext2D,
    containerWidth: number,
    containerHeight: number,
    spawnRadius: number,
  ) {
    this.ctx = ctx;
    this.heartSprites = [];
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.spawnRadius = spawnRadius;
  }

  public add(heartSprite: HeartSprite) {
    this.heartSprites.push(heartSprite);
  }

  public render(delta: number, spawnDisabled = false) {
    if (!spawnDisabled) {
      this.spawn();
    }
    for (let i = 0; i < this.heartSprites.length; i++) {
      this.heartSprites[i].update(delta);
      this.heartSprites[i].render(this.ctx);
    }
    this.despawn();
  }

  private spawn() {
    if (performance.now() - this.lastSpawn > this.SPAWN_FREQ || this.lastSpawn === 0) {
      this.add(new HeartSprite(
        this.containerWidth,
        this.containerHeight,
        this.spawnRadius
      ));
      this.lastSpawn = performance.now();
    }
  }

  private despawn() {
    if (this.heartSprites.length === 0) {
      return;
    }

    if (performance.now() - this.heartSprites[0].createdAt > SPRITE_TTL) {
      this.heartSprites.shift();
    }
  }
}

export const useHeartsCanvas = () => {
  const animationDuration = 5000;
  let canvas: HTMLCanvasElement;
  let dailyWellnessImg: HTMLImageElement;
  let dailyWellnessImageWidth = 0;
  let ctx: CanvasRenderingContext2D | null;
  let animationFrameId = -1;
  let previousFrameTime = 0;
  let heartSpriteManager: HeartSpriteManager;
  let renderStart = 0;


  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (!node) {
      if (animationFrameId !== -1) {
        window.cancelAnimationFrame(animationFrameId);
      }
      return;
    }

    canvas = node;
    canvas.width = window.innerWidth;
    // 36 for text above
    canvas.height = dailyWellnessImg.clientHeight / 2 + 36;
    ctx = canvas.getContext('2d');
    if (ctx) {
      heartSpriteManager = new HeartSpriteManager(ctx, canvas.width, canvas.height, dailyWellnessImageWidth / 2);
      animationFrameId = requestAnimationFrame(render);
    }
  }, []);

  const completeWellnessImageRef = useCallback((node: HTMLImageElement) => {
    if (node) {
      dailyWellnessImg = node;
      if (dailyWellnessImg.clientWidth) {
        onWellnessImageLoaded();
      } else {
        dailyWellnessImg.onload = onWellnessImageLoaded;
      }
    }
  }, []);

  const onWellnessImageLoaded = () => {
    dailyWellnessImageWidth = dailyWellnessImg.clientWidth;
    if (heartSpriteManager) {
      heartSpriteManager.spawnRadius = dailyWellnessImageWidth / 2;
    }
  }

  const draw = () => {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  const render = (currentFrameTime: number) => {
    if (previousFrameTime === 0) {
      previousFrameTime = currentFrameTime;
      renderStart = currentFrameTime;
    }

    // Cancel animaton after 5 seconds
    const spawnDisabled = currentFrameTime - renderStart > animationDuration;

    if (currentFrameTime - renderStart > animationDuration + SPRITE_TTL) {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      cancelAnimation();
      return;
    }

    const deltaTime = (currentFrameTime - previousFrameTime) / 1000.0;
    previousFrameTime = currentFrameTime;
    draw();
    heartSpriteManager.render(deltaTime, spawnDisabled);
    animationFrameId = window.requestAnimationFrame(render);
  }

  const cancelAnimation = () => {
    window.cancelAnimationFrame(animationFrameId);
  }

  return {
    canvasRef,
    completeWellnessImageRef,
    cancelAnimation,
  }
};
