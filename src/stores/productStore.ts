import { defineStore } from "pinia";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  status: string;
  stock: number;
  price: number;
  image: string;
}

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
  }),

  actions: {
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async addProduct(product: Omit<Product, "id">) {
      try {
        const docRef = await addDoc(collection(db, "products"), product);
        this.products.push({ id: docRef.id, ...product });
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },

    async updateProduct(updatedProduct: Product) {
      if (!updatedProduct.id) return;
    
      try {
        const productRef = doc(db, "products", updatedProduct.id);
        await updateDoc(productRef, { ...updatedProduct });
    
        const index = this.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = { ...updatedProduct }; // Ensure reactivity updates
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
  },
});