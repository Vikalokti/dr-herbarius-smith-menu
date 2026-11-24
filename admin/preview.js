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
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var category = categoryStyles[data.category] || categoryStyles.vitamins;
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
