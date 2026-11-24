let CATEGORIES = [];
let MONO_HERBS = [];
let MONO_BLENDS = [];
let MONO_BY_STATE = [];
let BOOSTERS = [];
let SNACKS = { richBase: {}, sections: [] };
let DRINKS = [];

async function loadCatalog() {
  const response = await fetch('data/catalog.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error('Не удалось загрузить меню');

  const catalog = await response.json();
  CATEGORIES = catalog.CATEGORIES || [];
  MONO_HERBS = catalog.MONO_HERBS || [];
  MONO_BLENDS = catalog.MONO_BLENDS || [];
  MONO_BY_STATE = catalog.MONO_BY_STATE || [];
  BOOSTERS = catalog.BOOSTERS || [];
  SNACKS = catalog.SNACKS || { richBase: {}, sections: [] };
  DRINKS = catalog.DRINKS || [];
}
