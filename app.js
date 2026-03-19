// ===================================================
// Val-d'Oise Lab2034 - Analyse d'impact qualitative
// app.js - version renforcée (robustesse, cohérence, accessibilité)
// ===================================================

if (window.Chart) {
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily || 'system-ui';
  Chart.defaults.font.size = 14;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
}

const C = {
  b2021: '#1f77b4',
  b2023: '#f2c94c',
  b2024: '#e8634a',
  navy: '#1a2744',
  teal: '#27ae60',
  coral: '#e8634a',
  gold: '#f2994a'
};

const YEARS = ['2021', '2023', '2024'];

initTabs();
initNavScrollSpy();

loadData()
  .then((data) => {
    hydrateIntro(data);
    buildHeatmapTables(data);
    buildTimelines(data);
    writeChartSummaries(data);
    createCharts(data);
  })
  .catch((error) => {
    console.error(error);
    showLoadError();
    fillFallbackSummaries();
  });

async function loadData() {
  const response = await fetch('./matrice-globale.json');
  if (!response.ok) {
    throw new Error('Impossible de charger matrice-globale.json');
  }
  return response.json();
}

function showLoadError() {
  const el = document.getElementById('data-load-error');
  if (!el) return;
  el.hidden = false;
  el.innerHTML = '<p><strong>Chargement impossible :</strong> les données n\'ont pas pu être chargées. Vérifier la présence du fichier <code>matrice-globale.json</code> et les chemins de déploiement.</p>';
}

function fillFallbackSummaries() {
  setText('summary-radar', "Le résumé visuel n'est pas disponible tant que les données ne sont pas chargées.");
  setText('summary-bar', "La comparaison par axe n'est pas disponible tant que les données ne sont pas chargées.");
  setText('summary-line', "L'évolution moyenne ne peut pas être calculée sans les données.");
  setText('summary-line-axes', "Le détail par axe ne peut pas être calculé sans les données.");
}

function hydrateIntro(data) {
  const intro = data.pageIntro || {};
  setText('intro-context-title', intro.context?.title || 'Ce que présente cette page');
  setText('intro-context-text', intro.context?.text || "Lecture synthétique des analyses d'impact qualitatives.");
  setText('intro-method-title', intro.method?.title || 'Comment lire la matrice');
  setText('intro-method-text', intro.method?.text || 'Cinq axes, notés sur une échelle de 1 à 4.');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function createCharts(data) {
  if (!window.Chart) {
    console.warn("Chart.js indisponible.");
    return;
  }

  createRadarChart(data);
  createBarChart(data);
  createLineChart(data);
  createLineAxesChart(data);
}

function wrapRadarLabel(label) {
  const s = String(label || '').trim();
  if (!s || s.length <= 18) return s;
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return parts;
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')];
}

function createRadarChart(data) {
  const el = document.getElementById('radarChart');
  if (!el) return;

  new Chart(el, {
    type: 'radar',
    data: {
      labels: data.axes.map((a) => a.label),
      datasets: [
        {
          label: '2021',
          data: data.axes.map((a) => a.values['2021']),
          borderColor: C.b2021,
          backgroundColor: 'rgba(31,119,180,0.16)',
          pointBackgroundColor: C.b2021,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2023',
          data: data.axes.map((a) => a.values['2023']),
          borderColor: C.b2023,
          backgroundColor: 'rgba(242,201,76,0.16)',
          pointBackgroundColor: C.b2023,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2024',
          data: data.axes.map((a) => a.values['2024']),
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
            callback: (value) => wrapRadarLabel(value)
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

function createBarChart(data) {
  const el = document.getElementById('barChart');
  if (!el) return;

  new Chart(el, {
    type: 'bar',
    data: {
      labels: data.axes.map((a) => a.label),
      datasets: [
        {
          label: '2021',
          data: data.axes.map((a) => a.values['2021']),
          backgroundColor: C.b2021,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2023',
          data: data.axes.map((a) => a.values['2023']),
          backgroundColor: C.b2023,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2024',
          data: data.axes.map((a) => a.values['2024']),
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

function createLineChart(data) {
  const el = document.getElementById('lineChart');
  if (!el) return;

  const avgs = YEARS.map((year) => averageAxisValue(data.axes, year));

  new Chart(el, {
    type: 'line',
    data: {
      labels: YEARS,
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
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1.5,
          max: 3.5,
          ticks: { stepSize: 0.5 }
        }
      },
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

function createLineAxesChart(data) {
  const el = document.getElementById('lineAxesChart');
  if (!el) return;

  const axColors = [C.b2021, C.b2023, C.b2024, C.teal, C.gold];

  new Chart(el, {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: data.axes.map((axis, index) => ({
        label: axis.label,
        data: YEARS.map((year) => axis.values[year]),
        borderColor: axColors[index],
        backgroundColor: 'transparent',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: axColors[index]
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1,
          max: 4,
          ticks: { stepSize: 0.5 }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 11 } }
        }
      }
    }
  });
}

function averageAxisValue(axes, year) {
  const sum = axes.reduce((acc, axis) => acc + axis.values[year], 0);
  return +(sum / axes.length).toFixed(1);
}

function impactLabel(value) {
  if (value >= 3.5) return 'Très fort';
  if (value >= 2.5) return 'Fort';
  if (value >= 1.5) return 'Modéré';
  return 'Faible';
}

function heatClass(value) {
  if (value >= 3.5) return 'h4';
  if (value >= 2.5) return 'h3';
  if (value >= 1.5) return 'h2';
  return 'h1';
}

function buildHeatmapTables(data) {
  buildTable('tbody2021', data.etablissements2021);
  buildTable('tbody2023', data.etablissements2023);
  buildTable('tbody2024', data.etablissements2024);
}

function buildTable(id, list) {
  const tbody = document.getElementById(id);
  if (!tbody || !Array.isArray(list)) return;

  tbody.innerHTML = '';

  list.forEach((item) => {
    const row = document.createElement('tr');
    const avg = +(item.scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);

    const nameCell = document.createElement('td');
    nameCell.className = 'name';
    nameCell.innerHTML = `${escapeHtml(item.nom)}<br><small style="color:var(--muted)">${escapeHtml(item.ville)}${item.type ? ` - ${escapeHtml(item.type)}` : ''}</small>`;
    row.appendChild(nameCell);

    item.scores.forEach((score) => {
      row.appendChild(buildScoreCell(score));
    });

    const avgCell = buildScoreCell(avg, true);
    row.appendChild(avgCell);
    tbody.appendChild(row);
  });
}

function buildScoreCell(score, isAverage = false) {
  const cell = document.createElement('td');
  const label = impactLabel(score);
  cell.className = `${heatClass(score)} score-cell`;
  cell.setAttribute('aria-label', `score ${score} sur 4 - ${label.toLowerCase()} impact`);
  cell.innerHTML = `<span class="score-value">${escapeHtml(String(score))}</span><span class="score-label">${escapeHtml(label)}</span>`;

  if (isAverage) {
    const strong = document.createElement('strong');
    strong.innerHTML = cell.innerHTML;
    cell.innerHTML = '';
    cell.appendChild(strong);
  }

  return cell;
}

function renderTimeline(items, containerId, type) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  items.forEach((item) => {
    el.innerHTML += `
      <div class="tl-item">
        <div class="tl-dot ${type}"></div>
        <div class="tl-content">
          <strong>${escapeHtml(item.titre)}</strong>
          <p>${escapeHtml(item.detail)}</p>
          ${item.role && item.citation && item.source ? `<div class="src"><strong>${escapeHtml(item.role)} :</strong> "${escapeHtml(item.citation)}" - ${escapeHtml(item.source)}</div>` : ''}
        </div>
      </div>`;
  });
}

function buildTimelines(data) {
  const globalPos = data.pointsGlobaux || [];
  const globalNeg = data.difficultesGlobales || [];

  renderTimeline(globalPos, 'tl-global-pos', 'pos');
  renderTimeline(globalNeg, 'tl-global-neg', 'neg');

  YEARS.forEach((year) => {
    renderTimeline((data.pointsPositifs || []).filter((item) => item.annee === year), `tl-pos-${year}`, 'pos');
    renderTimeline((data.difficultes || []).filter((item) => item.annee === year), `tl-neg-${year}`, 'neg');
  });
}


function writeChartSummaries(data) {
  const axisSorted = [...data.axes].sort((a, b) => averageAcrossYears(b.values) - averageAcrossYears(a.values));
  const topAxis = axisSorted[0];
  const lowAxis = axisSorted[axisSorted.length - 1];

  const deltas = data.axes
    .map((axis) => ({
      label: axis.label,
      diff: +(axis.values['2024'] - axis.values['2021']).toFixed(1)
    }))
    .sort((a, b) => b.diff - a.diff);

  const bestDelta = deltas[0];
  const worstDelta = deltas[deltas.length - 1];
  const avg2021 = averageAxisValue(data.axes, '2021').toFixed(1);
  const avg2023 = averageAxisValue(data.axes, '2023').toFixed(1);
  const avg2024 = averageAxisValue(data.axes, '2024').toFixed(1);

  setText('summary-radar', `Lecture rapide : sur les trois analyses, "${topAxis.label}" apparaît comme l'axe le plus solide, tandis que "${lowAxis.label}" reste le plus fragile.`);
  setText('summary-bar', `La comparaison par axe confirme une structure globalement stable : des acquis durables sur les espaces, des évolutions plus contrastées sur les autres axes et une fragilité persistante sur la relation avec les autres parties prenantes.`);
  setText('summary-line', `La moyenne globale reste proche d'une analyse à l'autre : ${avg2021} /4 en 2021, ${avg2023} /4 en 2023 et ${avg2024} /4 en 2024. L'ensemble traduit davantage une continuité qu'une rupture.`);
  setText('summary-line-axes', `Sur l'ensemble de la période, la progression la plus nette concerne "${bestDelta.label}" (${bestDelta.diff >= 0 ? '+' : ''}${bestDelta.diff}), tandis que "${worstDelta.label}" apparaît comme l'axe le moins dynamique (${worstDelta.diff >= 0 ? '+' : ''}${worstDelta.diff}).`);
}

function averageAcrossYears(values) {
  return (values['2021'] + values['2023'] + values['2024']) / 3;
}

function initTabs() {
  const tablists = document.querySelectorAll('[role="tablist"]');

  tablists.forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activateTab(tabs, tab);
      });

      tab.addEventListener('keydown', (event) => {
        let targetIndex = null;

        if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') targetIndex = 0;
        if (event.key === 'End') targetIndex = tabs.length - 1;

        if (targetIndex === null) return;

        event.preventDefault();
        const targetTab = tabs[targetIndex];
        activateTab(tabs, targetTab);
        targetTab.focus();
      });
    });
  });
}

function activateTab(tabs, activeTab) {
  const card = activeTab.closest('.card');
  if (!card) return;

  tabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  const panels = card.querySelectorAll('[role="tabpanel"]');
  panels.forEach((panel) => {
    panel.classList.remove('active');
    panel.hidden = true;
  });

  const panelId = activeTab.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('active');
    panel.hidden = false;
  }
}


function initNavScrollSpy() {
  const links = [...document.querySelectorAll('.nav a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const activate = (id) => {
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]?.target?.id) {
        activate(visible[0].target.id);
      }
    },
    { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
