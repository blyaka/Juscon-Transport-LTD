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




(function () {
    const ta = document.getElementById('comment');
    if (!ta) return;

    // фиксируем базовую высоту (как у инпута) один раз
    const setBase = () => {
        // принудительно выставим старт
        ta.style.height = '32px';
        // запомним базовое значение по факту рендера
        ta.dataset.baseHeight = ta.scrollHeight; // это будет ≈ одной строке
        ta.style.height = ta.dataset.baseHeight + 'px';
    };

    const autoresize = () => {
        const base = parseInt(ta.dataset.baseHeight || '32', 10);
        ta.style.height = 'auto';
        const h = Math.max(ta.scrollHeight, base);
        ta.style.height = h + 'px';
    };

    // на загрузке — фиксируем базу и выравниваем (учтёт автозаполнение)
    window.addEventListener('load', () => { setBase(); autoresize(); }, { once: true });

    // при вводе/вставке — растим, но не меньше базы
    ta.addEventListener('input', autoresize, { passive: true });
    ta.addEventListener('paste', () => requestAnimationFrame(autoresize));
})();



(function () {
    const form = document.getElementById('contactForm');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    // ===== Маска телефона =====
    const formatPhone = (digits) => {
        digits = digits.replace(/\D/g, '');

        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] === '9') digits = '7' + digits;
        if (digits[0] !== '7') digits = '7' + (digits.slice(0, 10) || '');

        digits = digits.slice(0, 11);

        const p = digits.padEnd(11, '_').split('');
        return `+7 ${p[1]}${p[2]}${p[3]} ${p[4]}${p[5]}${p[6]} ${p[7]}${p[8]} ${p[9]}${p[10]}`.replace(/_/g, '');
    };

    const placeCaretToEnd = (el) => {
        const len = el.value.length;
        el.setSelectionRange(len, len);
    };

    const applyMask = () => {
        const raw = phone.value;
        const masked = formatPhone(raw);
        phone.value = masked;
        setTimeout(() => placeCaretToEnd(phone), 0);
    };

    // === Изменения здесь ===
    // при фокусе: если пусто — вставить +7 
    phone.addEventListener('focus', () => {
        if (!phone.value.trim()) {
            phone.value = '+7 ';
            placeCaretToEnd(phone);
        }
    });

    ['input', 'paste'].forEach(evt => {
        phone.addEventListener(evt, applyMask, { passive: true });
    });

    // при блюре: если осталось только "+7" без цифр — очищаем поле
    phone.addEventListener('blur', () => {
        if (phone.value.trim() === '+7') {
            phone.value = '';
        }
    });

    // ===== Email =====
    email.addEventListener('input', () => {
        if (email.value.includes('@')) {
            email.setCustomValidity('');
        } else {
            email.setCustomValidity('Email должен содержать символ @');
        }
    });

    // ===== Сабмит =====
    form.addEventListener('submit', (e) => {
        applyMask();

        const digits = phone.value.replace(/\D/g, '');
        if (digits.length !== 11) {
            phone.setCustomValidity('Введите телефон полностью');
        } else {
            phone.setCustomValidity('');
        }

        if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity();
        }
    });
})();
