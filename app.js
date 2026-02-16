/* Executive dashboard — no build, GitHub Pages ready */
(() => {
  "use strict";

  const DATA_URL = "./valdoise.json";

  const el = (id) => document.getElementById(id);

  const ui = {
    yearSelect: el("yearSelect"),
    groupSelect: el("groupSelect"),
    searchInput: el("searchInput"),
    kpiGlobal: el("kpiGlobal"),
    kpiGlobalNote: el("kpiGlobalNote"),
    kpiCount: el("kpiCount"),
    kpiCountNote: el("kpiCountNote"),
    kpiBestAxis: el("kpiBestAxis"),
    kpiBestAxisNote: el("kpiBestAxisNote"),
    kpiWeakAxis: el("kpiWeakAxis"),
    kpiWeakAxisNote: el("kpiWeakAxisNote"),
    matrix: el("matrix"),
    matrixHint: el("matrixHint"),
    rank: el("rank"),
    tbody: el("tbody"),
    modal: el("modal"),
    modalTitle: el("modalTitle"),
    modalSub: el("modalSub"),
    modalPills: el("modalPills"),
    modalBars: el("modalBars"),
    modalNotes: el("modalNotes"),
    modalSource: el("modalSource"),
    modalClose: el("modalClose"),
    buildInfo: el("buildInfo"),
  };

  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const round1 = (n) => Math.round(n * 10) / 10;

  function scoreBadgeClass(avg) {
    if (avg >= 3.2) return "badge--good";
    if (avg >= 2.4) return "badge--warn";
    return "badge--bad";
  }

  function safeText(v) {
    return (v === null || v === undefined) ? "" : String(v);
  }

  function avgScores(scoresObj, axisKeys) {
    const vals = axisKeys
      .map((k) => Number(scoresObj?.[k]))
      .filter((x) => Number.isFinite(x));
    if (!vals.length) return null;
    return vals.reduce((a,b)=>a+b,0) / vals.length;
  }

  function computeAxisAverages(items, axisKeys) {
    const sums = Object.fromEntries(axisKeys.map(k => [k, 0]));
    const counts = Object.fromEntries(axisKeys.map(k => [k, 0]));

    for (const it of items) {
      for (const k of axisKeys) {
        const v = Number(it.scores?.[k]);
        if (Number.isFinite(v)) {
          sums[k] += v;
          counts[k] += 1;
        }
      }
    }
    const avgs = {};
    for (const k of axisKeys) {
      avgs[k] = counts[k] ? (sums[k] / counts[k]) : null;
    }
    return avgs;
  }

  function normalize(str) {
    return safeText(str).toLowerCase()
      .normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  function buildYearOptions(cohorts) {
    const years = Object.keys(cohorts)
      .map((y) => Number(y))
      .filter((n) => Number.isFinite(n))
      .sort((a,b)=>b-a)
      .map(String);

    ui.yearSelect.innerHTML = years.map((y) => `<option value="${y}">${y}</option>`).join("");
    return years[0] || null;
  }

  function buildGroupOptions(cohort) {
    const groups = cohort?.groups || [];
    const opts = [{ key: "all", label: "Tous" }].concat(
      groups.map(g => ({ key: g.key, label: g.label }))
    );
    ui.groupSelect.innerHTML = opts.map(o => `<option value="${o.key}">${o.label}</option>`).join("");
  }

  function getCollegeMetaById(data, collegeId) {
    const list = data?.colleges || [];
    return list.find(c => c.id === collegeId) || null;
  }

  function getScoresForCollegeYear(data, collegeId, year) {
    const list = data?.college_scores || [];
    return list.find(x => x.college_id === collegeId && Number(x.year) === Number(year)) || null;
  }

  function buildRows(data, year) {
    const cohort = data?.cohorts?.[String(year)];
    const axisKeys = Object.keys(data?.axes || {});
    const axisLabels = data?.axes || {};

    const cohortColleges = cohort?.colleges || [];
    const groupsByKey = Object.fromEntries((cohort?.groups || []).map(g => [g.key, g.label]));

    const rows = cohortColleges.map((c) => {
      const meta = getCollegeMetaById(data, c.id);
      const scoreRec = getScoresForCollegeYear(data, c.id, year);
      const scores = scoreRec?.scores || {};
      const avg = avgScores(scores, axisKeys);
      const groupLabel = groupsByKey[c.groupKey] || c.groupKey || "";

      return {
        id: c.id,
        name: meta?.name || c.name || c.id,
        city: meta?.city || "",
        type: c.type || "",
        groupKey: c.groupKey || "",
        groupLabel,
        notes: c.notes || [],
        highlights: c.highlights || [],
        scores,
        avg,
        source_ref: scoreRec?.source_ref || "",
        axisLabels,
        axisKeys
      };
    });

    return { rows, axisKeys, axisLabels, cohort };
  }

  function applyFilters(allRows) {
    const year = ui.yearSelect.value;
    const groupKey = ui.groupSelect.value;
    const q = normalize(ui.searchInput.value);

    return allRows.filter((r) => {
      if (groupKey && groupKey !== "all" && r.groupKey !== groupKey) return false;
      if (!q) return true;

      const hay = normalize([
        r.name, r.city, r.type, r.groupLabel,
        ...(r.highlights || []),
        ...(r.notes || [])
      ].join(" | "));
      return hay.includes(q);
    });
  }

  function renderKPIs(filteredRows, axisKeys, axisLabels, year, cohort) {
    ui.kpiCount.textContent = String(filteredRows.length);

    const axisAvgs = computeAxisAverages(filteredRows, axisKeys);
    const axisPairs = axisKeys
      .map(k => ({ k, label: axisLabels[k] || k, v: axisAvgs[k] }))
      .filter(x => Number.isFinite(x.v));

    const globalAvg = axisPairs.length ? axisPairs.reduce((a,b)=>a+b.v,0) / axisPairs.length : null;

    ui.kpiGlobal.textContent = (globalAvg === null) ? "-" : String(round1(globalAvg));

    if (axisPairs.length) {
      axisPairs.sort((a,b)=>b.v - a.v);
      const best = axisPairs[0];
      const worst = axisPairs[axisPairs.length - 1];

      ui.kpiBestAxis.textContent = best.label;
      ui.kpiBestAxisNote.textContent = String(round1(best.v)) + " / 4";

      ui.kpiWeakAxis.textContent = worst.label;
      ui.kpiWeakAxisNote.textContent = String(round1(worst.v)) + " / 4";
    } else {
      ui.kpiBestAxis.textContent = "-";
      ui.kpiBestAxisNote.textContent = "-";
      ui.kpiWeakAxis.textContent = "-";
      ui.kpiWeakAxisNote.textContent = "-";
    }

    const cohortLabel = cohort?.label ? `- ${cohort.label}` : "";
    ui.matrixHint.textContent = `Averages sur le filtre courant (année ${year}${cohortLabel})`;
  }

  function renderMatrix(filteredRows, axisKeys, axisLabels) {
    const axisAvgs = computeAxisAverages(filteredRows, axisKeys);

    ui.matrix.innerHTML = axisKeys.map((k) => {
      const v = axisAvgs[k];
      const pct = (v === null) ? 0 : clamp01(v / 4) * 100;
      const label = axisLabels[k] || k;

      return `
        <div class="axisRow">
          <div class="axisRow__label">${label}</div>
          <div class="bar" aria-label="${label}">
            <span style="width:${pct}%"></span>
          </div>
          <div class="axisRow__score">${v === null ? "-" : round1(v)}</div>
        </div>
      `;
    }).join("");
  }

  function renderRank(filteredRows) {
    const rows = filteredRows
      .filter(r => Number.isFinite(r.avg))
      .slice()
      .sort((a,b)=>b.avg - a.avg);

    const top = rows.slice(0, 3);
    const flop = rows.slice(-3).reverse();

    const renderItem = (r, tag) => {
      const cls = scoreBadgeClass(r.avg);
      return `
        <div class="rankItem" data-id="${r.id}">
          <div class="rankItem__left">
            <div class="rankItem__name">${safeText(r.name)}</div>
            <div class="rankItem__meta">${safeText(r.city)} • ${safeText(r.type)} • ${safeText(tag)}</div>
          </div>
          <div class="badge ${cls}">${round1(r.avg)}</div>
        </div>
      `;
    };

    ui.rank.innerHTML = `
      ${top.length ? `<div class="small">Top 3</div>${top.map(r => renderItem(r, "Top")).join("")}` : `<div class="small">Aucun score</div>`}
      ${flop.length ? `<div class="small" style="margin-top:6px">Flop 3</div>${flop.map(r => renderItem(r, "À renforcer")).join("")}` : ``}
    `;

    // click
    ui.rank.querySelectorAll(".rankItem").forEach((node) => {
      node.addEventListener("click", () => openModal(node.getAttribute("data-id")));
    });
  }

  function scorePill(avg) {
    const cls = scoreBadgeClass(avg);
    return `<span class="scorePill ${cls}">${Number.isFinite(avg) ? round1(avg) : "-"}</span>`;
  }

  function renderTable(filteredRows, axisKeys) {
    const rows = filteredRows
      .slice()
      .sort((a,b) => (b.avg ?? -999) - (a.avg ?? -999));

    ui.tbody.innerHTML = rows.map((r) => {
      const s = r.scores || {};
      const v = (k) => {
        const n = Number(s[k]);
        return Number.isFinite(n) ? String(n) : "-";
      };

      return `
        <tr data-id="${r.id}">
          <td><strong>${safeText(r.name)}</strong></td>
          <td class="cellMuted">${safeText(r.city)}</td>
          <td class="cellMuted">${safeText(r.type)}</td>
          <td class="cellMuted">${safeText(r.groupLabel)}</td>
          <td>${scorePill(r.avg)}</td>
          <td>${v("espaces")}</td>
          <td>${v("enseignements")}</td>
          <td>${v("outils")}</td>
          <td>${v("eleves")}</td>
          <td>${v("partenaires")}</td>
        </tr>
      `;
    }).join("");

    ui.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => openModal(tr.getAttribute("data-id")));
    });
  }

  let STATE = {
    data: null,
    year: null,
    allRows: [],
    axisKeys: [],
    axisLabels: {},
    cohort: null
  };

  function buildModalPills(row) {
    const items = [
      row.type ? `Type: ${row.type}` : null,
      row.groupLabel ? `Groupe: ${row.groupLabel}` : null,
      row.city ? `Ville: ${row.city}` : null,
      Number.isFinite(row.avg) ? `Score moyen: ${round1(row.avg)} / 4` : null,
    ].filter(Boolean);

    ui.modalPills.innerHTML = items.map(t => `<div class="pill">${safeText(t)}</div>`).join("");
  }

  function buildModalBars(row) {
    const axisKeys = row.axisKeys || [];
    const axisLabels = row.axisLabels || {};
    const scores = row.scores || {};

    ui.modalBars.innerHTML = axisKeys.map((k) => {
      const label = axisLabels[k] || k;
      const v = Number(scores[k]);
      const value = Number.isFinite(v) ? v : null;
      const pct = value === null ? 0 : clamp01(value / 4) * 100;

      return `
        <div class="barLine">
          <div class="barLine__label">${safeText(label)}</div>
          <div class="bar" aria-label="${safeText(label)}">
            <span style="width:${pct}%"></span>
          </div>
          <div class="barLine__score">${value === null ? "-" : String(value)}</div>
        </div>
      `;
    }).join("");
  }

  function buildModalNotes(row) {
    const notes = []
      .concat((row.highlights || []).map(t => ({ title: "Points saillants", text: t })))
      .concat((row.notes || []).map(t => ({ title: "Points d'attention", text: t })));

    if (!notes.length) {
      ui.modalNotes.innerHTML = `<div class="small">Aucune note dans le dataset.</div>`;
      return;
    }

    ui.modalNotes.innerHTML = notes.map((n) => `
      <div class="note">
        <div class="note__title">${safeText(n.title)}</div>
        <div class="note__text">${safeText(n.text)}</div>
      </div>
    `).join("");
  }

  function openModal(collegeId) {
    const row = STATE.allRows.find(r => r.id === collegeId);
    if (!row) return;

    ui.modalTitle.textContent = row.name;
    ui.modalSub.textContent = [row.city, row.type, row.groupLabel].filter(Boolean).join(" • ") || "-";

    buildModalPills(row);
    buildModalBars(row);
    buildModalNotes(row);

    ui.modalSource.textContent = row.source_ref ? `Source: ${row.source_ref}` : "Source: -";

    if (typeof ui.modal.showModal === "function") {
      ui.modal.showModal();
    } else {
      // Fallback: if dialog not supported, navigate to hash.
      window.location.hash = "#college-" + encodeURIComponent(collegeId);
      alert(row.name + "\n\n" + ui.modalSub.textContent);
    }
  }

  function closeModal() {
    if (ui.modal.open) ui.modal.close();
  }

  function render() {
    const filteredRows = applyFilters(STATE.allRows);
    renderKPIs(filteredRows, STATE.axisKeys, STATE.axisLabels, STATE.year, STATE.cohort);
    renderMatrix(filteredRows, STATE.axisKeys, STATE.axisLabels);
    renderRank(filteredRows);
    renderTable(filteredRows, STATE.axisKeys);
  }

  async function load() {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Impossible de charger " + DATA_URL);
    const data = await res.json();

    STATE.data = data;

    const defaultYear = buildYearOptions(data.cohorts || {});
    STATE.year = defaultYear;

    const cohort = data.cohorts?.[defaultYear];
    STATE.cohort = cohort;
    buildGroupOptions(cohort);

    const built = buildRows(data, defaultYear);
    STATE.allRows = built.rows;
    STATE.axisKeys = built.axisKeys;
    STATE.axisLabels = built.axisLabels;

    ui.buildInfo.textContent = `Dataset: ${safeText(data.meta?.title || "valdoise")} • Updated: ${safeText(data.meta?.updated_at || "-")}`;

    render();
  }

  function onYearChange() {
    const year = ui.yearSelect.value;
    STATE.year = year;

    const cohort = STATE.data?.cohorts?.[String(year)];
    STATE.cohort = cohort;
    buildGroupOptions(cohort);

    const built = buildRows(STATE.data, year);
    STATE.allRows = built.rows;
    STATE.axisKeys = built.axisKeys;
    STATE.axisLabels = built.axisLabels;

    // reset group + search
    ui.groupSelect.value = "all";
    ui.searchInput.value = "";

    render();
  }

  function wire() {
    ui.yearSelect.addEventListener("change", onYearChange);
    ui.groupSelect.addEventListener("change", render);
    ui.searchInput.addEventListener("input", () => {
      window.clearTimeout(wire._t);
      wire._t = window.setTimeout(render, 60);
    });

    ui.modalClose.addEventListener("click", closeModal);
    ui.modal.addEventListener("click", (e) => {
      if (e.target === ui.modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  (async () => {
    try {
      wire();
      await load();
    } catch (err) {
      console.error(err);
      ui.kpiGlobal.textContent = "Erreur";
      ui.kpiGlobalNote.textContent = "données";
    }
  })();
})();
