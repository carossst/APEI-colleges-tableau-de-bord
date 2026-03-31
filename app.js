// ===================================================
// Val-d'Oise Lab2034 - Analyse d'impact qualitative
// app.js - refactorisation par jury
// ===================================================

if (window.Chart) {
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily || 'system-ui';
  Chart.defaults.font.size = 14;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
}

const C = {
  b2017: '#1f77b4',
  b2018: '#f2c94c',
  b2021: '#e8634a',
  navy: '#1a2744',
  teal: '#27ae60',
  coral: '#e8634a',
  gold: '#f2994a'
};

const COHORTS = ['2017', '2018', '2021'];

const COHORT_LABELS = {
  '2017': 'Jury 2017',
  '2018': 'Jury 2018',
  '2021': 'Jury 2021'
};

initTabs();
initNavScrollSpy();

loadData()
  .then((data) => {
    const publishedData = sanitizePublishedData(data);
    hydrateIntro(data);
    syncCohortLabels(publishedData);
    buildHeatmapTables(publishedData);
    buildTimelines(publishedData);
    writeChartSummaries(publishedData);
    createCharts(publishedData);
  })
  .catch((error) => {
    console.error(error);
    showLoadError();
    fillFallbackIntro();
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

function fillFallbackIntro() {
  setText('intro-context-text', "Cette page propose une lecture transversale des projets APEI regroupés par année de jury, avant le détail par établissement, en ne retenant que les collèges suffisamment documentés.");
  setText('intro-method-text', "La matrice présente cinq axes communs, notés sur une échelle de 1 à 4. Les années 2023 et 2024 citées dans certaines sources renvoient aux documents d'analyse, pas aux cohortes comparées.");
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
  setText('intro-context-text', intro.context?.text || "Cette page propose une lecture transversale des projets APEI regroupés par année de jury, avant le détail par établissement, en ne retenant que les collèges suffisamment documentés.");
  setText('intro-method-title', intro.method?.title || 'Comment lire la matrice');
  setText('intro-method-text', intro.method?.text || "La matrice présente cinq axes communs, notés sur une échelle de 1 à 4. Les années 2023 et 2024 citées dans certaines sources renvoient aux documents d'analyse, pas aux cohortes comparées.");
}

function sanitizePublishedData(data) {
  const publishedCohorts = new Set(data.sourcePolicy?.publishedCohorts || COHORTS);
  const sanitized = {
    ...data,
    axes: Array.isArray(data.axes) ? data.axes.map((axis) => ({
      ...axis,
      values: Object.fromEntries(
        Object.entries(axis.values || {}).filter(([cohort]) => publishedCohorts.has(cohort))
      )
    })) : [],
    cohorts: {},
    cohortMeta: {}
  };

  COHORTS.forEach((cohort) => {
    if (!publishedCohorts.has(cohort)) return;
    const list = Array.isArray(data.cohorts?.[cohort]) ? data.cohorts[cohort] : [];
    sanitized.cohorts[cohort] = list.filter(isDocumentedCollege);
    if (data.cohortMeta?.[cohort]) {
      sanitized.cohortMeta[cohort] = data.cohortMeta[cohort];
    }
  });

  return sanitized;
}

function isDocumentedCollege(item) {
  return Boolean(
    item &&
    item.nom &&
    item.ville &&
    item.sourceRef &&
    item.scoreStatus &&
    Array.isArray(item.scores) &&
    item.scores.length === 5 &&
    item.scores.every((score) => typeof score === 'number' && Number.isFinite(score))
  );
}

function syncCohortLabels(data) {
  COHORTS.forEach((cohort) => {
    const button = document.getElementById(`tabbtn${cohort}`);
    if (!button) return;

    const count = Array.isArray(data.cohorts?.[cohort]) ? data.cohorts[cohort].length : 0;
    button.textContent = `${COHORT_LABELS[cohort]} - ${count} collège${count > 1 ? 's' : ''}`;
  });
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
          label: COHORT_LABELS['2017'],
          data: data.axes.map((a) => a.values['2017']),
          borderColor: C.b2017,
          backgroundColor: 'rgba(31,119,180,0.16)',
          pointBackgroundColor: C.b2017,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: COHORT_LABELS['2018'],
          data: data.axes.map((a) => a.values['2018']),
          borderColor: C.b2018,
          backgroundColor: 'rgba(242,201,76,0.16)',
          pointBackgroundColor: C.b2018,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: COHORT_LABELS['2021'],
          data: data.axes.map((a) => a.values['2021']),
          borderColor: C.b2021,
          backgroundColor: 'rgba(232,99,74,0.16)',
          pointBackgroundColor: C.b2021,
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
          label: COHORT_LABELS['2017'],
          data: data.axes.map((a) => a.values['2017']),
          backgroundColor: C.b2017,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: COHORT_LABELS['2018'],
          data: data.axes.map((a) => a.values['2018']),
          backgroundColor: C.b2018,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: COHORT_LABELS['2021'],
          data: data.axes.map((a) => a.values['2021']),
          backgroundColor: C.b2021,
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

  const avgs = COHORTS.map((cohort) => averageAxisValue(data.axes, cohort));

  new Chart(el, {
    type: 'line',
    data: {
      labels: COHORTS.map((cohort) => COHORT_LABELS[cohort]),
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

  const axColors = [C.b2017, C.b2018, C.b2021, C.teal, C.gold];

  new Chart(el, {
    type: 'line',
    data: {
      labels: COHORTS.map((cohort) => COHORT_LABELS[cohort]),
      datasets: data.axes.map((axis, index) => ({
        label: axis.label,
        data: COHORTS.map((cohort) => axis.values[cohort]),
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

function averageAxisValue(axes, cohort) {
  const sum = axes.reduce((acc, axis) => acc + axis.values[cohort], 0);
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
  buildTable('tbody2017', data.cohorts?.['2017'], 'Cohorte historique');
  buildTable('tbody2018', data.cohorts?.['2018'], 'Clôture');
  buildTable('tbody2021', data.cohorts?.['2021'], 'Mi-parcours');
}

function buildTable(id, list, defaultStatus = '') {
  const tbody = document.getElementById(id);
  if (!tbody || !Array.isArray(list)) return;

  tbody.innerHTML = '';

  list.forEach((item) => {
    const row = document.createElement('tr');
    const avg = +(item.scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);

    const nameCell = document.createElement('td');
    nameCell.className = 'name';
    const status = item.statut || defaultStatus;
    const sourceLine = item.sourceRef ? `<br><small style="color:var(--muted)">${escapeHtml(item.sourceRef)}</small>` : '';
    nameCell.innerHTML = `${escapeHtml(item.nom)}<br><small style="color:var(--muted)">${escapeHtml(item.ville)} - Jury ${escapeHtml(item.jury || '')}${status ? ` - ${escapeHtml(status)}` : ''}</small>${sourceLine}`;
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

  COHORTS.forEach((cohort) => {
    renderTimeline((data.pointsPositifs || []).filter((item) => item.jury === cohort), `tl-pos-${cohort}`, 'pos');
    renderTimeline((data.difficultes || []).filter((item) => item.jury === cohort), `tl-neg-${cohort}`, 'neg');
  });
}

function writeChartSummaries(data) {
  const axisSorted = [...data.axes].sort((a, b) => averageAcrossCohorts(b.values) - averageAcrossCohorts(a.values));
  const topAxis = axisSorted[0];
  const lowAxis = axisSorted[axisSorted.length - 1];

  const avg2017 = averageAxisValue(data.axes, '2017').toFixed(1);
  const avg2018 = averageAxisValue(data.axes, '2018').toFixed(1);
  const avg2021 = averageAxisValue(data.axes, '2021').toFixed(1);

  setText('summary-radar', `Lecture rapide : à l'échelle des trois jurys affichés, "${topAxis.label}" apparaît comme l'axe le plus solide, tandis que "${lowAxis.label}" reste le plus fragile.`);
  setText('summary-bar', `La comparaison par axe confirme une structure globalement stable : des acquis durables sur les espaces, des évolutions plus contrastées sur les autres axes et une fragilité persistante sur la relation avec les autres parties prenantes.`);
  setText('summary-line', `La moyenne globale reste proche d'un jury à l'autre : ${avg2017} /4 pour le jury 2017, ${avg2018} /4 pour le jury 2018 et ${avg2021} /4 pour le jury 2021. Cette lecture traduit surtout des contextes documentés à des stades différents.`);
  setText('summary-line-axes', `La lecture par axe doit être interprétée avec prudence : les jurys 2017, 2018 et 2021 sont documentés à des moments différents. Le graphique aide à repérer des écarts de profil, sans les lire comme une trajectoire linéaire unique.`);
}

function averageAcrossCohorts(values) {
  return (values['2017'] + values['2018'] + values['2021']) / 3;
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
