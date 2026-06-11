const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterEls = document.querySelectorAll('.stat-number[data-target]');
if (counterEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

const skillBars = document.querySelectorAll('.skill-bar[data-width]');
if (skillBars.length > 0) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => barObserver.observe(bar));
}
const heroCanvas = document.getElementById('heroChart');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  heroCanvas.width  = heroCanvas.parentElement.clientWidth - 48;
  heroCanvas.height = 220;

  const W = heroCanvas.width;
  const H = heroCanvas.height;

  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const data   = [4, 5, 6, 8, 7, 10, 12, 11, 14, 15, 16, 18];

  const padL = 36, padR = 16, padT = 20, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minVal = 0, maxVal = 20;

  function toX(i) { return padL + (i / (data.length - 1)) * chartW; }
  function toY(v) { return padT + chartH - ((v - minVal) / (maxVal - minVal)) * chartH; }

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  [5, 10, 15, 20].forEach(v => {
    ctx.beginPath();
    ctx.moveTo(padL, toY(v));
    ctx.lineTo(W - padR, toY(v));
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px monospace';
    ctx.fillText(v, 0, toY(v) + 4);
  });

  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, 'rgba(0,212,168,0.25)');
  grad.addColorStop(1, 'rgba(0,212,168,0)');

  ctx.beginPath();
  data.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.lineTo(toX(data.length - 1), padT + chartH);
  ctx.lineTo(toX(0), padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = '#00d4a8';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  data.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v));
    else ctx.lineTo(toX(i), toY(v));
  });
  ctx.stroke();


  data.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(toX(i), toY(v), 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4a8';
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(138,145,168,0.7)';
  ctx.font = '10px monospace';
  labels.forEach((label, i) => {
    if (i % 2 === 0) {
      ctx.fillText(label, toX(i) - 10, H - 4);
    }
  });

  ctx.fillStyle = 'rgba(138,145,168,0.6)';
  ctx.font = '11px system-ui';
  ctx.fillText('curva de aprendizado — horas de estudo por semana', padL, 12);
}

const filterBtns  = document.querySelectorAll('.filter-btn');
const linkCards   = document.querySelectorAll('.link-card');
const linksCount  = document.getElementById('linksCount');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible = 0;

      linkCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      if (linksCount) {
        linksCount.innerHTML = `Exibindo <strong>${visible}</strong> recursos`;
      }
    });
  });
}