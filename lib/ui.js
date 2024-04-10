import { getProduct, searchProducts, fetchProducts, fetchCategories } from './api.js';
import { el } from './elements.js';

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(parentElement, searchForm = undefined) {
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }

  if (!searchForm) {
    return;
  }

  const button = searchForm.querySelector('button');

  if (button) {
    button.setAttribute('disabled', 'disabled');
  }
}

/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(parentElement, searchForm = undefined) {
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }

  if (!searchForm) {
    return;
  }

  const disabledButton = searchForm.querySelector('button[disabled]');

  if (disabledButton) {
    disabledButton.removeAttribute('disabled');
  }
}

export function createSearchResults(results, query) {
  const list = el('div', { class: 'results' });

  if (!results) {
    // Villustaða
    const item = el('p', { class: 'result' }, 'Villa við að sækja gögn.');
    list.appendChild(item);
  } else {
    // Tóm staða
    if (results.length === 0) {
      const item = el('p', { class: 'result' }, 'Ekkert fannst.');
      list.appendChild(item);
    }

    const resultTitle = el(
        'div',
        { class: 'resultTitle' },
        el('h2', {}, `Leitarniðurstöður fyrir „${query}“`)
    );
    list.appendChild(resultTitle);

    // Gagnastaða
    for (const result of results) {
        const card = el(
            'div',
            { class: 'card' },
            el('a', { href: `?id=${result.id}` },
                el('img', { src: `${result.image}`, alt: ''})
            ),
            el('div', { class: 'card-info' },
                el('div', { class:'card-text'},
                    el(
                        'a',
                        { href: `?id=${result.id}` },
                        el('h3', {}, result.title)),
                    el('p', {}, result.category_title)),
                el('p', { class: 'price' }, `${result.price} kr.-`)
            )
        );
        list.appendChild(card);
    }
  } 
}

export async function searchAndRender(parentElement, searchForm, query) {

  // Fjarlægjum fyrri niðurstöður
  const resultsElement = parentElement.querySelector('.results');
  if (resultsElement) {
    resultsElement.remove();
  }

  setLoading(parentElement, searchForm);
  const results = await searchProducts(query);
  setNotLoading(parentElement, searchForm);

  const resultsEl = createSearchResults(results);

  parentElement.appendChild(resultsEl);
}

export function renderHeader(parentElement) {
    const urlLimit = 100;
    const urlOffset = 0;

    const header = el('header', { class: 'header'}, 
        el('div', { class: 'header-content' }, 
            el('div', { class:'logo' }, 
                el('a', {href: '/'}, 
                    el('h1', {}, 'Vefforritunarbúðin'),
                ),
                el('p', { class:'sr-only' }, 
                    el(
                        'a', { href: '#efni'}, 'Beint í efni'
                    ),
                ),
            ),
            el('nav', { class:'nav'}, 
                el(
                    'div', { class:'nav-sign-in' }, 
                    el('a', { href:'/' }, 'Nýskrá'),
                    el('a', { href:'/' }, 'Innskrá'),
                ),
                el(
                    'div', { class:'nav-cart' }, 
                    el('a', { href:'/' }, 'Karfa'),
                ),
                el(
                    'div', { class:'nav-products' }, 
                    el('a', { class:'nav-new-products', href:`/?products=all&offset=${urlOffset}&limit=${urlLimit}` }, 'Allar vörur'),
                    el('a', { id:'nav-categories', href:'/?categories=all' }, 'Flokkar'),
                ),
            )
        )
    );
    parentElement.appendChild(header);
}

export async function renderProducts(parentElement, limit, category, title, offset) {

    setLoading(parentElement);
    const results = await fetchProducts(limit, category, offset);
    setNotLoading(parentElement);

    const productSection = el(
      'div',
      { id: 'product-section' },
        el('h1', {}, title),
    );

    const cards = el('section', { class: 'cards' });
  
    productSection.appendChild(cards);

    const params = new URLSearchParams(window.location.search);
    const products = params.get('products');
    if (products) {
        const searchForm = renderSearchForm();
        productSection.appendChild(searchForm);
    }
  
    for (const result of results) {
        const card = el(
          'div',
          { class: 'card' },
            el('a', { href: `?id=${result.id}` },
                el('img', { src: `${result.image}`, alt: ''})
            ),
            el('div', { class: 'card-info' },
                el('div', { class:'card-text'},
                    el(
                        'a',
                        { href: `?id=${result.id}` },
                        el('h3', {}, result.title)),
                    el('p', {}, result.category_title)),
                el('p', { class: 'price' }, `${result.price} kr.-`)
            )
        );
        cards.appendChild(card);
    }

    if (!results) {
        parentElement.appendChild(el('p', {}, 'Villa við að sækja gögn um vöru!'));
        return;
    }

    parentElement.appendChild(productSection);

    return productSection;
}

export async function renderButton(parentElement) {
    const button = el('a', { href: '/?categories=all' }, 
        el('button', { class: 'button' }, 'Skoða alla flokka')
    );

    parentElement.appendChild(button);
}

export async function renderCategories(parentElement, limit) {

    setLoading(parentElement);
    const results = await fetchCategories(null, limit);
    setNotLoading(parentElement);

    const categorySection = el(
      'div',
      { id: 'category-section' },
        el('h2', {}, 'Skoðaðu vöruflokkana okkar'),
    );

    const categories = el('div', { class: 'categories' });

    parentElement.appendChild(categorySection);
    categorySection.appendChild(categories);
  
    for (const result of results) {

        const category = el(
          'div',
          { class: 'category' },
          el('a', { href: `/?category=${result.id}`}, el('p', { class: `${result.title}` }, result.title))
        );
        categories.appendChild(category);
    }

    if (!results || results.length == 0) {
        parentElement.appendChild(el('p', {}, 'Villa við að sækja gögn um vöru!'));
        return;
    }
}

export async function renderProductPage(container, id) {

    setLoading(container);
    const result = await getProduct(id);

    const productDisplay = el(
      'div',
      { class: 'product-display' },
        el('img', { src:`${result.image}`, alt: '' }),
        el('div', { class:'product-info' }, 
            el('h2', {}, result.title),
            el('p', {}, `Flokkur: ${result.category_title}`),
            el('p', {}, `Verð: ${result.price} kr.-`),
            el('p', {}, result.description)
        )
    )
    container.appendChild(productDisplay);

    const productSection = 
        el('div', { class: 'product-section' },
            el('h1', {}, `Meira úr ${result.category_title}`)
        )

    const cards = el('section', { class: 'cards' });
    productSection.appendChild(cards);
    container.appendChild(productSection);

    setNotLoading(container);

    const products = await fetchProducts(3, result.category_id);
  
    for (const product of products) {
        const card = el(
          'div',
          { class: 'card' },
            el('a', { href: `?id=${product.id}` },
                el('img', { src: `${product.image}`, alt: ''})
            ),
            el('div', { class: 'card-info' },
                el('div', { class:'card-text'},
                    el(
                        'a',
                        { href: `/products/${product.category_id}` },
                        el('h3', {}, product.title)),
                    el('p', {}, product.category_title)),
                el('p', { class: 'price' }, `${product.price} kr.-`)
            )
        );
        cards.appendChild(card);
      }

    if (!result) {
        container.appendChild(el('p', {}, 'Villa við að sækja gögn um vöru!'));
        return;
    }

    return productDisplay;
}

export function renderSearchForm(searchHandler, query = undefined) {
    
    const label = el('label', { for: 'search' }, 'Leita:');

    const search = el('input', {
    type: 'search',
    placeholder: 'Leitarorð',
    value: query ?? '',
    class: 'search',
  });
  const button = el('button', { class:'search-button'}, 'Leita');

  const container = el('form', { class: 'search-bar' }, label, search, button);
  container.addEventListener('submit', searchHandler);
  return container;
}

export function renderPagination(container, category, limit) {
    
    let offset = 0;

    const buttonLeft = el('button', { class:'button-left' }, 'Fyrri síða');
    const buttonRight = el('button', { class: 'button-right' }, 'Næsta síða');

    const pagination = el('div', { class: 'pagination' }, 
    buttonLeft, buttonRight);

    buttonLeft.addEventListener('click', async () => {
        offset -= limit;
        if (offset < 0) {
            offset = 0;
        }
        await renderProducts(container, limit, category, 'Allar vörur', offset);
    });
    
    buttonRight.addEventListener('click', async () => {
        // Fjarlægjum fyrri niðurstöður
        const productsElement = container.querySelector('.product-section');
        const paginationElement = container.querySelector('.pagination');

        if (productsElement) {
            productsElement.remove();
        }
        if (paginationElement) {
            paginationElement.remove();
        }
        
        offset += limit;
        await renderProducts(container, limit, category, 'Allar vörur', offset);
    });

    container.appendChild(pagination);
}

export async function renderCategoryPage(container, category, limit, onSearch, searchHandler, query = undefined) {

    setLoading(container);
    const results = await fetchProducts(limit, category);
    setNotLoading(container);

    const label = el('label', { for: 'search' }, 'Leita:');

    const search = el('input', {
    type: 'search',
    placeholder: 'Leitarorð',
    value: query ?? '',
    class: 'search',
    });
    const button = el('button', { class:'search-button'}, 'Leita');

    const searchForm = el('form', { class: 'search-bar' }, label, search, button);

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await onSearch(e);
    });

    searchAndRender(container, search, query);

    const productSection = 
        el('div', { class: 'product-section' },
            el('h1', {}, `${results[0].category_title}`),
            searchForm
        );

    const cards = el('section', { class: 'cards' });
    productSection.appendChild(cards);
    container.appendChild(productSection);
  
    for (const result of results) {
        const card = el(
          'div',
          { class: 'card' },
            el('a', { href: `?id=${result.id}` },
                el('img', { src: `${result.image}`, alt: ''})
            ),
            el('div', { class: 'card-info' },
                el('div', { class:'card-text'},
                    el(
                        'a',
                        { href: `?id=${result.id}` },
                        el('h3', {}, result.title)),
                    el('p', {}, result.category_title)),
                el('p', { class: 'price' }, `${result.price} kr.-`)
            )
        );
        cards.appendChild(card);
      }

    if (!results) {
        container.appendChild(el('p', {}, 'Villa við að sækja gögn um vöru!'));
        return;
    }

    const buttonLeft = el('button', { class:'button-left' }, 'Fyrri flokkur');
    const buttonRight = el('button', { class: 'button-right' }, 'Næsti flokkur');

    const pagination = el('div', { class: 'pagination' }, 
    buttonLeft, buttonRight);

    buttonLeft.addEventListener('click', () => 
        changeCategory(-1, container, category, limit, searchHandler, query)
    );
    
    buttonRight.addEventListener('click', () => 
        changeCategory(1, container, category, limit, searchHandler, query)
    );

    container.appendChild(pagination);
}

async function changeCategory(direction, parentElement, category, limit, searchHandler, query) {

    // Fjarlægjum fyrri niðurstöður
    const productsElement = parentElement.querySelector('.product-section');
    const paginationElement = parentElement.querySelector('.pagination');

    if (productsElement) {
        productsElement.remove();
    }
    if (paginationElement) {
        paginationElement.remove();
    }

    let currentCategoryId = parseInt(category, 10);
    
    currentCategoryId += direction;
    const minCategoryId = 1;
    const maxCategoryId = 12;

    // Pössum að indexið haldist innan marka
    if (currentCategoryId < minCategoryId) {
        currentCategoryId = maxCategoryId;
    } else if (currentCategoryId > maxCategoryId) {
        currentCategoryId = minCategoryId;
    }

    // Uppfærum URL-ið með history API
    const newUrl = `?category=${currentCategoryId}`;
    window.history.pushState({}, '', newUrl);

    // Endurhlöðum flokkasíðuna með nýja flokkinn
    renderCategoryPage(parentElement, currentCategoryId, limit, searchHandler, query);
}