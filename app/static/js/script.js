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
    const phone = document.getElementById('phone');

    // Форматирование в +7 9xx xxx xx xx
    function formatPhoneFromDigits(digits) {
        if (!digits) return '';
        // нормализуем старт
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] === '9') digits = '7' + digits;
        if (digits[0] !== '7') digits = '7' + digits.slice(0, 10);
        digits = digits.replace(/\D/g, '').slice(0, 11);

        const p = (digits + '___________').slice(0, 11).split('');
        return (`+7 ${p[1]}${p[2]}${p[3]} ${p[4]}${p[5]}${p[6]} ${p[7]}${p[8]} ${p[9]}${p[10]}`).trim();
    }

    // Ставим формат, сохраняя каретку (чтобы можно было удалять в середине)
    function applyMaskPreserveCaret(e) {
        const start = phone.selectionStart;
        const before = phone.value.slice(0, start);
        const digitsBefore = before.replace(/\D/g, '').length;

        const digitsAll = phone.value.replace(/\D/g, '');
        const formatted = formatPhoneFromDigits(digitsAll);

        phone.value = formatted;

        // Восстановим позицию каретки относительно количества цифр слева
        let i = 0, count = 0;
        while (i < phone.value.length && count < digitsBefore) {
            if (/\d/.test(phone.value[i])) count++;
            i++;
        }
        phone.setSelectionRange(i, i);
    }

    // Разрешаем полноценное стирание
    phone.addEventListener('keydown', (e) => {
        // Ctrl+A — ок
        if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) return;

        // Полное очищение по Backspace/Delete, если осталась только «7» (или совсем мало цифр)
        const digits = phone.value.replace(/\D/g, '');
        if ((e.key === 'Backspace' || e.key === 'Delete') && digits.length <= 1) {
            e.preventDefault();
            phone.value = '';
            return;
        }
    });

    // Маска при вводе/вставке
    phone.addEventListener('input', applyMaskPreserveCaret);

    // Не навязываем +7 при фокусе. На блюре — если остался только «+7» → чистим.
    phone.addEventListener('blur', () => {
        if (phone.value.trim() === '+7' || phone.value.replace(/\D/g, '').length <= 1) {
            phone.value = '';
        }
    });
})();