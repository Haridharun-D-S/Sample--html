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

/* Ribbon */
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
    this.speed = rand(0.5, 1.5);
    this.hue = rand(0, 360);
    this.width = rand(2, 4);
  }

  update() {
    this.angle += rand(-0.05, 0.05);

    const nx = this.x + Math.cos(this.angle) * this.speed;
    const ny = this.y + Math.sin(this.angle) * this.speed;

    // Direction vector
    const dx = nx - this.x;
    const dy = ny - this.y;

    // Length (ES5-safe)
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // Normal (perpendicular)
    const px = -dy / len;
    const py = dx / len;

    const w = this.width;

    ctx.beginPath();
    ctx.moveTo(this.x + px * w, this.y + py * w);
    ctx.lineTo(this.x - px * w, this.y - py * w);
    ctx.lineTo(nx - px * w, ny - py * w);
    ctx.lineTo(nx + px * w, ny + py * w);
    ctx.closePath();

    ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, 0.85)`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 1)`;
    ctx.fill();

    this.x = nx;
    this.y = ny;
    this.hue += 0.6;

    if (
      this.x < -50 || this.x > width + 50 ||
      this.y < -50 || this.y > height + 50
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

/* Animation */
function animate() {
  requestAnimationFrame(animate);

  // Trail fade
  ctx.fillStyle = "rgba(20, 15, 50, 0.15)";
  ctx.fillRect(0, 0, width, height);

  ribbons.forEach(r => r.update());
}

animate();
