var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width;
var height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();
/* Utility */
var rand = function (min, max) {
    return Math.random() * (max - min) + min;
};
/* Ribbon */
var Ribbon = /** @class */ (function () {
    function Ribbon() {
        this.x = rand(0, width);
        this.y = rand(0, height);
        this.angle = rand(0, Math.PI * 2);
        this.speed = rand(0.5, 1.5);
        this.hue = rand(0, 360);
        this.width = rand(2, 4);
    }
    Ribbon.prototype.update = function () {
        this.angle += rand(-0.05, 0.05);
        var nx = this.x + Math.cos(this.angle) * this.speed;
        var ny = this.y + Math.sin(this.angle) * this.speed;
        // Direction vector
        var dx = nx - this.x;
        var dy = ny - this.y;
        // Length (ES5-safe)
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        // Normal (perpendicular)
        var px = -dy / len;
        var py = dx / len;
        var w = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x + px * w, this.y + py * w);
        ctx.lineTo(this.x - px * w, this.y - py * w);
        ctx.lineTo(nx - px * w, ny - py * w);
        ctx.lineTo(nx + px * w, ny + py * w);
        ctx.closePath();
        ctx.fillStyle = "hsla(".concat(this.hue, ", 80%, 60%, 0.85)");
        ctx.shadowBlur = 6;
        ctx.shadowColor = "hsla(".concat(this.hue, ", 80%, 60%, 1)");
        ctx.fill();
        this.x = nx;
        this.y = ny;
        this.hue += 0.6;
        if (this.x < -50 || this.x > width + 50 ||
            this.y < -50 || this.y > height + 50) {
            this.reset();
        }
    };
    Ribbon.prototype.reset = function () {
        this.x = rand(0, width);
        this.y = rand(0, height);
        this.angle = rand(0, Math.PI * 2);
    };
    return Ribbon;
}());
/* Create ribbons */
var ribbons = [];
var RIBBON_COUNT = 120;
for (var i = 0; i < RIBBON_COUNT; i++) {
    ribbons.push(new Ribbon());
}
/* Animation */
function animate() {
    requestAnimationFrame(animate);
    // Trail fade
    ctx.fillStyle = "rgba(20, 15, 50, 0.15)";
    ctx.fillRect(0, 0, width, height);
    ribbons.forEach(function (r) { return r.update(); });
}
animate();
