/* ============================================================
   SISTEMA DE VISUALIZAÇÃO DIFERENCIADO & OTIMIZADO (MODELO 6):
   HUD HOLOGRAPHIC CANVAS - VELOCIDADE SUAVE E DURAÇÃO AJUSTADA
   ============================================================ */

(function() {
    // Injetar estilos do Modelo 6
    if (!document.getElementById('floating-fx-v6-styles')) {
        ['floating-fx-v2-styles', 'floating-fx-v3-styles', 'floating-fx-v4-styles', 'floating-fx-v5-styles'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        const style = document.createElement('style');
        style.id = 'floating-fx-v6-styles';
        style.textContent = `
            #fxCanvasV6Overlay {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 99999;
                width: 100vw;
                height: 100vh;
            }
        `;
        document.head.appendChild(style);
    }

    let canvas = document.getElementById('fxCanvasV6Overlay');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'fxCanvasV6Overlay';
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const activeOrbs = [];
    let animFrameId = null;

    class ResourceOrbFX {
        constructor(x, y, text, type) {
            this.x = x + (Math.random() - 0.5) * 15;
            this.y = y;
            this.text = text;
            this.type = type;
            this.life = 1.0;
            // Decay reduzido para durar mais tempo na tela (~1.3s em vez de 0.7s)
            this.decay = 0.012;

            // Velocidade reduzida pela metade para subir de forma suave e legível
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            const speed = 1.6 + Math.random() * 0.8; // Bem mais calmo e controlado
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = -0.04; // Flutuação sutil pra cima

            this.scale = 0.5;
            this.targetScale = 1.0;

            const palette = {
                item: { primary: '#f0c8ff', border: '#c96ac9', bg: 'rgba(24, 12, 38, 0.92)', glow: 'rgba(201, 106, 201, 0.45)' },
                xp: { primary: '#75ff75', border: '#4aff4a', bg: 'rgba(8, 32, 16, 0.92)', glow: 'rgba(74, 255, 74, 0.45)' },
                gold: { primary: '#ffe555', border: '#ffd700', bg: 'rgba(40, 32, 6, 0.92)', glow: 'rgba(255, 215, 0, 0.5)' },
                damage: { primary: '#ff6666', border: '#ff3333', bg: 'rgba(40, 8, 12, 0.92)', glow: 'rgba(255, 51, 51, 0.45)' }
            };

            this.style = palette[type] || palette.item;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.97;
            this.life -= this.decay;

            if (this.scale < this.targetScale) {
                this.scale += 0.08;
            }
        }

        draw(ctx) {
            if (this.life <= 0) return;

            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.translate(this.x, this.y);
            ctx.scale(this.scale, this.scale);

            ctx.font = 'bold 15px "Outfit", sans-serif';
            const metrics = ctx.measureText(this.text);
            const paddingX = 14;
            const paddingY = 8;
            const w = metrics.width + paddingX * 2;
            const h = 28;
            const rx = -w / 2;
            const ry = -h / 2;

            ctx.shadowColor = this.style.glow;
            ctx.shadowBlur = 10;

            ctx.fillStyle = this.style.bg;
            ctx.beginPath();
            ctx.roundRect(rx, ry, w, h, 14);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = this.style.border;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.roundRect(rx + 2, ry + 2, w - 4, h - 4, 12);
            ctx.stroke();

            ctx.fillStyle = this.style.primary;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, 0, 1);

            ctx.restore();
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = activeOrbs.length - 1; i >= 0; i--) {
            const orb = activeOrbs[i];
            orb.update();
            orb.draw(ctx);

            if (orb.life <= 0) {
                activeOrbs.splice(i, 1);
            }
        }

        if (activeOrbs.length > 0) {
            animFrameId = requestAnimationFrame(renderLoop);
        } else {
            animFrameId = null;
        }
    }

    window.spawnFloatingText = function(x, y, text, options = {}) {
        const cx = x !== null && x !== undefined ? x : window.innerWidth / 2;
        const cy = y !== null && y !== undefined ? y : window.innerHeight / 2;
        const type = options.type || 'item';

        activeOrbs.push(new ResourceOrbFX(cx, cy, text, type));

        if (activeOrbs.length > 25) {
            activeOrbs.shift();
        }

        if (!animFrameId) {
            animFrameId = requestAnimationFrame(renderLoop);
        }
    };

})();
