import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: number;
    name: string;
    category: string;
    categoryLink: string;
    description: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewCount: number;
    image: string;
    badge: string | null;
    dealEnds?: string;
    createdBy?: string;
}

interface ProductState {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
    removeProduct: (id: number) => void;
    updateProduct: (id: number, product: Partial<Product>) => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],
            addProduct: (product) => {
                const newProduct: Product = {
                    ...product,
                    id: Date.now(),
                    rating: 5,
                    reviewCount: 0,
                };
                set({ products: [...get().products, newProduct] });
            },
            removeProduct: (id) => {
                set({ products: get().products.filter(p => p.id !== id) });
            },
            updateProduct: (id, updates) => {
                set({
                    products: get().products.map(p =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                });
            },
        }),
        {
            name: 'product-storage',
        }
    )
);
