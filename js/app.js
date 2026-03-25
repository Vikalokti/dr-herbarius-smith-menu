// ========================================
// DR. HERBARIUS — App Logic
// SPA-like navigation, rendering, search, favorites
// ========================================

const App = {
  currentPage: 'home',
  currentCategory: null,
  currentDrink: null,
  searchQuery: '',
  favorites: JSON.parse(localStorage.getItem('herbarius-favorites') || '[]'),

  init() {
    this.handleHash();
    window.addEventListener('hashchange', () => this.handleHash());
  },

  handleHash() {
    const hash = location.hash.slice(1) || 'home';
    const parts = hash.split('/');

    if (parts[0] === 'category' && parts[1]) {
      this.showCategory(parts[1]);
    } else if (parts[0] === 'drink' && parts[1]) {
      this.showDrink(parts[1]);
    } else if (parts[0] === 'favorites') {
      this.showFavorites();
    } else if (parts[0] === 'search') {
      this.showSearchPage();
    } else {
      this.showHome();
    }
  },

  // ========================================
  // FAVORITES
  // ========================================
  toggleFavorite(drinkId, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const idx = this.favorites.indexOf(drinkId);
    if (idx > -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(drinkId);
    }
    localStorage.setItem('herbarius-favorites', JSON.stringify(this.favorites));
    this.updateFavButtons(drinkId);
  },

  isFavorite(drinkId) {
    return this.favorites.includes(drinkId);
  },

  updateFavButtons(drinkId) {
    document.querySelectorAll(`[data-fav="${drinkId}"]`).forEach(btn => {
      btn.classList.toggle('active', this.isFavorite(drinkId));
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', this.isFavorite(drinkId) ? 'currentColor' : 'none');
      }
    });
  },

  // ========================================
  // ICONS
  // ========================================
  icons: {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  },


  // ========================================
  // CATEGORY ICONS (emoji-based for simplicity)
  // ========================================
  categoryEmoji: {
    vitamins: '\u{1F34A}',
    mind: '\u{1F9E0}',
    sport: '\u26A1',
    elixirs: '\u2728',
    herbal: '\u{1F33F}',
    detox: '\u{1F4A7}',
    oxygen: '\u{1F32C}\uFE0F',
    boosters: '\u2795'
  },

  drinkEmoji: {
    'citrus-vita': '\u{1F34A}',
    'berry-vita': '\u{1F347}',
    'green-vita': '\u{1F96C}',
    'tropical-vita': '\u{1F34D}',
    'flush-vita': '\u{1F95D}',
    'root-power-vita': '\u{1F955}',
    'lemon-vita': '\u{1F34B}',
    'silent-warming': '\u{1F33A}',
    'serotonin-sun': '\u2600\uFE0F',
    'oxygen-recovery': '\u{1F4A8}',
    'pre-work': '\u{1F3CB}\uFE0F',
    'recovery': '\u{1F9CA}',
    'electro-balance': '\u{1F4A7}',
    'endurance': '\u{1F3C3}',
    'tibetan-monk': '\u{1F9D8}',
    'caucasian-longevity': '\u{1F3D4}\uFE0F',
    'peruvian-shaman': '\u{1F525}',
    'immunovit': '\u{1F6E1}\uFE0F',
    'vitality-focus': '\u{1F3AF}',
    'light-calm': '\u{1F54A}\uFE0F',
    'purify-tonic': '\u{1F343}',
    'alkaline-water': '\u{1F48E}',
    'liver-flow': '\u{1F33F}'
  },

  // ========================================
  // RENDER HEADER
  // ========================================
  renderHeader(type = 'home', title = '') {
    const header = document.getElementById('header');
    if (type === 'home') {
      header.className = 'header';
      header.innerHTML = `
        <div class="header-logo">
          <img src="img/лого.png" alt="Dr. Herbarius Smith" class="header-logo-img">
        </div>
        <div class="header-actions">
          <button class="header-btn" onclick="location.hash='#search'">${this.icons.search}</button>
        </div>
      `;
    } else {
      header.className = 'header header-back';
      header.innerHTML = `
        <button class="back-btn" onclick="history.back()">${this.icons.back}</button>
        <span class="header-title">${title}</span>
        <div style="width:36px"></div>
      `;
    }
  },

  // ========================================
  // RENDER BOTTOM NAV
  // ========================================
  renderNav(active = 'home') {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = `
      <a href="#home" class="nav-item ${active === 'home' ? 'active' : ''}">
        ${this.icons.home}
        <span>Меню</span>
      </a>
      <a href="#favorites" class="nav-item ${active === 'favorites' ? 'active' : ''}">
        ${this.icons.heart}
        <span>Избранное</span>
      </a>
    `;
  },

  // ========================================
  // HOME PAGE
  // ========================================
  showHome() {
    this.currentPage = 'home';
    this.renderHeader('home');
    this.renderNav('home');

    const main = document.getElementById('main-content');
    const categoriesHTML = CATEGORIES.filter(cat => cat.id !== 'boosters').map(cat => {
      const count = DRINKS.filter(d => d.category === cat.id).length;
      if (cat.id === 'boosters') {
        return `
          <a href="#category/${cat.id}" class="category-card" style="background: ${cat.color}; color: white;">
            <div class="category-card-content">
              <div class="category-card-subtitle">${cat.nameRu}</div>
              <div class="category-card-name">${cat.nameEn}</div>
              <div class="category-card-desc">${cat.description}</div>
              <div class="category-card-count">${BOOSTERS.length} добавок</div>
            </div>
            <div class="category-card-arrow">${this.icons.arrow}</div>
          </a>
        `;
      }
      return `
        <a href="#category/${cat.id}" class="category-card" style="background: ${cat.colorLight}; color: ${cat.color};">
          <div class="category-card-content">
            <div class="category-card-subtitle" style="color: ${cat.color}99">${cat.nameRu}</div>
            <div class="category-card-name" style="color: ${cat.color}">${cat.nameEn}</div>
            <div class="category-card-desc" style="color: ${cat.color}cc">${cat.description}</div>
            <div class="category-card-count" style="color: ${cat.color}99">${count} ${this.pluralizeRu(count, 'напиток', 'напитка', 'напитков')}</div>
          </div>
          <div class="category-card-arrow" style="color: ${cat.color}">${this.icons.arrow}</div>
        </a>
      `;
    }).join('');

    main.innerHTML = `
      <div class="page-enter">
        <div class="page-title">
          <h1>Функциональные напитки</h1>
          <p>Выберите напиток по вашему состоянию</p>
        </div>
        <div class="search-container">
          <div class="search-box" onclick="location.hash='#search'">
            ${this.icons.search}
            <input type="text" placeholder="Поиск по ингредиентам или свойствам..." readonly>
          </div>
        </div>
        <div class="categories-grid">
          ${categoriesHTML}
        </div>
      </div>
    `;
  },

  // ========================================
  // SEARCH PAGE
  // ========================================
  showSearchPage() {
    this.currentPage = 'search';
    this.renderHeader('back', 'Поиск');
    this.renderNav('home');

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-enter">
        <div class="search-container" style="padding-top: var(--space-md)">
          <div class="search-box">
            ${this.icons.search}
            <input type="text" id="search-input" placeholder="Поиск по ингредиентам или свойствам..." autofocus>
            <button class="search-clear" id="search-clear" onclick="App.clearSearch()">x</button>
          </div>
        </div>
        <div id="search-results" class="search-results"></div>
      </div>
    `;

    const input = document.getElementById('search-input');
    input.addEventListener('input', () => this.onSearch(input.value));
    setTimeout(() => input.focus(), 100);
  },

  onSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    const clearBtn = document.getElementById('search-clear');
    clearBtn.classList.toggle('visible', this.searchQuery.length > 0);

    const resultsEl = document.getElementById('search-results');

    if (!this.searchQuery) {
      resultsEl.innerHTML = '';
      return;
    }

    const results = DRINKS.filter(d => {
      const searchable = [
        d.nameEn, d.nameRu, d.functionRu, d.functionShort,
        d.ingredients || '', d.flavorProfile || '',
        ...(d.activeComponents || [])
      ].join(' ').toLowerCase();
      return searchable.includes(this.searchQuery);
    });

    if (results.length === 0) {
      resultsEl.innerHTML = `
        <div class="favorites-empty" style="padding-top: var(--space-xl)">
          <div class="favorites-empty-icon">${this.icons.search}</div>
          <h2>Ничего не найдено</h2>
          <p>Попробуйте другой ингредиент или свойство</p>
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = `
      <div class="search-results-title">${results.length} ${this.pluralizeRu(results.length, 'результат', 'результата', 'результатов')}</div>
      <div class="drinks-list" style="padding: 0">
        ${results.map(d => this.renderDrinkCard(d)).join('')}
      </div>
    `;
  },

  clearSearch() {
    const input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    this.onSearch('');
  },

  // ========================================
  // CATEGORY PAGE
  // ========================================
  showCategory(catId) {
    this.currentPage = 'category';
    this.currentCategory = catId;
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) { location.hash = '#home'; return; }

    this.renderHeader('back', cat.nameRu);
    this.renderNav('home');

    const main = document.getElementById('main-content');

    if (catId === 'boosters') {
      main.innerHTML = `
        <div class="page-enter">
          <div class="category-hero" style="background: ${cat.colorLight}; color: ${cat.color};">
            <h2>${cat.nameRu} / ${cat.nameEn}</h2>
            <p>${cat.description}</p>
            <p style="margin-top: 4px; font-size: 13px; opacity: 0.8;">${cat.descriptionEn}</p>
          </div>
          <div class="boosters-section">
            <div class="boosters-grid">
              ${BOOSTERS.map(b => `
                <div class="booster-card">
                  <div class="booster-name">${b.name}</div>
                  <div class="booster-function" style="color:${b.color || '#265B2D'};">${b.function}</div>
                  <div class="booster-ingredients">${b.activeIngredients}</div>
                  <div class="booster-price">${b.price} P</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      return;
    }

    const drinks = DRINKS.filter(d => d.category === catId);

    main.innerHTML = `
      <div class="page-enter category-page" style="background: ${cat.colorLight};">
        <div class="category-header" style="color: ${cat.color};">
          <h2 class="category-header-title">${cat.nameRu} / ${cat.nameEn}</h2>
          <p class="category-header-desc">${cat.description}</p>
        </div>
        <div class="drinks-list">
          ${drinks.map(d => this.renderDrinkCard(d)).join('')}
        </div>
        ${catId === 'vitamins' ? this.renderBoostersSection() : ''}
      </div>
    `;
  },

  renderDrinkCard(drink) {
    const cat = CATEGORIES.find(c => c.id === drink.category);
    const isFav = this.isFavorite(drink.id);
    const emoji = this.drinkEmoji[drink.id] || '\u{1F375}';

    const temps = (drink.temperature || []).map(t => {
      if (t.includes('65-70')) return `<img src="img/icon/hot.png" class="temp-card-img" alt="65-70°C">`;
      if (t.includes('17-24')) return `<img src="img/icon/normal.png" class="temp-card-img" alt="17-24°C">`;
      return `<img src="img/icon/cold.png" class="temp-card-img" alt="6-10°C">`;
    }).join('');

    return `
      <a href="#drink/${drink.id}" class="drink-card">
        ${drink.image ? `<div class="drink-card-image"><img src="${drink.image}" alt="${drink.nameEn}"></div>` : ''}
        <div class="drink-card-info">
          <div>
            <div class="drink-card-name">${drink.nameEn}</div>
            <div class="drink-card-name-ru">${drink.nameRu}</div>
            <div class="drink-card-function">${drink.functionRu}</div>
          </div>
          <div class="drink-card-temps">${temps}</div>
          <div class="drink-card-price">${drink.price} P</div>
        </div>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${drink.id}" onclick="App.toggleFavorite('${drink.id}', event)">
          ${isFav ? this.icons.heartFilled : this.icons.heart}
        </button>
      </a>
    `;
  },

  renderBoostersSection() {
    return `
      <div class="boosters-section">
        <div class="boosters-section-title">Добавь функциональный бустер к напитку</div>
        <div class="boosters-grid">
          ${BOOSTERS.map(b => `
            <div class="booster-card" style="background:${b.bg || '#F5F0E8'};">
              <div class="booster-card-text">
                <div class="booster-name" style="color:${b.color || '#265B2D'};">${b.name}</div>
                <div class="booster-name-ru" style="color:${b.color || '#265B2D'};">${b.activeIngredients}</div>
                <div class="booster-function" style="color:${b.color || '#265B2D'};">${b.function}</div>
                <div class="booster-price" style="color:${b.color || '#265B2D'};">${b.price} ₽</div>
              </div>
              ${b.image ? `<img src="${b.image}" alt="${b.name}" class="booster-img">` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ========================================
  // DRINK DETAIL PAGE
  // ========================================
  showDrink(drinkId) {
    this.currentPage = 'drink';
    this.currentDrink = drinkId;
    const drink = DRINKS.find(d => d.id === drinkId);
    if (!drink) { location.hash = '#home'; return; }

    const cat = CATEGORIES.find(c => c.id === drink.category);
    this.renderHeader('back', drink.nameEn);
    this.renderNav('home');

    const main = document.getElementById('main-content');
    const emoji = this.drinkEmoji[drink.id] || '\u{1F375}';
    const isFav = this.isFavorite(drink.id);
    const ic = (em) => `<span class="section-icon" style="background:${cat.colorLight};color:${cat.color};">${em}</span>`;

    let html = `<div class="page-enter">`;

    // === HERO ===
    html += `
      <div class="drink-hero-wrap">
        <div class="drink-hero ${drink.image ? '' : 'drink-hero--no-image'}" style="background: linear-gradient(180deg, ${cat.colorLight}, var(--bg));">
          ${drink.image ? `<div class="drink-hero-image"><img src="${drink.image}" alt="${drink.nameEn}"></div>` : ''}
        </div>
        <button class="drink-hero-fav ${isFav ? 'active' : ''}" data-fav="${drink.id}" onclick="App.toggleFavorite('${drink.id}')">
          ${isFav ? this.icons.heartFilled : this.icons.heart}
        </button>
        <div class="drink-info-card">
          <div class="drink-info-card-meta">
            <span class="drink-hero-cat-tag" style="background:${cat.colorLight};color:${cat.color};">${cat.nameRu}</span>
          </div>
          <h1 class="drink-info-card-name">${drink.nameEn}</h1>
          <div class="drink-info-card-name-ru">${drink.nameRu}</div>
          <p class="drink-info-card-desc">${drink.description ? drink.description.split('\n')[0] : (drink.functionRu || drink.functionShort)}</p>
        </div>
      </div>
    `;

    html += `<div class="drink-content">`;

    // === FUNCTION BLOCK ===
    html += `
      <div class="drink-section">
        <div class="drink-function-block" style="background:${cat.colorLight};">
          <div class="section-card-title" style="color:${cat.color};">Функция / Function</div>
          <div class="drink-function-text" style="color:${cat.color};">${drink.functionRu || drink.functionShort}</div>
        </div>
      </div>
    `;

    // === СОСТАВ (Формула напитка) ===
    // Phyto Composition
    if (drink.phytoComposition) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Фитокомпозиция</div>
            <div class="fruit-list">
              ${drink.phytoComposition.map(i => `
                <div class="fruit-item">
                  <div class="fruit-info"><div class="fruit-name">${i.name}</div>${i.effect ? `<div class="fruit-effect">${i.effect}</div>` : ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Fruit Base
    if (drink.fruitBase) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Вкусовая база</div>
            <div class="fruit-list">
              ${drink.fruitBase.map(f => `
                <div class="fruit-item">
                  <div class="fruit-info"><div class="fruit-name">${f.name}</div>${f.effect ? `<div class="fruit-effect">${f.effect}</div>` : ''}</div>
                  <div class="fruit-amount">${f.amount}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Nutraceuticals
    if (drink.nutraceuticals) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Нутрицевтики</div>
            <div class="nutra-grid">
              ${drink.nutraceuticals.map(n => `
                <div class="nutra-item">
                  <div class="nutra-amount" style="background: ${cat.colorLight}; color: ${cat.color};">${n.amount}</div>
                  <div class="nutra-name">${n.name}</div>
                  <div class="nutra-effect">${n.effect}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Active Components
    if (drink.activeComponents && drink.activeComponents.length) {
      html += `
        <div class="drink-section">
          <div class="section-card-title">Активные компоненты</div>
          <div class="components-grid">
            ${drink.activeComponents.map(c => {
              const col = this.getComponentColor(c);
              return `<span class="component-badge" style="background:${col}22;color:${col};border-color:${col}55;">${c}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Ingredients (basic fallback)
    if (!drink.phytoComposition && !drink.fruitBase && drink.ingredients) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Растительные компоненты</div>
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${drink.ingredients}</div>
          </div>
        </div>
      `;
    }

    // Flavor Profile (basic fallback)
    if (!drink.fruitBase && drink.flavorProfile) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Вкусовой профиль</div>
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${drink.flavorProfile}</div>
          </div>
        </div>
      `;
    }

    // === DESCRIPTION ===
    if (drink.description) {
      const descFull = drink.description.replace(/\n/g, '<br>');
      html += `
        <div class="drink-section">
          <div class="drink-description">${descFull}</div>
        </div>
      `;
    }

    // === SIMPLE WORDS ===
    if (drink.simpleWords) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Простыми словами</div>
            <div class="simple-words-list">
              ${drink.simpleWords.map(w => `<div class="simple-words-item"><span style="color: ${cat.color}">\u2713</span> ${w}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // === TIMELINE ===
    if (drink.timeline) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title"><img src="img/icon/time.png" class="drink-info-icon" alt="" style="vertical-align:middle;margin-right:6px;margin-bottom:2px;"> Эффект по минутам</div>
            <div class="timeline-compact">
              ${drink.timeline.map(t => `
                <div class="tl-item">
                  <div class="tl-time" style="background: ${cat.colorLight}; color: ${cat.color};">${t.time}</div>
                  <div class="tl-content">
                    <div class="tl-title">${t.title}</div>
                    <div class="tl-text">${t.effect}</div>
                    <div class="tl-feeling" style="background: ${cat.colorLight}; color: ${cat.color};">${t.feeling}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // === SENSOR PROFILE ===
    if (drink.sensorProfile) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title">Сенсорный профиль</div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">${drink.sensorProfile}</div>
          </div>
        </div>
      `;
    }

    // === WHEN USEFUL ===
    if (drink.whenUseful) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title"><img src="img/icon/polza.png" class="drink-info-icon" alt="" style="vertical-align:middle;margin-right:6px;margin-bottom:2px;"> Когда особенно полезен</div>
            <div class="use-list">
              ${drink.whenUseful.map(w => `<div class="use-item"><span class="use-icon" style="color:${cat.color}">\u2022</span><span>${w}</span></div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // === LIFESTYLE ===
    if (drink.lifestyle) {
      html += `
        <div class="drink-section">
          <div class="section-card">
            <div class="section-card-title"><img src="img/icon/day.png" class="drink-info-icon" alt="" style="vertical-align:middle;margin-right:6px;margin-bottom:2px;"> Интеграция в образ жизни</div>
            <div class="use-list">
              ${drink.lifestyle.map(l => `<div class="use-item"><span class="use-icon" style="color:${cat.color}">\u2022</span><span>${l}</span></div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // === BOTTOM INFO ===
    html += `<div class="drink-bottom-info">`;

    if (drink.temperature && drink.temperature.length) {
      html += `<div class="drink-temps">`;
      drink.temperature.forEach(t => {
        if (t.includes('65-70')) html += `<img src="img/icon/hot.png" class="temp-card-img" alt="65-70°C">`;
        else if (t.includes('17-24')) html += `<img src="img/icon/normal.png" class="temp-card-img" alt="17-24°C">`;
        else html += `<img src="img/icon/cold.png" class="temp-card-img" alt="6-10°C">`;
      });
      html += `</div>`;
    }
    html += `<div class="drink-price-row"><div class="drink-price-value" style="color:${cat.color};">${drink.price} ₽</div></div>`;
    html += `</div>`;

    // === BOOSTERS (only for vitamins category) ===
    if (drink.category === 'vitamins') {
      html += this.renderBoostersSection();
    }

    // === CTA (Favorites button) ===
    html += `
      <button class="drink-cta-btn ${isFav ? 'active' : ''}" style="background: ${cat.color};" data-fav="${drink.id}" onclick="App.toggleFavorite('${drink.id}')">
        ${isFav ? this.icons.heartFilled : this.icons.heart}
        <span>${isFav ? '\u0412 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u043c' : '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435'}</span>
      </button>
    `;

    // === DOCTOR NOTE ===
    if (drink.doctorNote) {
      html += `
        <div class="drink-section">
          <div class="doctor-note">
            <div class="doctor-note-text">${drink.doctorNote.replace(/[<>]/g, '')}</div>
            <div class="doctor-note-label">\u2014 Dr. Herbarius Smith</div>
          </div>
        </div>
      `;
    }

    // === RECOMMENDATION ===
    if (drink.recommendation) {
      html += `
        <div class="drink-section">
          <div class="section-card" style="background:${cat.colorLight};">
            <div class="section-card-title" style="color:${cat.color};">Рекомендация</div>
            <div style="font-size: 14px; line-height: 1.5; color: ${cat.color};">${drink.recommendation}</div>
          </div>
        </div>
      `;
    }

    html += `</div>`; // drink-content
    html += `</div>`; // page-enter

    main.innerHTML = html;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  // ========================================
  // FAVORITES PAGE
  // ========================================
  showFavorites() {
    this.currentPage = 'favorites';
    this.renderHeader('home');
    this.renderNav('favorites');

    const main = document.getElementById('main-content');
    const favDrinks = DRINKS.filter(d => this.favorites.includes(d.id));

    if (favDrinks.length === 0) {
      main.innerHTML = `
        <div class="page-enter">
          <div class="page-title">
            <h1>Избранное</h1>
          </div>
          <div class="favorites-empty">
            <div class="favorites-empty-icon">\u2764\uFE0F</div>
            <h2>Пока пусто</h2>
            <p>Нажмите на сердечко у любого напитка, чтобы сохранить его здесь.</p>
          </div>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div class="page-enter">
        <div class="page-title">
          <h1>Избранное</h1>
          <p>${favDrinks.length} ${this.pluralizeRu(favDrinks.length, 'напиток сохранён', 'напитка сохранено', 'напитков сохранено')}</p>
        </div>
        <div class="drinks-list">
          ${favDrinks.map(d => this.renderDrinkCard(d)).join('')}
        </div>
      </div>
    `;
  },

  // ========================================
  // UTILS
  // ========================================
  getComponentColor(c) {
    const cl = c.toLowerCase();
    const vitamins = ['A','C','D','E','PP','B1','B2','B3','B5','B6','B9','B12'];
    if (cl.startsWith('vit ') || vitamins.includes(c)) return '#F59E42';
    if (/цитрат|бисглицинат|малат|минеральный|хлорид/.test(cl)) return '#5BC6D6';
    const minerals = ['K','Na','Mg','Fe','Ca','Zn','Mn','Cu','Al','Se','Ni','Co','Cr','Mo','Ba','V','Pb','I','F','Si'];
    if (minerals.includes(c)) return '#5BC6D6';
    if (/теанин|gaba|инозитол|ноотроп/.test(cl)) return '#1D7ABD';
    if (cl.startsWith('l-') || /bcaa|сывороточный|таурин|глутамин|триптофан|карнитин|цитруллин/.test(cl)) return '#7560A5';
    if (/ресвератрол|resveratrol|адаптоген/.test(cl)) return '#7DAF93';
    return '#A56097';
  },

  pluralize(count, one, many) {
    return count === 1 ? one : many;
  },

  pluralizeRu(count, one, few, many) {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => App.init());
