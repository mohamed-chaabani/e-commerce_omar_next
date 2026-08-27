const API_URL = "https://backend-omar-5d89.onrender.com/api";

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/all-products?limit=500`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.products || [];
  } catch {
    return [];
  }
}

async function fetchCategoriesLvl3() {
  try {
    const res = await fetch(`${API_URL}/categories-lvl3`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://e-commerce-omar-next.vercel.app";

  const [products, categoriesLvl3] = await Promise.all([
    fetchProducts(),
    fetchCategoriesLvl3(),
  ]);

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/p/${product.slug || product._id}`,
    lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls = categoriesLvl3.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug || cat._id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const subCategoryUrls = categoriesLvl3
    .flatMap((cat) => cat.categories_list || [])
    .map((sub) => ({
      url: `${baseUrl}/categories-lvl4/${sub.slug || sub._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
    ...categoryUrls,
    ...subCategoryUrls,
  ];
}
