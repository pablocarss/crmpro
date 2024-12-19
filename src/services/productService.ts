interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  createdAt: string;
}

const STORAGE_KEY = 'crm_products';

export const productService = {
  getAll: (): Product[] => {
    const products = localStorage.getItem(STORAGE_KEY);
    return products ? JSON.parse(products) : [];
  },

  save: (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const products = productService.getAll();
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return newProduct;
  },

  update: (id: string, product: Partial<Product>): Product | null => {
    const products = productService.getAll();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...product };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  },

  delete: (id: string): boolean => {
    const products = productService.getAll();
    const filtered = products.filter(p => p.id !== id);
    
    if (filtered.length === products.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getById: (id: string): Product | null => {
    const products = productService.getAll();
    return products.find(p => p.id === id) || null;
  }
};
