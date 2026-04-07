const DATA_FILES = {
  overview: './data/framework-overview.json',
  map: './data/framework-map.json',
  glossary: './data/glossary.json',
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

function renderOverview(data) {
  const el = document.getElementById('framework-overview');
  el.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <ul>
      ${(data.objectives || []).map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function renderMap(data) {
  const el = document.getElementById('framework-map');
  el.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <ul>
      ${(data.nodes || []).map((node) => `<li><strong>${node.id}</strong>: ${node.label}</li>`).join('')}
    </ul>
  `;
}

function renderGlossary(data) {
  const el = document.getElementById('glossary');
  el.innerHTML = `
    <ul>
      ${(data.terms || [])
        .map((term) => `<li><strong>${term.term}</strong>: ${term.definition}</li>`)
        .join('')}
    </ul>
  `;
}

async function init() {
  try {
    const [overview, map, glossary] = await Promise.all([
      loadJson(DATA_FILES.overview),
      loadJson(DATA_FILES.map),
      loadJson(DATA_FILES.glossary),
    ]);

    renderOverview(overview);
    renderMap(map);
    renderGlossary(glossary);
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML(
      'beforeend',
      `<p style="padding:1rem;color:#ff9b9b;">Could not load JSON data. Start a local web server and retry.</p>`
    );
  }
}

init();
