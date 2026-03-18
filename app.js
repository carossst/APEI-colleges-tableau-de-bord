// ===================================================
// Val-d'Oise Lab2034 - Dashboard Impact Qualitative
// app.js - Charts, tables, timelines, and interactions
// ===================================================

Chart.defaults.font.family = (getComputedStyle(document.body).fontFamily || 'system-ui');
Chart.defaults.font.size = 14;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;

const C = {
  b2021: '#1f77b4',
  b2023: '#f2c94c',
  b2024: '#e8634a',
  navy: '#1a2744',
  teal: '#27ae60',
  gold: '#f2994a'
};

async function loadData() {
  const response = await fetch('./matrice-globale.json');
  if (!response.ok) throw new Error('Impossible de charger matrice-globale.json');
  return response.json();
}

loadData()
  .then((DATA) => {
    injectIntro(DATA);
    createRadarChart(DATA);
    createBarChart(DATA);
    buildHeatmapTables(DATA);
    buildTimelines(DATA);
    createLineChart(DATA);
    createLineAxesChart(DATA);
    initTabKeyboard();
    initNavActiveState();
  })
  .catch((error) => {
    console.error(error);
  });

function injectIntro(DATA) {
  const intro = DATA.pageIntro || {};
  const context = intro.context || {};
  const method = intro.method || {};
  const usage = intro.usage || {};

  setText('intro-context-title', context.title);
  setText('intro-context-text', context.text);
  setText('intro-method-title', method.title);
  setText('intro-method-text', method.text);
  setText('intro-usage-title', usage.title);
  setText('intro-usage-text', usage.text);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && typeof value === 'string') el.textContent = value;
}

function wrapRadarLabel(label) {
  const s = String(label || '').trim();
  if (!s || s.length <= 18) return s;
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return parts;
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')];
}

function createRadarChart(DATA) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: DATA.axes.map((a) => a.label),
      datasets: [
        {
          label: '2021',
          data: DATA.axes.map((a) => a.values['2021']),
          borderColor: C.b2021,
          backgroundColor: 'rgba(31,119,180,0.16)',
          pointBackgroundColor: C.b2021,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2023',
          data: DATA.axes.map((a) => a.values['2023']),
          borderColor: C.b2023,
          backgroundColor: 'rgba(242,201,76,0.16)',
          pointBackgroundColor: C.b2023,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2024',
          data: DATA.axes.map((a) => a.values['2024']),
          borderColor: C.b2024,
          backgroundColor: 'rgba(232,99,74,0.16)',
          pointBackgroundColor: C.b2024,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 18 },
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent',
            color: 'rgba(26,39,68,0.55)',
            font: { size: 12 }
          },
          grid: { color: 'rgba(26,39,68,0.10)' },
          angleLines: { color: 'rgba(26,39,68,0.10)' },
          pointLabels: {
            color: C.navy,
            font: { size: 14, weight: 800 },
            padding: 10,
            callback: (v) => wrapRadarLabel(v)
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label} : ${Number(ctx.raw).toFixed(1)} /4`
          }
        }
      }
    }
  });
}

function createBarChart(DATA) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: DATA.axes.map((a) => a.label),
      datasets: [
        {
          label: '2021',
          data: DATA.axes.map((a) => a.values['2021']),
          backgroundColor: C.b2021,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2023',
          data: DATA.axes.map((a) => a.values['2023']),
          backgroundColor: C.b2023,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2024',
          data: DATA.axes.map((a) => a.values['2024']),
          backgroundColor: C.b2024,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            callback: (value) => Number(value).toFixed(0)
          },
          grid: { color: 'rgba(0,0,0,.06)' }
        },
        y: {
          ticks: { font: { size: 12 } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label} : ${Number(ctx.raw).toFixed(1)} /4`
          }
        }
      }
    }
  });
}

function createLineChart(DATA) {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;

  const years = ['2021', '2023', '2024'];
  const avgs = years.map((year) => {
    const total = DATA.axes.reduce((sum, axis) => sum + axis.values[year], 0);
    return +(total / DATA.axes.length).toFixed(1);
  });

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Moyenne globale /4',
        data: avgs,
        borderColor: C.navy,
        backgroundColor: 'rgba(26,39,68,.08)',
        tension: 0.3,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: C.navy
      }]
    },
    options: {
      responsive: true,
      scales: { y: { min: 1.5, max: 3.5 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${Number(ctx.raw).toFixed(1)} /4`
          }
        }
      }
    }
  });
}

function createLineAxesChart(DATA) {
  const canvas = document.getElementById('lineAxesChart');
  if (!canvas) return;

  const years = ['2021', '2023', '2024'];
  const axColors = [C.b2021, C.b2023, C.b2024, C.teal, C.gold];

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: DATA.axes.map((axis, i) => ({
        label: axis.label,
        data: years.map((year) => axis.values[year]),
        borderColor: axColors[i],
        backgroundColor: 'transparent',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: axColors[i]
      }))
    },
    options: {
      responsive: true,
      scales: { y: { min: 1, max: 4 } },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 11 } }
        }
      }
    }
  });
}

function heatClass(v) {
  if (v >= 3.5) return 'h4';
  if (v >= 2.5) return 'h3';
  if (v >= 1.5) return 'h2';
  return 'h1';
}

function buildHeatmapTables(DATA) {
  buildTable('tbody2021', DATA.etablissements2021);
  buildTable('tbody2023', DATA.etablissements2023);
  buildTable('tbody2024', DATA.etablissements2024);
}

function buildTable(id, list) {
  const tb = document.getElementById(id);
  if (!tb) return;

  const rows = list.map((etablissement) => {
    const avg = (etablissement.scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
    const cells = etablissement.scores
      .map((score) => `<td class="${heatClass(score)}">${score}</td>`)
      .join('');

    return `<tr>
      <td class="name">${etablissement.nom}<br><small style="color:var(--muted)">${etablissement.ville}</small></td>
      ${cells}
      <td class="${heatClass(+avg)}"><strong>${avg}</strong></td>
    </tr>`;
  });

  tb.innerHTML = rows.join('');
}

function renderTimeline(items, containerId, type) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const html = items.map((item) => `
    <div class="tl-item">
      <div class="tl-dot ${type}"></div>
      <div class="tl-content">
        <strong>${item.titre}</strong>
        <p>${item.detail}</p>
        ${item.source ? `<div class="src">- ${item.source}</div>` : ''}
      </div>
    </div>`).join('');

  el.innerHTML = html;
}

function uniqueByTitle(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.titre}||${item.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildGlobalItems(items) {
  const byTitle = new Map();

  items.forEach((item) => {
    const key = `${item.titre}||${item.detail}`;
    if (!byTitle.has(key)) {
      byTitle.set(key, { ...item, years: [item.annee] });
      return;
    }
    byTitle.get(key).years.push(item.annee);
  });

  return Array.from(byTitle.values()).map((item) => ({
    titre: item.titre,
    detail: item.detail,
    source: `Analyses ${item.years.sort().join(' / ')}`
  }));
}

function buildTimelines(DATA) {
  const pos = uniqueByTitle(DATA.pointsPositifs || []);
  const neg = uniqueByTitle(DATA.difficultes || []);

  renderTimeline(buildGlobalItems(pos), 'tl-global-pos', 'pos');
  renderTimeline(buildGlobalItems(neg), 'tl-global-neg', 'neg');

  ['2021', '2023', '2024'].forEach((year) => {
    renderTimeline(pos.filter((item) => item.annee === year), `tl-pos-${year}`, 'pos');
    renderTimeline(neg.filter((item) => item.annee === year), `tl-neg-${year}`, 'neg');
  });
}

function switchTab(btn, paneId) {
  const card = btn.closest('.card');
  if (!card) return;

  card.querySelectorAll('[role="tab"]').forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
  });

  card.querySelectorAll('[role="tabpanel"]').forEach((pane) => {
    pane.classList.remove('active');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');
  btn.focus();

  const pane = document.getElementById(paneId);
  if (pane) pane.classList.add('active');
}

function initTabKeyboard() {
  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    tablist.addEventListener('keydown', (event) => {
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      const nextTab = tabs[nextIndex];
      switchTab(nextTab, nextTab.getAttribute('aria-controls'));
    });
  });
}

function initNavActiveState() {
  const links = Array.from(document.querySelectorAll('.nav a'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href').replace('#', '');
      setActive(targetId);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0.2, 0.4, 0.6]
  });

  sections.forEach((section) => observer.observe(section));
}
