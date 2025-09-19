document.querySelectorAll('.hdr-nav a').forEach(a => {
    a.addEventListener('click', e => {
        document.querySelectorAll('.hdr-nav a').forEach(x => x.classList.remove('is-active'));
        e.currentTarget.classList.add('is-active');
    });
});


(function () {
    const bg = document.querySelector('.hero-bg');

    const okPointer = matchMedia('(pointer:fine)').matches;
    const okMotion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!bg || !okPointer || !okMotion) return;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    const maxShift = 60;

    window.addEventListener('mousemove', (e) => {
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX / w - 0.5);
        const ny = (e.clientY / h - 0.5);
        targetX = -nx * maxShift;
        targetY = -ny * maxShift;
    });

    function tick() {
        curX += (targetX - curX) * 0.12;
        curY += (targetY - curY) * 0.12;
        bg.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(1.1)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();



(function () {
    const burger = document.getElementById('hdrBurger');
    const modal = document.getElementById('mnavModal');
    const under = document.getElementById('mnavUnder');
    const close = document.getElementById('mnavClose');
    const root = document.documentElement;

    if (!burger || !modal || !under) return;

    function openMenu() {
        modal.hidden = false; under.hidden = false;
        modal.getBoundingClientRect(); under.getBoundingClientRect();
        modal.classList.add('show'); under.classList.add('show');
        burger.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true');
        root.classList.add('nav-lock');
        const first = modal.querySelector('.mnav-link'); if (first) first.focus({ preventScroll: true });
    }

    function closeMenu() {
        modal.classList.remove('show'); under.classList.remove('show');
        burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
        root.classList.remove('nav-lock');
        setTimeout(() => { modal.hidden = true; under.hidden = true; }, 200);
        burger.focus({ preventScroll: true });
    }

    burger.addEventListener('click', () =>
        burger.classList.contains('is-open') ? closeMenu() : openMenu()
    );
    under.addEventListener('click', closeMenu);
    if (close) close.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && burger.classList.contains('is-open')) closeMenu(); });
    modal.addEventListener('click', e => { const a = e.target.closest('a'); if (a) closeMenu(); });
})();



function fit(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('auto-resize')) fit(e.target);
});

// На всякий — подогнать высоту, если есть предзаполненный текст
document.querySelectorAll('.auto-resize').forEach(fit);







(function () {
    const wrap = document.querySelector('.fx-tilt');
    if (!wrap) return;
    const card = wrap.querySelector('.feedback-form');

    const MAX = 8; // градусы наклона (мягко)
    let rafId = null, tx = 0, ty = 0;

    function onMove(e) {
        const r = wrap.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width;   // 0..1
        const cy = (e.clientY - r.top) / r.height;   // 0..1
        const rotY = (cx - 0.5) * (MAX * 2);         // -MAX..MAX
        const rotX = (0.5 - cy) * (MAX * 2);

        tx = rotX; ty = rotY;
        card.style.setProperty('--mx', (cx * 100) + '%');
        card.style.setProperty('--my', (cy * 100) + '%');

        if (!rafId) rafId = requestAnimationFrame(apply);
    }

    function apply() {
        rafId = null;
        card.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg) translateZ(4px)`;
    }

    function reset() {
        card.style.transform = 'translateZ(0)';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
    }

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', reset);
    // на тачах отключаем эффекты
    wrap.addEventListener('touchstart', () => wrap.classList.add('no-tilt'), { passive: true });
})();

