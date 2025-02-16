import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      { id: 1, name: "Baju Melayu", status: "Disabled", stock: 12, price: 130 },
      { id: 2, name: "Baju Kurung", status: "Available", stock: 7, price: 170 }
    ],
    showModal: false,
    productToDelete: null
  }),

  actions: {
    toggleStatus(id: number) {
      const product = this.products.find((p) => p.id === id);
      if (product) {
        product.status = product.status === "Available" ? "Disabled" : "Available";
      }
    },
    confirmDelete(id: null) {
      this.productToDelete = id;
      this.showModal = true;
    },
    deleteProduct() {
      this.products = this.products.filter((p) => p.id !== this.productToDelete);
      this.showModal = false;
      this.productToDelete = null;
    }
  }
});
