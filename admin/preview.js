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

var DrinkPreview = createClass({
  render: function () {
    var data = this.props.entry.get('data').toJS();
    var category = categoryStyles[data.category] || categoryStyles.vitamins;
    var image = data.image ? this.props.getAsset(data.image) : null;
    var imageUrl = image ? image.toString() : '';
    var ingredients = Array.isArray(data.fruitBase) ? data.fruitBase : [];

    return h('div', { className: 'drink-preview' },
      h('div', { className: 'drink-preview-caption' }, 'Так напиток выглядит в меню'),
      h('article', {
        className: 'drink-preview-card',
        style: { '--preview-accent': category.color, '--preview-tint': category.light },
      },
        imageUrl ? h('div', { className: 'drink-preview-image' },
          h('img', { src: imageUrl, alt: data.nameRu || '' })
        ) : null,
        h('div', { className: 'drink-preview-info' },
          h('div', { className: 'drink-preview-category' }, category.name),
          h('h1', { className: 'drink-preview-name' }, data.nameRu || 'Название напитка'),
          data.nameEn ? h('div', { className: 'drink-preview-name-en' }, data.nameEn) : null,
          h('p', { className: 'drink-preview-function' }, data.functionRu || data.functionShort || ''),
          h('div', { className: 'drink-preview-meta' },
            data.volume ? h('span', {}, data.volume) : null,
            Array.isArray(data.temperature) ? data.temperature.map(function (temperature, index) {
              return h('span', { key: index }, temperature);
            }) : null
          ),
          h('div', { className: 'drink-preview-price' }, data.price ? data.price + ' ₽' : '')
        )
      ),
      data.description ? h('section', { className: 'drink-preview-description' },
        h('h2', {}, 'Описание'),
        h('p', {}, data.description)
      ) : null,
      ingredients.length ? h('section', { className: 'drink-preview-ingredients' },
        h('h2', {}, 'Состав'),
        h('ul', {}, ingredients.map(function (item, index) {
          var name = typeof item === 'string' ? item : item.name;
          return h('li', { key: index }, name || '');
        }))
      ) : null
    );
  },
});

CMS.registerPreviewStyle('/css/styles.css');
CMS.registerPreviewStyle('/admin/preview.css');
CMS.registerPreviewTemplate('drinks', DrinkPreview);
