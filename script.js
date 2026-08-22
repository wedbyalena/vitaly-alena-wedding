const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxFYJP0UmFrNY6yfdHtPtaS3Y7iFTaPhJcPPImi8iXDn_MdMdOpGyOOBaj972U5RH1S/exec';

const weddingDate = new Date('2026-11-07T16:00:00+07:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (diff <= 0) {
    daysEl.textContent = '0';
    hoursEl.textContent = '0';
    minutesEl.textContent = '0';
    secondsEl.textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  if (!toTop) return;
  toTop.classList.toggle('show', window.scrollY > 500);
});

if (toTop) {
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const guestForm = document.getElementById('guestForm');
const formStatus = document.getElementById('formStatus');

if (guestForm) {
  guestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!guestForm.reportValidity()) return;

    const submitButton = guestForm.querySelector('button[type="submit"]');

    const formData = new FormData(guestForm);

    const alcohol = Array.from(
      guestForm.querySelectorAll('input[name="alcohol"]:checked')
    ).map((input) => input.value);

    const payload = {
      name: formData.get('name'),
      guests: formData.get('guests'),
      alcohol: alcohol.join(', '),
      attendance: formData.get('attendance')
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправляем...';
    }

    if (formStatus) {
      formStatus.textContent = '';
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (formStatus) {
        formStatus.textContent = 'Спасибо! Ваш ответ отправлен ❤️';
      }

      guestForm.reset();
    } catch (error) {
      console.error(error);

      if (formStatus) {
        formStatus.textContent =
          'Не удалось отправить ответ. Пожалуйста, попробуйте ещё раз.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить ответ';
      }
    }
  });
}// Фоновая музыка
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

if (musicToggle && bgMusic) {
  bgMusic.volume = 0.28;

  musicToggle.addEventListener('click', async () => {
    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Выключить музыку');
        musicToggle.textContent = '❚❚';
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('is-playing');
        musicToggle.setAttribute('aria-pressed', 'false');
        musicToggle.setAttribute('aria-label', 'Включить музыку');
        musicToggle.textContent = '♫';
      }
    } catch (err) {
      console.log('Музыка не запустилась', err);
    }
  });
}
