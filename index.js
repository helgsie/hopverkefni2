import { empty, el } from './lib/elements.js';
import { renderProducts, renderCategories, renderHeader, searchAndRender, renderProductPage, renderCategoryPage, renderButton } from './lib/ui.js';

async function onSearch(e) {
  e.preventDefault();

  if (!e.target || !(e.target instanceof Element)) {
    return;
  }

  const { value } = e.target.querySelector('input') ?? {};

  if (!value) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const products = params.get('products');

  if (category) {
    const categoryUrl = `/products?category=${category}&search=${value}`;
    await searchAndRender(document.body, e.target, value);
    window.history.pushState({}, '', categoryUrl);
  } else if (products) {
    const productsUrl = `/?products=all&offset=0&limit=100&search=${value}`;
    await searchAndRender(document.body, e.target, value);
    window.history.pushState({}, '', productsUrl);
  }
}

function route() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const category = params.get('category');
  const categories = params.get('categories');
  const products = params.get('products');

  const limitParam = params.get('limit');
  const offsetParam = params.get('offset');

  const limit = limitParam ? parseInt(limitParam, 10) || 12 : 12;
  const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

  const mainElement = el('main', { class:'main', id:'efni' });

  if (categories) {
    renderHeader(document.body);
    document.body.appendChild(mainElement);
    renderCategories(mainElement, 12);
  }
  else if (products) {
    renderHeader(document.body);
    document.body.appendChild(mainElement);
    renderProducts(mainElement, limit, category, 'Allar vörur', offset)
  }
  else if (id) {
    renderHeader(document.body);
    document.body.appendChild(mainElement);
    renderProductPage(mainElement, id);
  } 
  else if (category) {
    renderHeader(document.body);
    document.body.appendChild(mainElement);
    renderCategoryPage(mainElement, category, limit, onSearch);
  } 
  else {
    renderHeader(document.body);
    renderProducts(mainElement, 6, category, 'Nýjar vörur')
    .then(() => {
        // Þetta fall renderast á eftir renderProducts
        renderButton(mainElement);
      })
      .then(() => {
        // Þetta fall renderast á eftir renderButton
        renderCategories(mainElement, 12);
      })
      .catch(error => {
        // Ef renderProducts birtist ekki
        console.error("Villa við birtingu á vörum", error);
      });
      document.body.appendChild(mainElement);
  }
}

// Bregst við því þegar við notum vafra til að fara til baka eða áfram.
window.onpopstate = () => {
  empty(document.body);
  route();
};

// Athugum í byrjun hvað eigi að birta.
route();