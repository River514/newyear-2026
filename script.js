window.addEventListener("DOMContentLoaded", () => {
    console.log("跨年页面已启动");

    // ✅ 新增：确保背景视频播放（移动端兼容）
    const bgVideo = document.getElementById("bg-video");
    if (bgVideo) {
        bgVideo.muted = true; // 确保静音
        bgVideo.play().catch(error => {
            console.log("视频自动播放被阻止，等待用户交互", error);
            // 监听用户首次交互后播放视频
            const playVideoOnInteraction = () => {
                bgVideo.play().catch(e => console.log("视频播放失败", e));
                document.removeEventListener('click', playVideoOnInteraction);
                document.removeEventListener('touchstart', playVideoOnInteraction);
            };
            document.addEventListener('click', playVideoOnInteraction);
            document.addEventListener('touchstart', playVideoOnInteraction);
        });
    }

    // 倒计时元素
    const dEl = document.getElementById("d");
    const hEl = document.getElementById("h");
    const mEl = document.getElementById("m");
    const sEl = document.getElementById("s");
    const msgEl = document.getElementById("newyear-msg");
    const letterEl = document.getElementById("love-letter");
    const wishesEl = document.getElementById("new-year-wishes");
    const actionButtons = document.getElementById("action-buttons");
    const viewLetterBtn = document.getElementById("view-letter-btn");
    const viewWishesBtn = document.getElementById("view-wishes-btn");
    const backFromLetterBtn = document.getElementById("back-from-letter");
    const backFromWishesBtn = document.getElementById("back-from-wishes");

   // ================= 音乐逻辑 =================
const musicEl = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

updateMusicIcon();

const startMusic = () => {
    if (!musicEl.paused) return;

    musicEl.muted = false;
    musicEl.volume = 0.8;
    musicEl.play().then(() => {
        updateMusicIcon();
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
    }).catch(error => {
        console.log("浏览器拦截自动播放，等待用户交互...");
    });
};

startMusic();

document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

if (musicToggle && musicEl) {
    musicToggle.addEventListener("click", (e) => {
        e.stopPropagation();

        if (musicEl.paused) {
            startMusic();
        } else {
            musicEl.pause();
            updateMusicIcon();
        }
    });
}

function updateMusicIcon() {
    if (!musicToggle || !musicEl) return;
    if (!musicEl.paused) {
        musicToggle.textContent = "🎵";
        musicToggle.classList.remove("muted");
        musicToggle.setAttribute("aria-label", "关闭音乐");
        musicToggle.setAttribute("title", "关闭音乐");
    } else {
        musicToggle.textContent = "🔇";
        musicToggle.classList.add("muted");
        musicToggle.setAttribute("aria-label", "开启音乐");
        musicToggle.setAttribute("title", "开启音乐");
    }
}
// ================= 音乐逻辑结束 =================
    
    // ================= 页面切换逻辑 ================= 
    // 查看情书按钮
    if (viewLetterBtn) {
        viewLetterBtn.addEventListener('click', () => {
            if (letterEl) {
                letterEl.classList.remove("hidden");
            }
        });
    }

    // 查看新年祝福按钮
    if (viewWishesBtn) {
        viewWishesBtn.addEventListener('click', () => {
            if (wishesEl) {
                wishesEl.classList.remove("hidden");
            }
        });
    }

    // 从情书返回
    if (backFromLetterBtn && letterEl) {
        backFromLetterBtn.addEventListener('click', () => {
            letterEl.classList.add("hidden");
        });
    }

    // 从新年祝福返回
    if (backFromWishesBtn && wishesEl) {
        backFromWishesBtn.addEventListener('click', () => {
            wishesEl.classList.add("hidden");
        });
    }
    // ================= 页面切换逻辑结束 =================

    // 倒计时逻辑
    if (!dEl || !hEl || !mEl || !sEl) {
        console.error("❌ 找不到倒计时元素");
        return;
    }

   // const target = new Date(2026, 0, 1, 0, 0, 0).getTime();
    const target = Date.now() + 5000; // 测试用：5秒后倒计时结束

    const pad = (n) => String(n).padStart(2, "0");

    const timer = setInterval(() => {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            clearInterval(timer);

            dEl.textContent = "00";
            hEl.textContent = "00";
            mEl.textContent = "00";
            sEl.textContent = "00";

            // ✅ 零点事件顺序：
            // 1. 立即开始烟花
            launchFireworks();

            // 2. 显示"新年快乐，蓓蓓！" - 2秒
            msgEl.classList.remove("hidden");

            setTimeout(() => {
                // 3. 隐藏"新年快乐"，显示"新年祝福" - 10秒
                msgEl.classList.add("hidden");
                if (wishesEl) {
                    wishesEl.classList.remove("hidden");
                }

                setTimeout(() => {
                    // 4. 隐藏"新年祝福"，显示"情书"
                    if (wishesEl) {
                        wishesEl.classList.add("hidden");
                    }
                    if (letterEl) {
                        letterEl.classList.remove("hidden");
                    }

                    // 5. 0.5秒后显示操作按钮
                    setTimeout(() => {
                        if (actionButtons) {
                            actionButtons.classList.remove("hidden");
                        }
                    }, 500);

                }, 8000); // 新年祝福显示10秒

            }, 2000); // "新年快乐"显示2秒

            return;
        }

        const sec = Math.floor(diff / 1000);
        dEl.textContent = pad(Math.floor(sec / 86400));
        hEl.textContent = pad(Math.floor((sec % 86400) / 3600));
        mEl.textContent = pad(Math.floor((sec % 3600) / 60));
        sEl.textContent = pad(sec % 60);
    }, 1000);

    initPhotoSlider();
});

// ===== 满屏烟花效果 =====
function launchFireworks() {
    const canvas = document.getElementById("fireworks");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.classList.remove("hidden");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ["#ff6b81", "#ff4757", "#eccc68", "#7bed9f", "#ffffff", "#a29bfe"];

    function createParticle(x, y) {
        const count = 30 + Math.random() * 20;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;

            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: Math.random() * 50 + 50,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                gravity: 0.05
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.05) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height * 0.6);
            createParticle(startX, startY);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.life--;
            p.alpha -= 0.015;

            if (p.life <= 0 || p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// ===== 照片轮播（时空穿梭效果） =====
function initPhotoSlider() {
    const slides = document.querySelectorAll('.photo-slide');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!slides.length || !dotsContainer) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dots .dot');

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    setInterval(nextSlide, 2000);
}







