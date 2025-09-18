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
