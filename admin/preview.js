var categoryStyles = {
  vitamins: { name: 'Витаминные миксы', color: '#265B2D', light: '#EFF6EE' },
  mind: { name: 'Мышление и настроение', color: '#A25922', light: '#FFF9E2' },
  sport: { name: 'Спортивные напитки', color: '#3B6890', light: '#F1F9FE' },
  elixirs: { name: 'Секретные эликсиры', color: '#915A84', light: '#FCF3FA' },
  'energy-boost': { name: 'Быстрый энергетический буст', color: '#D4710A', light: '#FFF3E0' },
  green: { name: 'Зелёные напитки', color: '#5C6B2E', light: '#F4F6EA' },
  beauty: { name: 'Бьюти-напитки', color: '#D5778E', light: '#FDF0F3' },
  microbiota: { name: 'Напитки для микробиоты', color: '#9B615A', light: '#F5EFEE' },
  'tea-coffee': { name: 'Чай и кофе', color: '#5A4632', light: '#F4EEE6' },
  fiber: { name: 'Тоники с клетчаткой', color: '#5A9B5C', light: '#EFF6EF' },
  fermented: { name: 'Ферментированные напитки', color: '#D5994A', light: '#FDF5EA' },
  herbal: { name: 'Фитокомплексы', color: '#8B76A7', light: '#F3F0F7' },
  detox: { name: 'Детокс-воды', color: '#985A4B', light: '#FEF0ED' },
  oxygen: { name: 'Кислородные коктейли', color: '#248386', light: '#E0F2F1' },
};

var previewCatalogPromise = fetch('/data/catalog.json', { cache: 'no-cache' })
  .then(function (response) { return response.ok ? response.json() : {}; })
  .catch(function () { return {}; });

var previewCategoriesPromise = previewCatalogPromise
  .then(function (catalog) {
    return (catalog.CATEGORIES || []).reduce(function (categories, category) {
      categories[category.id] = {
        name: category.nameRu,
        nameEn: category.nameEn,
        description: category.description,
        color: category.color,
        light: category.colorLight,
      };
      return categories;
    }, {});
  })
  .catch(function () { return {}; });

function previewImage(context, path, alt, className) {
  if (!path) return null;
  var asset = context.props.getAsset(path);
  return h('img', {
    src: asset ? asset.toString() : path,
    alt: alt || '',
    className: className || '',
  });
}

function PreviewPageHeader(eyebrow, title, subtitle) {
  return h('header', { className: 'cms-page-header' },
    h('div', { className: 'cms-page-eyebrow' }, eyebrow),
    h('h1', { className: 'cms-page-title' }, title),
    subtitle ? h('p', { className: 'cms-page-subtitle' }, subtitle) : null
  );
}

var BoosterPreview = createClass({
  getInitialState: function () {
    return { catalog: {} };
  },
  componentDidMount: function () {
    var component = this;
    previewCatalogPromise.then(function (catalog) {
      component.setState({ catalog: catalog || {} });
    });
  },
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var catalog = this.state.catalog || {};
    var categories = Array.isArray(catalog.CATEGORIES) ? catalog.CATEGORIES : [];
    var category = categories.find(function (item) { return item.id === 'boosters'; }) || {};
    var boosters = Array.isArray(catalog.BOOSTERS) ? catalog.BOOSTERS.slice() : [];
    var currentIndex = boosters.findIndex(function (item) { return item.id === data.id; });
    if (currentIndex >= 0) boosters[currentIndex] = data;
    else boosters.push(data);
    return h('div', { className: 'drink-preview cms-collection-preview' },
      PreviewPageHeader(category.nameEn || 'Boosters', category.nameRu || 'Бустеры', category.description || ''),
      data.hidden ? h('div', { className: 'cms-preview-status' }, 'Эта позиция скрыта и не показывается на странице бустеров.') : null,
      h('div', { className: 'boosters-section' },
        h('div', { className: 'boosters-grid' }, boosters.filter(function (booster) { return !booster.hidden; }).map(function (booster, index) {
          var name = booster.activeIngredients || 'Активные ингредиенты';
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return h('article', { className: 'booster-card', key: booster.id || index, style: { background: booster.bg || '#F5F0E8' } },
            h('div', { className: 'booster-card-text' },
              h('div', { className: 'booster-name', style: { color: booster.color || '#265B2D' } }, name),
              h('div', { className: 'booster-function', style: { color: booster.color || '#265B2D' } }, 'Функция: ' + (booster.function || '')),
              h('div', { className: 'booster-price', style: { color: booster.color || '#265B2D' } }, (booster.price || '') + ' ₽')
            )
          );
        }))
      )
    );
  },
});

function SnackItemPreview(item, context, key) {
  return h('article', { className: 'snack-item', key: key },
    previewImage(context, item.image, item.name, 'snack-item-img'),
    h('div', { className: 'snack-item-content' },
      h('div', { className: 'snack-item-name' }, item.name || 'Название позиции'),
      item.nameEn ? h('div', { className: 'snack-item-en' }, item.nameEn) : null,
      item.ingredients ? h('div', { className: 'snack-item-ingredients' }, item.ingredients) : null
    ),
    item.price ? h('div', { className: 'snack-item-price' }, item.price + ' ₽') : null
  );
}

function SnackSectionPreview(section, context) {
  var items = Array.isArray(section.items) ? section.items : [];
  var hasSectionPrice = !!section.price && items.every(function (item) { return !item.price; });
  if (section.id === 'desserts') {
    return h('section', { className: 'snack-section snack-section--desserts', key: section.id },
      h('div', { className: 'snack-desserts-title' }, section.name || 'Десерты'),
      h('div', { className: 'snack-items' }, items.map(function (item, index) {
        return SnackItemPreview(item, context, index);
      }))
    );
  }

  if (section.id === 'batat' || section.id === 'pastila') {
    var item = items[0] || {};
    return h('section', { className: 'snack-section snack-section--single', key: section.id },
      previewImage(context, section.image || item.image, section.name, 'snack-single-img'),
      h('div', { className: 'snack-section-single-info' },
        h('div', {},
          section.nameEn ? h('div', { className: 'snack-section-en' }, section.nameEn) : null,
          h('div', { className: 'snack-section-name' }, section.name || 'Название раздела'),
          item.name && item.name !== section.name ? h('div', { className: 'snack-single-ingredients' }, item.name) : null,
          item.ingredients ? h('div', { className: 'snack-single-ingredients' }, item.ingredients) : null
        ),
        section.price ? h('div', { className: 'snack-section-price' }, section.price + ' ₽') : null
      )
    );
  }

  return h('section', { className: 'snack-section', key: section.id || section.name },
    h('div', { className: 'snack-section-header' },
      h('div', {},
        section.nameEn ? h('div', { className: 'snack-section-en' }, section.nameEn) : null,
        h('div', { className: 'snack-section-name' }, section.name || 'Название раздела')
      ),
      h('div', { className: 'snack-preview-price-column' },
        hasSectionPrice ? h('div', { className: 'snack-section-price' }, section.price + ' ₽') : null,
        section.priceNote ? h('div', { className: 'snack-price-note' }, section.priceNote) : null
      )
    ),
    section.image ? previewImage(context, section.image, section.name, 'snack-section-hero-img') : null,
    items.length ? h('div', { className: 'snack-items' }, items.map(function (item, index) {
      return SnackItemPreview(item, context, index);
    })) : h('p', { className: 'snack-preview-empty' }, 'Добавьте позиции в этот раздел.')
  );
}

var SnacksPreview = createClass({
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var sections = Array.isArray(data.sections) ? data.sections : [];
    return h('div', { className: 'drink-preview cms-collection-preview' },
      PreviewPageHeader('Меню', 'Перекусы', 'Так раздел будет выглядеть на сайте'),
      data.richBase ? h('section', { className: 'snack-preview-base' },
        h('div', { className: 'snack-preview-base-name' }, data.richBase.name || 'Название основы'),
        data.richBase.nameEn ? h('div', { className: 'snack-section-en' }, data.richBase.nameEn) : null,
        data.richBase.ingredients ? h('p', { className: 'snack-item-ingredients' }, data.richBase.ingredients) : null
      ) : null,
      sections.map(function (section) { return SnackSectionPreview(section, this); }, this)
    );
  },
});

var MonoPreview = createClass({
  getInitialState: function () {
    return { category: {} };
  },
  componentDidMount: function () {
    var component = this;
    previewCategoriesPromise.then(function (categories) {
      component.setState({ category: categories.mono || {} });
    });
  },
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var herbs = Array.isArray(data.MONO_HERBS) ? data.MONO_HERBS : [];
    var states = Array.isArray(data.MONO_BY_STATE) ? data.MONO_BY_STATE : [];
    var category = this.state.category || {};
    var accent = category.color || '#6B7B3A';
    return h('div', { className: 'drink-preview cms-collection-preview' },
      PreviewPageHeader(category.nameEn || 'Mono Herbs', category.nameRu || 'Моно растения', category.description || ''),
      h('div', { className: 'mono-preview-guide' },
        h('strong', {}, 'Собери свой настой'),
        h('span', {}, '380 мл · заваривание 5 минут'),
        h('span', {}, '1 компонент — точечное действие · 2–3 — баланс вкуса · 4 — сложный профиль')
      ),
      Array.isArray(data.MONO_BLENDS) && data.MONO_BLENDS.length
        ? h('div', { className: 'cms-preview-info-note' }, 'Поле «Готовые купажи» сохраняется в редакторе, но сейчас не отображается на странице сайта.')
        : null,
      previewSection('Ингредиенты · ' + herbs.length + ' моно растений',
        herbs.length ? h('div', { className: 'mono-herbs-list' }, herbs.map(function (herb, index) {
          return h('article', { className: 'mono-herb-card', key: index },
            h('div', { className: 'mono-herb-header' },
              h('span', { className: 'mono-herb-name' }, herb.name || 'Название травы'),
              herb.part ? h('span', { className: 'mono-herb-part' }, herb.part) : null,
              herb.weight ? h('span', { className: 'mono-herb-weight' }, herb.weight) : null
            ),
            herb.source ? h('div', { className: 'mono-herb-source' }, herb.source) : null,
            herb.effect ? h('div', { className: 'mono-herb-effect', style: { color: accent } }, herb.effect) : null
          );
        })) : h('p', { className: 'snack-preview-empty' }, 'Добавьте травы в список.')
      ),
      previewSection('Выбор по состоянию',
        states.length ? h('div', { className: 'mono-preview-grid' }, states.map(function (item, index) {
          return h('article', { className: 'mono-preview-state', key: index },
            h('strong', { style: { color: accent } }, item.state || 'Состояние'),
            h('span', {}, item.herbs || '')
          );
        })) : h('p', { className: 'snack-preview-empty' }, 'Добавьте варианты подбора.')
      ),
      h('div', { className: 'mono-preview-guide mono-preview-guide--extras' },
        h('strong', {}, 'Можно добавить'),
        h('span', {}, 'Горный мёд · сироп топинамбура · сок лимона')
      ),
      h('p', { className: 'mono-preview-advice' }, 'Сильные компоненты (саган-дайля, лимонник, имбирь) лучше использовать как акцент. Если сомневаетесь — бариста поможет собрать состав под ваш запрос.')
    );
  },
});

var CategoriesPreview = createClass({
  getInitialState: function () {
    return { catalog: {} };
  },
  componentDidMount: function () {
    var component = this;
    previewCatalogPromise.then(function (catalog) {
      component.setState({ catalog: catalog || {} });
    });
  },
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var categories = Array.isArray(data.CATEGORIES) ? data.CATEGORIES : [];
    var catalog = this.state.catalog || {};
    var drinks = Array.isArray(catalog.DRINKS) ? catalog.DRINKS : [];
    var monoCount = Array.isArray(catalog.MONO_HERBS) ? catalog.MONO_HERBS.length : 0;
    var visible = categories.filter(function (category) { return category.id !== 'boosters' && !category.hidden; });
    var hidden = categories.filter(function (category) { return category.id !== 'boosters' && category.hidden; });
    function categoryCard(category, index, isHidden) {
      var count = category.id === 'mono'
        ? monoCount + ' ингредиентов'
        : category.id === 'snacks'
          ? ''
          : drinks.filter(function (drink) { return drink.category === category.id && !drink.hidden; }).length + ' напитков';
      return h('article', {
        className: 'category-preview-card' + (isHidden ? ' category-preview-card--hidden' : ''),
        key: category.id || index,
        style: { background: category.colorLight || '#EFF6EE', color: category.color || '#265B2D' },
      },
        isHidden ? h('span', { className: 'category-preview-hidden-badge' }, 'Скрыта на сайте') : null,
        category.nameEn ? h('div', { className: 'category-preview-en' }, category.nameEn) : null,
        h('h2', { className: 'category-preview-name' }, category.nameRu || 'Название категории'),
        category.description ? h('p', { className: 'category-preview-description' }, category.description) : null,
        count ? h('div', { className: 'category-preview-count' }, count) : null
      );
    }
    return h('div', { className: 'drink-preview cms-collection-preview' },
      PreviewPageHeader('Главная страница', 'Функциональные напитки', 'Так карточки категорий будут выглядеть на главной'),
      h('div', { className: 'category-preview-grid' }, visible.map(function (category, index) {
        return categoryCard(category, index, false);
      })),
      hidden.length ? previewSection('Скрытые категории · не появятся на главной',
        h('div', { className: 'category-preview-grid' }, hidden.map(function (category, index) { return categoryCard(category, index, true); }))
      ) : null,
    );
  },
});

function previewSection(title, content) {
  if (!content) return null;
  return h('section', { className: 'drink-preview-section' },
    h('h2', { className: 'drink-preview-section-title' }, title),
    content
  );
}

function previewParagraph(title, value) {
  if (!value) return null;
  return previewSection(title, h('p', { className: 'drink-preview-copy' }, value));
}

function previewBullets(title, values) {
  if (!Array.isArray(values) || !values.length) return null;
  return previewSection(title,
    h('ul', { className: 'drink-preview-list' }, values.map(function (item, index) {
      var text = typeof item === 'string' ? item : item.name;
      return h('li', { key: index }, text || '');
    }))
  );
}

function previewObjects(title, values, amountLabel) {
  if (!Array.isArray(values) || !values.length) return null;
  return previewSection(title,
    h('div', { className: 'drink-preview-object-list' }, values.map(function (item, index) {
      var name = typeof item === 'string' ? item : item.name;
      var parts = [];
      if (name) parts.push(h('strong', { key: 'name' }, name));
      if (item.effect) parts.push(h('p', { key: 'effect', className: 'drink-preview-copy' }, item.effect));
      if (item[amountLabel]) parts.push(h('span', { key: 'amount', className: 'drink-preview-amount' }, item[amountLabel]));
      return h('div', { key: index, className: 'drink-preview-object' }, parts);
    }))
  );
}

function previewTimeline(values, category) {
  if (!Array.isArray(values) || !values.length) return null;
  return previewSection('Эффект по минутам',
    h('div', { className: 'drink-preview-timeline' }, values.map(function (step, index) {
      return h('article', { key: index, className: 'drink-preview-step' },
        h('div', {
          className: 'drink-preview-step-time',
          style: { color: category.color, background: category.light },
        }, step.time || ''),
        h('div', { className: 'drink-preview-step-body' },
          step.title ? h('h3', {}, step.title) : null,
          step.effect ? h('p', { className: 'drink-preview-copy' }, step.effect) : null,
          step.feeling ? h('p', {
            className: 'drink-preview-feeling',
            style: { color: category.color, background: category.light },
          }, step.feeling) : null
        )
      );
    }))
  );
}

var DrinkPreview = createClass({
  getInitialState: function () {
    return { catalogCategories: {} };
  },
  componentDidMount: function () {
    var component = this;
    previewCategoriesPromise.then(function (categories) {
      component.setState({ catalogCategories: categories });
    });
  },
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var category = this.state.catalogCategories[data.category] || categoryStyles[data.category] || {
      name: 'Категория', color: '#265B2D', light: '#EFF6EE',
    };
    var image = data.image ? this.props.getAsset(data.image) : null;
    var imageUrl = image ? image.toString() : '';
    var children = [];

    children.push(h('div', { key: 'caption', className: 'drink-preview-caption' }, 'Предпросмотр страницы напитка'));
    children.push(h('header', {
      key: 'hero',
      className: 'drink-preview-hero',
      style: { '--preview-accent': category.color, '--preview-tint': category.light },
    },
      imageUrl ? h('div', { className: 'drink-preview-image' }, h('img', { src: imageUrl, alt: data.nameRu || '' })) : null,
      h('div', { className: 'drink-preview-hero-info' },
        h('span', { className: 'drink-preview-category' }, category.name),
        h('h1', { className: 'drink-preview-name' }, data.nameRu || 'Название напитка'),
        data.nameEn ? h('div', { className: 'drink-preview-name-en' }, data.nameEn) : null,
        h('p', { className: 'drink-preview-function' }, data.description ? data.description.split('\n')[0] : (data.functionRu || data.functionShort || '')),
        h('div', { className: 'drink-preview-meta' },
          data.volume ? h('span', {}, data.volume) : null,
          data.calories ? h('span', {}, data.calories + ' ккал') : null,
          data.whenToDrink ? h('span', {}, data.whenToDrink) : null
        ),
        h('div', { className: 'drink-preview-price', style: { color: category.color } }, data.price ? data.price + ' ₽' : '')
      )
    ));

    children.push(previewParagraph('Функция', data.functionRu || data.functionShort));
    children.push(previewParagraph('Описание', data.description));
    children.push(previewParagraph('Состав', data.ingredients));
    children.push(previewObjects('Вкусовая база', data.fruitBase, 'amount'));
    children.push(previewObjects('Фитокомпозиция', data.phytoComposition, 'amount'));
    children.push(previewObjects('Нутрицевтики', data.nutraceuticals, 'amount'));
    children.push(previewBullets('Активные компоненты', data.activeComponents));
    children.push(previewParagraph('Витамины и минералы', data.vitaminsList));
    children.push(previewBullets('Простыми словами', data.simpleWords));
    children.push(previewTimeline(data.timeline, category));
    children.push(previewParagraph('Сенсорный профиль', data.sensorProfile));
    children.push(previewBullets('Когда особенно полезен', data.whenUseful));
    children.push(previewBullets('Интеграция в образ жизни', data.lifestyle));
    children.push(previewParagraph('Вкусовой профиль', data.flavorProfile));
    children.push(previewParagraph('Продолжительность эффекта', data.effectDuration));
    children.push(previewParagraph('Рекомендация', data.recommendation));
    children.push(previewParagraph('Сочетание компонентов', data.synergy));
    children.push(data.temperature && data.temperature.length ? previewSection('Температура подачи',
      h('div', { className: 'drink-preview-tags' }, data.temperature.map(function (item, index) {
        return h('span', { key: index }, item);
      }))
    ) : null);
    children.push(previewParagraph('Комментарий врача', data.doctorNote));

    return h('div', { className: 'drink-preview' }, children.filter(Boolean));
  },
});

CMS.registerPreviewStyle('/css/styles.css');
CMS.registerPreviewStyle('/admin/preview.css');
CMS.registerPreviewTemplate('drinks', DrinkPreview);
CMS.registerPreviewTemplate('boosters', BoosterPreview);
CMS.registerPreviewTemplate('menu', SnacksPreview);
CMS.registerPreviewTemplate('ingredients', MonoPreview);
CMS.registerPreviewTemplate('categories', CategoriesPreview);
