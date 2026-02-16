// ===================================================
// Val-d'Oise Lab2034 — Dashboard Impact Qualitative
// app.js — Charts, tables, and interactivity
// ===================================================

// Chart.js defaults (use system font from CSS)
Chart.defaults.font.family = (getComputedStyle(document.body).fontFamily || 'system-ui');
Chart.defaults.font.size = 14;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;

// Color palette
const C = {
  b2021: '#1f77b4',
  b2023: '#f2c94c',
  b2024: '#e8634a',
  navy: '#1a2744',
  teal: '#27ae60',
  coral: '#e8634a',
  gold: '#f2994a'
};

// ===== LOAD DATA & INIT =====
async function loadData() {
  const response = await fetch('./matrice-globale.json');
  return await response.json();
}

loadData().then(DATA => {
  createRadarChart(DATA);
  createBarChart(DATA);
  createLineChart(DATA);
  createLineAxesChart(DATA);
  buildHeatmapTables(DATA);
  createQuantiCharts(DATA);
  createColleges2024Charts(DATA);
  buildCollegeCards(DATA);
  buildTimelines(DATA);
  initNavActiveOnClick();
});

// ===== 1. RADAR CHART — VERSION AMÉLIORÉE =====
function createRadarChart(DATA) {
  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: DATA.axes.map(a => a.label),
      datasets: [
        {
          label: '2021',
          data: DATA.axes.map(a => a.values['2021']),
          borderColor: C.b2021,
          backgroundColor: 'rgba(31,119,180,.16)',
          pointBackgroundColor: C.b2021,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2023',
          data: DATA.axes.map(a => a.values['2023']),
          borderColor: C.b2023,
          backgroundColor: 'rgba(242,201,76,.16)',
          pointBackgroundColor: C.b2023,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: '2024',
          data: DATA.axes.map(a => a.values['2024']),
          borderColor: C.b2024,
          backgroundColor: 'rgba(232,99,74,.16)',
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
      layout: { padding: 8 },
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent',
            color: 'rgba(26,39,68,.55)',
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(26,39,68,.10)'
          },
          angleLines: {
            color: 'rgba(26,39,68,.10)'
          },
          pointLabels: {
            color: C.navy,
            font: { size: 13, weight: 700 },
            padding: 6
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label} : ${Number(ctx.raw).toFixed(1)} /4`
          }
        }
      }
    }
  });
}


// ===== 2. BAR CHART — VERSION AMÉLIORÉE =====
function createBarChart(DATA) {
  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: DATA.axes.map(a => a.label),
      datasets: [
        {
          label: '2021',
          data: DATA.axes.map(a => a.values['2021']),
          backgroundColor: C.b2021,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2023',
          data: DATA.axes.map(a => a.values['2023']),
          backgroundColor: C.b2023,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        },
        {
          label: '2024',
          data: DATA.axes.map(a => a.values['2024']),
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
            callback: value => Number(value).toFixed(0)
          },
          grid: {
            color: 'rgba(0,0,0,.06)'
          }
        },
        y: {
          ticks: {
            font: { size: 12 }
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label} : ${Number(ctx.raw).toFixed(1)} /4`
          }
        }
      }
    }
  });
}


// ===== 3. LINE AVERAGE =====
function createLineChart(DATA) {
  const years = ['2021', '2023', '2024'];
  const avgs = years.map(y => {
    const s = DATA.axes.reduce((a, x) => a + x.values[y], 0);
    return +(s / DATA.axes.length).toFixed(1);
  });

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Moyenne globale /4',
        data: avgs,
        borderColor: C.navy,
        backgroundColor: 'rgba(26,39,68,.08)',
        tension: .3,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: C.navy
      }]
    },
    options: {
      responsive: true,
      scales: { y: { min: 1.5, max: 3.5 } }
    }
  });
}


// ===== 4. LINE PER AXE =====
function createLineAxesChart(DATA) {
  const years = ['2021', '2023', '2024'];
  const axColors = [C.b2021, C.b2023, C.b2024, C.teal, C.gold];

  new Chart(document.getElementById('lineAxesChart'), {
    type: 'line',
    data: {
      labels: years,
      datasets: DATA.axes.map((a, i) => ({
        label: a.label,
        data: years.map(y => a.values[y]),
        borderColor: axColors[i],
        backgroundColor: 'transparent',
        tension: .3,
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

// ===== 5. HEATMAP TABLES =====
function heatClass(v) {
  if (v >= 3.5) return 'h4';
  if (v >= 2.5) return 'h3';
  if (v >= 1.5) return 'h2';
  return 'h1';
}

function buildHeatmapTables(DATA) {
  buildTable('tbody2021', DATA.etablissements2021);
  buildTable('tbody2023', DATA.etablissements2023);
}

function buildTable(id, list) {
  const tb = document.getElementById(id);
  list.forEach(e => {
    const avg = (e.scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
    tb.innerHTML += `<tr>
      <td class="name">${e.nom}<br><small style="color:var(--muted)">${e.ville}</small></td>
      ${e.scores.map(s => `<td class="${heatClass(s)}">${s}</td>`).join('')}
      <td class="${heatClass(+avg)}"><strong>${avg}</strong></td>
    </tr>`;
  });
}

// ===== 6. QUANTITATIVE CHARTS =====
function miniBar(id, labels, values, color, label) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data: values, backgroundColor: color, borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function createQuantiCharts(DATA) {
  miniBar('chartSanctionsPMC', DATA.quanti.sanctions_pmc.labels, DATA.quanti.sanctions_pmc.values, C.b2021, 'Sanctions');
  miniBar('chartSanctionsPicasso', DATA.quanti.sanctions_picasso.labels, DATA.quanti.sanctions_picasso.values, C.coral, 'Sanctions');
  miniBar('chartHeuresFlamel', DATA.quanti.heures_flamel.labels, DATA.quanti.heures_flamel.values, C.teal, 'Heures');
  miniBar('chartElevesMontesquieu', DATA.quanti.eleves_montesquieu.labels, DATA.quanti.eleves_montesquieu.values, C.gold, 'Élèves');

  // Enseignants formés 2021 avec ligne objectif
  new Chart(document.getElementById('chartFormes2021'), {
    type: 'bar',
    data: {
      labels: DATA.quanti.formes2021.labels,
      datasets: [{
        label: '% formés',
        data: DATA.quanti.formes2021.values,
        backgroundColor: [C.b2021, C.teal, C.coral, C.gold],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } }
    },
    plugins: [{
      id: 'objectifLine',
      afterDraw(chart) {
        const y = chart.scales.y.getPixelForValue(50);
        const ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = '#e8634a';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(chart.chartArea.left, y);
        ctx.lineTo(chart.chartArea.right, y);
        ctx.stroke();
        ctx.fillStyle = '#e8634a';
        ctx.font = `11px ${Chart.defaults.font.family}`;
        ctx.fillText('Objectif 50%', chart.chartArea.right - 75, y - 6);
        ctx.restore();
      }
    }]
  });
}

// ===== 7. COLLEGES 2024 CHARTS =====
function createColleges2024Charts(DATA) {
  const sorted = [...DATA.etablissements2024].sort((a, b) => b.taux - a.taux);

  // Taux de réussite
  new Chart(document.getElementById('chartTaux2024'), {
    type: 'bar',
    data: {
      labels: sorted.map(e => e.nom),
      datasets: [{
        label: 'Taux de réussite %',
        data: sorted.map(e => e.taux),
        backgroundColor: sorted.map(e => e.taux >= 75 ? C.teal : e.taux >= 50 ? C.gold : C.coral),
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { min: 0, max: 100 } }
    }
  });

  // Effectifs
  new Chart(document.getElementById('chartEffectifs2024'), {
    type: 'bar',
    data: {
      labels: DATA.etablissements2024.map(e => e.nom),
      datasets: [
        { label: 'Élèves', data: DATA.etablissements2024.map(e => e.eleves), backgroundColor: C.b2021, borderRadius: 4 },
        { label: 'Enseignants (×10)', data: DATA.etablissements2024.map(e => e.enseignants * 10), backgroundColor: C.gold, borderRadius: 4 }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: { x: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// ===== 8. COLLEGE CARDS =====
function buildCollegeCards(DATA) {
  const container = document.getElementById('college-cards-container');
  DATA.etablissements2024.forEach(e => {
    const bg = e.taux >= 75 ? '#d1fae5' : e.taux >= 50 ? '#fef3c7' : '#fee2e2';
    const fg = e.taux >= 75 ? '#065f46' : e.taux >= 50 ? '#92400e' : '#991b1b';
    const cls = e.taux >= 75 ? 'high' : e.taux >= 50 ? 'mid' : 'low';

    container.innerHTML += `<div class="college-card">
      <div class="top">
        <h3>${e.nom}</h3>
        <span class="taux-badge" style="background:${bg};color:${fg}">${e.taux}%</span>
      </div>
      <div class="meta">${e.ville} · ${e.type} · ${e.eleves} élèves · ${e.enseignants} enseignants</div>
      <div class="taux-bar"><div class="taux-fill ${cls}" style="width:${e.taux}%"></div></div>
    </div>`;
  });
}

// ===== 9. TIMELINES =====
function renderTimeline(items, containerId, type) {
  const el = document.getElementById(containerId);
  if (!el) return;
  items.forEach(i => {
    el.innerHTML += `<div class="tl-item">
      <div class="tl-dot ${type}"></div>
      <div class="tl-content">
        <strong>${i.titre}</strong>
        <p>${i.detail}</p>
        ${i.source ? `<div class="src">— ${i.source}</div>` : ''}
      </div>
    </div>`;
  });
}

function buildTimelines(DATA) {
  ['2021', '2023', '2024'].forEach(y => {
    renderTimeline(DATA.pointsPositifs.filter(p => p.annee === y), `tl-pos-${y}`, 'pos');
    renderTimeline(DATA.difficultes.filter(p => p.annee === y), `tl-neg-${y}`, 'neg');
  });
}

// ===== TAB SYSTEM =====
function switchTab(btn, paneId) {
  const card = btn.closest('.card');

  card.querySelectorAll('[role="tab"]').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });

  card.querySelectorAll('[role="tabpanel"]').forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');

  const pane = document.getElementById(paneId);
  pane.classList.add('active');
}

// ===== NAV SCROLL HIGHLIGHT =====
function initNavActiveOnClick() {
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', function () {
      document.querySelectorAll('.nav a').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
