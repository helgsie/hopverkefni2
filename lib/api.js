/** Grunnslóð á API (DEV útgáfa) */
const API_URL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';

/**
 * Skilar Promise sem bíður í gefnar millisekúndur.
 * @param {number} ms Tími til að sofa í millisekúndum.
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}


export async function fetchProducts(limit, category, offset) {
    const url = new URL('products', API_URL);

    if (limit) {
        url.searchParams.set('limit', limit);
    }

    if (offset) {
        url.searchParams.set('offset', offset.toString());
    }

    if (category) {
        url.searchParams.set('category', category);
    }

    let response;
    try {
      response = await fetch(url);
    } catch (e) {
      console.error('Villa við að sækja gögn', e);
      return null;
    }
  
    if (!response.ok) {
      console.error('Fékk ekki 200 status frá API', response);
      return null;
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error('Villa við að lesa gögn', e);
        return null;
    }
    
    return data.items;
}   



export async function fetchCategories(category, limit) {
    const url = new URL('categories', API_URL);
    url.searchParams.set('limit', limit);

    if (category) {
        url.searchParams.set('category', category);
    }

    let response;
    try {
      response = await fetch(url);
    } catch (e) {
      console.error('Villa við að sækja gögn', e);
      return null;
    }
  
    if (!response.ok) {
      console.error('Fékk ekki 200 status frá API', response);
      return null;
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error('Villa við að lesa gögn', e);
        return null;
    }

    return data.items;
}   


export async function searchProducts(query) {
  const url = new URL('products', API_URL);
  url.searchParams.set('search', query);

  // await sleep(1000);

  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
    return null;
  }

  if (!response.ok) {
    console.error('Fékk ekki 200 status frá API', response);
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Villa við að lesa gögn', e);
    return null;
  }
  const results = data?.results ?? [];
  return results;
}


export async function getProduct(id) {
  const url = new URL(`products/${id}`, API_URL);

  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    console.error('Villa við að sækja gögn um vöru', e);
    return null;
  }

  if (!response.ok) {
    console.error('Fékk ekki 200 status frá API fyrir vöru', response);
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Villa við að lesa gögn um vöru', e);
    return null;
  }
  return data;
}