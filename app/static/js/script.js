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