import api from './api';

export interface Product {
    id: number;
    name: string;
    category: string;
    category_link: string | null;
    description: string | null;
    price: number;
    original_price: number | null;
    rating: number;
    review_count: number;
    image: string | null;
    badge: string | null;
    deal_ends: string | null;
    created_by: number;
    created_at: string;
    updated_at: string | null;
}

export interface ProductCreate {
    name: string;
    category: string;
    category_link?: string;
    description?: string;
    price: number;
    original_price?: number;
    image?: string;
    badge?: string;
    deal_ends?: string;
}

export const productService = {
    // Get all products (for marketplace)
    getAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/api/products');
        return response.data;
    },

    // Get current user's products
    getMy: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/api/products/my');
        return response.data;
    },

    // Create a new product
    create: async (product: ProductCreate): Promise<Product> => {
        const response = await api.post<Product>('/api/products', product);
        return response.data;
    },

    // Delete a product
    delete: async (productId: number): Promise<void> => {
        await api.delete(`/api/products/${productId}`);
    },

    // Update a product
    update: async (productId: number, product: ProductCreate): Promise<Product> => {
        const response = await api.put<Product>(`/api/products/${productId}`, product);
        return response.data;
    },
};

export default productService;
