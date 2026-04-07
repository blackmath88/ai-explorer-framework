const PATHS = {
  overview: './data/framework-overview.json',
  map: './data/framework-map.json',
  glossary: './data/glossary.json',
};

let store = null;

const app = document.getElementById('app');

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path} (${res.status})`);
  return res.json();
}

function badge(maturity) {
  return `<span class="badge ${maturity}">${maturity}</span>`;
}

function byId(items) {
  return Object.fromEntries(items.map((i) => [i.id, i]));
}

async function loadStore() {
  const overview = await loadJson(PATHS.overview);
  const frameworkMap = await loadJson(PATHS.map);
  const glossary = await loadJson(PATHS.glossary);

  const [modules, patterns, exercises, cases] = await Promise.all([
    Promise.all(overview.module_index.map((m) => loadJson(`./data/${m.file.replace('./', '')}`))),
    Promise.all(overview.pattern_index.map((p) => loadJson(`./data/${p.file.replace('./', '')}`))),
    Promise.all(overview.exercise_index.map((e) => loadJson(`./data/${e.file.replace('./', '')}`))),
    Promise.all(overview.case_index.map((c) => loadJson(`./data/${c.file.replace('./', '')}`))),
  ]);

  store = { overview, frameworkMap, glossary, modules, patterns, exercises, cases };
}

function renderHome() {
  const { overview, frameworkMap, modules, cases } = store;
  document.getElementById('framework-name').textContent = overview.framework_identity.name;
  document.getElementById('tagline').textContent = overview.north_star.tagline;

  const selectedCases = byId(cases);

  app.innerHTML = `
    <section class="section">
      <h2>North Star ${badge(overview.north_star.maturity)}</h2>
      <p>${overview.north_star.one_sentence}</p>
      <p class="kv"><strong>Core shift:</strong> ${overview.core_shift.from} → ${overview.core_shift.to}</p>
    </section>

    <section class="section">
      <h2>Phase Overview</h2>
      <div class="grid">
        ${frameworkMap.phases
          .map(
            (phase) => `<article class="panel">
              <h3>${phase.name} ${badge(phase.maturity)}</h3>
              <p>${phase.purpose}</p>
              <p class="meta">Duration: ${phase.duration || 'n/a'}${phase.rule ? ` · Rule: ${phase.rule}` : ''}</p>
            </article>`
          )
          .join('')}
      </div>
    </section>

    <section class="section">
      <h2>Modules</h2>
      <div class="grid">
        ${modules
          .map(
            (module) => `<a class="module-card" href="#module/${module.id}">
              <h3>${module.title} ${badge(module.maturity)}</h3>
              <p>${module.purpose}</p>
              <p class="meta">Fit: ${module.fit_in_phases.join(', ')}</p>
            </a>`
          )
          .join('')}
      </div>
    </section>

    <section class="section">
      <h2>Selected Proof Points</h2>
      <ul class="list">
        ${overview.selected_proof_point_ids
          .map((id) => selectedCases[id])
          .filter(Boolean)
          .map((c) => `<li><strong>${c.name}</strong>: ${c.statement} <span class="meta">(${c.confidence})</span></li>`)
          .join('')}
      </ul>
    </section>
  `;
}

function renderModule(moduleId) {
  const { modules, patterns, exercises, cases } = store;
  const module = modules.find((m) => m.id === moduleId);
  if (!module) {
    app.innerHTML = `<section class="section"><p>Module not found.</p><a class="back-link" href="#home">Back to home</a></section>`;
    return;
  }

  const patternMap = byId(patterns);
  const exerciseMap = byId(exercises);
  const caseMap = byId(cases);

  app.innerHTML = `
    <section class="section">
      <p><a class="back-link" href="#home">← Back to explorer home</a></p>
      <h2>${module.title} ${badge(module.maturity)}</h2>
      <p class="kv"><strong>Purpose:</strong> ${module.purpose}</p>
      <p class="kv"><strong>Rationale:</strong> ${module.rationale}</p>
      <p class="kv"><strong>Fit in phases:</strong> ${module.fit_in_phases.join(', ')}</p>
      <p class="kv"><strong>Linked principles:</strong> ${module.linked_principles.join(', ')}</p>
    </section>

    <section class="section">
      <h3>Methods / Activities</h3>
      <ul class="list">
        ${(module.methods_activities || []).map((m) => `<li>${m}</li>`).join('')}
      </ul>
    </section>

    <section class="grid">
      <article class="panel">
        <h3>Related Patterns</h3>
        <ul class="list">
          ${(module.related_patterns || [])
            .map((id) => patternMap[id])
            .filter(Boolean)
            .map((p) => `<li>${p.name} ${badge(p.maturity)}</li>`)
            .join('')}
        </ul>
      </article>

      <article class="panel">
        <h3>Related Exercises</h3>
        <ul class="list">
          ${(module.related_exercises || [])
            .map((id) => exerciseMap[id])
            .filter(Boolean)
            .map((e) => `<li>${e.name} ${badge(e.maturity)}</li>`)
            .join('')}
        </ul>
      </article>

      <article class="panel">
        <h3>Related Cases</h3>
        <ul class="list">
          ${(module.related_cases || [])
            .map((id) => caseMap[id])
            .filter(Boolean)
            .map((c) => `<li>${c.name} <span class="meta">${c.confidence}</span></li>`)
            .join('')}
        </ul>
      </article>
    </section>
  `;
}

function route() {
  const hash = window.location.hash || '#home';
  if (hash.startsWith('#module/')) {
    renderModule(hash.replace('#module/', ''));
    return;
  }
  renderHome();
}

async function init() {
  try {
    await loadStore();
    route();
    window.addEventListener('hashchange', route);
  } catch (err) {
    console.error(err);
    app.innerHTML = '<section class="section"><p>Could not load framework data. Run a local static server.</p></section>';
  }
}

init();
