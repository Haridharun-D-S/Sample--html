const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let width: number;
let height: number;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* Utility */
const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

/* Ribbon point */
class Ribbon {
  x: number;
  y: number;
  angle: number;
  speed: number;
  hue: number;
  width: number;

  constructor() {
    this.x = rand(0, width);
    this.y = rand(0, height);
    this.angle = rand(0, Math.PI * 2);
    this.speed = rand(0.3, 1.2);
    this.hue = rand(0, 360);
    this.width = rand(1, 3);
  }

  update() {
    this.angle += rand(-0.05, 0.05);

    const nx = this.x + Math.cos(this.angle) * this.speed;
    const ny = this.y + Math.sin(this.angle) * this.speed;

    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 1)`;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    this.x = nx;
    this.y = ny;

    this.hue += 0.5;

    if (
      this.x < 0 || this.x > width ||
      this.y < 0 || this.y > height
    ) {
      this.reset();
    }
  }

  reset() {
    this.x = rand(0, width);
    this.y = rand(0, height);
    this.angle = rand(0, Math.PI * 2);
  }
}

/* Create ribbons */
const ribbons: Ribbon[] = [];
const RIBBON_COUNT = 120;

for (let i = 0; i < RIBBON_COUNT; i++) {
  ribbons.push(new Ribbon());
}

/* Animation loop */
function animate() {
  requestAnimationFrame(animate);

  // Fade effect (trail)
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, width, height);

  ribbons.forEach(ribbon => ribbon.update());
}

animate();
