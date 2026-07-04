const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const MAP_W = 90;
const MAP_H = 45;
const worldMap = [
"                                                                                          ",
"                                                                                          ",
"                              #######                                                     ",
"                             #############                                                ",
"                   #######  #############                         #####        ####       ",
"       #################################       ####           #########################   ",
"    ########################   #######         #####        ############################# ",
"     #########################    ##          #####       ##############################  ",
"           ####################                  ####   ##############################    ",
"             ##################                ######  ##############################     ",
"              #################              ######## ##############################      ",
"               ###############             ########   ############################        ",
"               ##############              ###         ##########################         ",
"                ############                   #       ####################### #          ",
"                 ##########                ########    ##################### ##           ",
"                 #########                 ########## ####################                ",
"                  ### ###                 ##############################                  ",
"                   ###  #                 ############################                    ",
"                      #                  ########################### ###                  ",
"                        ##               ###############       ###   ###                  ",
"                          ###             ###############            ##                   ",
"                         ######              ############           #   ##                ",
"                         ########             ###########           ##  ##                ",
"                         ##########           ##########             ##      ###          ",
"                         ###########           #########                     #####        ",
"                          ##########            ####### #                     #           ",
"                          ##########            ####### #                   #####         ",
"                          #########             ######  #                #########        ",
"                          ########               #####  #                #########        ",
"                           ######                ####                    ##########       ",
"                           #####                 ####                    #########        ",
"                           ####                                                ###        ",
"                           ###                                                            ",
"                          ###                                                             ",
"                           #                                                              ",
"                           #                                                              ",
"                                                                                          ",
"                                                                                          ",
"######################################################################################### ",
"######################################################################################### ",
"######################################################################################### ",
"######################################################################################### ",
"######################################################################################### ",
"######################################################################################### ",
"######################################################################################### "
];

const asciiDigits = {
    '0': [
        "  ███  ",
        " ██ ██ ",
        "██   ██",
        " ██ ██ ",
        "  ███  "
    ],
    '1': [
        "   ██  ",
        "  ███  ",
        "   ██  ",
        "   ██  ",
        " █████ "
    ],
    '2': [
        " █████ ",
        "     ██",
        "  █████",
        " ██    ",
        " ██████"
    ],
    '3': [
        " █████ ",
        "     ██",
        "  ████ ",
        "     ██",
        " █████ "
    ],
    '4': [
        "██   ██",
        "██   ██",
        " ██████",
        "     ██",
        "     ██"
    ],
    '5': [
        "███████",
        "██     ",
        "██████ ",
        "     ██",
        "██████ "
    ],
    '6': [
        "  ████ ",
        " ██    ",
        "██████ ",
        "██   ██",
        " █████ "
    ],
    '7': [
        "███████",
        "    ██ ",
        "   ██  ",
        "  ██   ",
        " ██    "
    ],
    '8': [
        " █████ ",
        "██   ██",
        " █████ ",
        "██   ██",
        " █████ "
    ],
    '9': [
        " █████ ",
        "██   ██",
        " ██████",
        "     ██",
        "  ████ "
    ],
    ':': [
        "   ",
        " █ ",
        "   ",
        " █ ",
        "   "
    ]
};

const themeBtn = document.getElementById('theme-btn');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');

let currentAngle = 1.35;
let currentTilt = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let velocityAngle = 0;
let velocityTilt = 0;
const autoSpeed = 0.0003;
const friction = 0.96;

let currentTheme = localStorage.getItem('theme') || 'clock';

themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
    themeMenu.classList.remove('show');
});

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    themeOptions.forEach(opt => {
        if (opt.getAttribute('data-theme') === theme) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    resizeReset();
}

themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        setTheme(opt.getAttribute('data-theme'));
    });
});

window.addEventListener('mousedown', (e) => {
    if (currentTheme !== 'earth') return;
    if (e.target.closest('.top-panel')) return;
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    velocityAngle = 0;
    velocityTilt = 0;
});

window.addEventListener('mousemove', (e) => {
    if (currentTheme !== 'earth') return;
    if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        velocityAngle = dx * 0.004;
        velocityTilt = dy * 0.004;
        currentAngle += velocityAngle;
        currentTilt += velocityTilt;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('wheel', (e) => {
    if (currentTheme !== 'earth') return;
    if (e.target.closest('.top-panel')) return;
    velocityAngle += e.deltaY * 0.001;
});

let resizeReset = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initTheme(currentTheme);
}

window.addEventListener("resize", resizeReset);

const particles = [];

window.addEventListener("mousemove", function(e) {
    if (currentTheme !== 'sparks') return;
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

let matrixColumns = [];
let matrixSpeeds = [];
const matrixFontSize = 20;

function initMatrix() {
    const cols = Math.floor(canvas.width / matrixFontSize) + 1;
    matrixColumns = Array(cols).fill(0).map(() => Math.random() * -50);
    matrixSpeeds = Array(cols).fill(0).map(() => 0.05 + Math.random() * 0.13);
}

function drawMatrix() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold ' + matrixFontSize + 'px monospace';

    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

    for (let i = 0; i < matrixColumns.length; i++) {
        const x = i * matrixFontSize;
        const headY = Math.floor(matrixColumns[i]);

        const tailLength = 18;
        for (let j = 0; j < tailLength; j++) {
            const charY = headY - j;
            if (charY >= 0 && charY * matrixFontSize < canvas.height + matrixFontSize) {
                const charIdx = (x + charY) % chars.length;
                const char = chars[charIdx];
                if (j === 0) {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#00ff46';
                } else {
                    const alpha = 1.0 - (j / tailLength);
                    ctx.fillStyle = `rgba(0, 255, 70, ${alpha})`;
                    ctx.shadowBlur = 0;
                }
                ctx.fillText(char, x, charY * matrixFontSize);
            }
        }
        ctx.shadowBlur = 0;

        matrixColumns[i] += matrixSpeeds[i];

        if ((headY - tailLength) * matrixFontSize > canvas.height) {
            matrixColumns[i] = -20;
            matrixSpeeds[i] = 0.05 + Math.random() * 0.13;
        }
    }
}

function drawClock() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${hh}:${mm}:${ss}`;

    ctx.font = '15px monospace';
    ctx.textBaseline = 'top';

    const charWidth = 9;
    const charHeight = 15;

    const clockRows = 5;
    const digitSpacing = 1;

    let totalChars = 0;
    for (let i = 0; i < timeStr.length; i++) {
        const char = timeStr[i];
        const template = asciiDigits[char];
        totalChars += template[0].length + digitSpacing;
    }
    totalChars -= digitSpacing;

    const clockWidth = totalChars * charWidth;
    const clockHeight = clockRows * charHeight;

    const startX = (canvas.width - clockWidth) / 2;
    const startY = (canvas.height - clockHeight) / 2;

    const charsList = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';

    const cols = Math.floor(canvas.width / charWidth) + 1;
    const rows = Math.floor(canvas.height / charHeight) + 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const px = c * charWidth;
            const py = r * charHeight;

            let isSolid = false;

            const relativeX = px - startX;
            const relativeY = py - startY;

            if (relativeX >= 0 && relativeX < clockWidth && relativeY >= 0 && relativeY < clockHeight) {
                const clockCharCol = Math.floor(relativeX / charWidth);
                const clockCharRow = Math.floor(relativeY / charHeight);

                let accumWidth = 0;
                for (let i = 0; i < timeStr.length; i++) {
                    const char = timeStr[i];
                    const template = asciiDigits[char];
                    const w = template[0].length;

                    if (clockCharCol >= accumWidth && clockCharCol < accumWidth + w) {
                        const localCol = clockCharCol - accumWidth;
                        if (template[clockCharRow] && template[clockCharRow][localCol] !== ' ') {
                            isSolid = true;
                        }
                        break;
                    }
                    accumWidth += w + digitSpacing;
                }
            }

            const randChar = charsList[Math.floor(Math.random() * charsList.length)];
            if (isSolid) {
                ctx.fillStyle = `hsl(${220 + (Math.sin(Date.now() / 1000) * 20)}, 95%, 65%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fillText(randChar, px, py);
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.fillText(randChar, px, py);
            }
        }
    }
}

function drawEarth() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '11px monospace';
    ctx.textBaseline = 'top';

    const charWidth = 7;
    const charHeight = 12;
    const cols = Math.floor(canvas.width / charWidth) + 1;
    const rows = Math.floor(canvas.height / charHeight) + 1;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = Math.min(canvas.width, canvas.height) * 0.34;
    const RSq = R * R;
    const atmoR = R * 1.06;
    const atmoRSq = atmoR * atmoR;

    const nowTime = Date.now();
    const deltaTime = nowTime - (window.lastEarthFrameTime || nowTime);
    window.lastEarthFrameTime = nowTime;

    if (!isDragging) {
        velocityAngle += (autoSpeed * deltaTime - velocityAngle) * 0.02;
        velocityTilt *= 0.95;
        currentAngle += velocityAngle;
        currentTilt += velocityTilt;
        currentTilt += (0 - currentTilt) * 0.01;
    }

    const cosAngle = Math.cos(currentAngle);
    const sinAngle = Math.sin(currentAngle);
    const cosTilt = Math.cos(currentTilt);
    const sinTilt = Math.sin(currentTilt);

    const starChars = ['.', '+', '*', '·'];

    const lx = -0.4;
    const ly = 0.5;
    const lz = 0.8;
    const ll = Math.sqrt(lx*lx + ly*ly + lz*lz);
    const nlx = lx/ll, nly = ly/ll, nlz = lz/ll;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const px = c * charWidth;
            const py = r * charHeight;

            const dx = px - cx;
            const dy = py - cy;
            const distSq = dx * dx + dy * dy;

            if (distSq <= RSq) {
                const nx = dx / R;
                const ny = -dy / R;
                const nz = Math.sqrt(1 - nx * nx - ny * ny);

                const xr = nx * cosAngle - nz * sinAngle;
                const yr = ny;
                const zr = nx * sinAngle + nz * cosAngle;

                const xt = xr;
                const yt = yr * cosTilt - zr * sinTilt;
                const zt = yr * sinTilt + zr * cosTilt;

                const latitude = Math.asin(yt);
                const longitude = Math.atan2(xt, zt);

                const mapX = Math.floor(((longitude + Math.PI) / (2 * Math.PI)) * MAP_W);
                const mapY = Math.floor(((Math.PI / 2 - latitude) / Math.PI) * MAP_H);

                const xIndex = (mapX % MAP_W + MAP_W) % MAP_W;
                const yIndex = Math.max(0, Math.min(MAP_H - 1, mapY));

                const isLand = worldMap[yIndex] && worldMap[yIndex][xIndex] === '#';

                const dot = nx * nlx + ny * nly + nz * nlz;
                const sun = Math.max(0, dot);
                const ambient = 0.08;
                const intensity = ambient + sun * (1 - ambient);
                const edge = 1 - nz;

                let char = ' ';
                let cr = 0, cg = 0, cb = 0, ca = 0;

                if (isLand) {
                    const idx = Math.floor(intensity * 8.9);
                    const landChars = ['.', ':', '~', '=', '+', '*', '#', '%', '@'];
                    char = landChars[Math.max(0, Math.min(8, idx))];
                    cr = Math.floor(30 + 70 * intensity);
                    cg = Math.floor(120 + 135 * intensity);
                    cb = Math.floor(30 + 50 * intensity);
                    ca = 0.15 + intensity * 0.85;
                } else {
                    const idx = Math.floor(intensity * 5.9);
                    const waterChars = [' ', '.', '.', '~', '≈', '≈'];
                    char = waterChars[Math.max(0, Math.min(5, idx))];
                    cr = Math.floor(10 + 40 * intensity);
                    cg = Math.floor(60 + 100 * intensity);
                    cb = Math.floor(140 + 115 * intensity);
                    ca = 0.1 + intensity * 0.7;
                }

                if (edge > 0.85) {
                    const atmoBlend = (edge - 0.85) / 0.15;
                    cr = Math.floor(cr + (120 - cr) * atmoBlend);
                    cg = Math.floor(cg + (180 - cg) * atmoBlend);
                    cb = Math.floor(cb + (255 - cb) * atmoBlend);
                    ca = Math.max(ca, atmoBlend * 0.4);
                    if (char === ' ') char = '.';
                }

                if (char !== ' ') {
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${ca})`;
                    ctx.fillText(char, px, py);
                }
            } else if (distSq <= atmoRSq) {
                const dist = Math.sqrt(distSq);
                const atmoAlpha = 0.25 * (1 - (dist - R) / (atmoR - R));
                ctx.fillStyle = `rgba(80, 160, 255, ${atmoAlpha})`;
                ctx.fillText('.', px, py);
            } else {
                const starVal = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
                const fract = starVal - Math.floor(starVal);
                if (fract > 0.995) {
                    const twinkle = 0.15 + 0.85 * Math.abs(Math.sin(Date.now() * 0.001 + c * 0.3 + r * 0.7));
                    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                    const starChar = starChars[Math.floor(fract * 1000) % starChars.length];
                    ctx.fillText(starChar, px, py);
                }
            }
        }
    }
}

function initTheme(theme) {
    if (theme === 'cmatrix') {
        initMatrix();
    } else if (theme === 'sparks') {
        particles.length = 0;
    }
}

function animate() {
    if (currentTheme === 'sparks') {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        handleParticles();
    } else if (currentTheme === 'cmatrix') {
        drawMatrix();
    } else if (currentTheme === 'clock') {
        drawClock();
    } else if (currentTheme === 'earth') {
        drawEarth();
    }
    requestAnimationFrame(animate);
}

resizeReset();
setTheme(currentTheme);
animate();