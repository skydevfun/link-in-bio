const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let resizeReset = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeReset);
resizeReset();

const particles = [];

window.addEventListener("mousemove", function(e) {
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1.8;
        this.speedX = Math.random() * 3.6 - 1.8;
        this.speedY = Math.random() * 3.6 - 1.8;
        this.color = `hsl(${Math.random() * 40 + 200}, 95%, 65%)`;
        this.alpha = 1;
        this.decay = 1 / (60 * 1.3); 
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }
    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function handleParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.22)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();