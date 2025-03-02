import { db } from "@/firebase/firebaseConfig";
import { Customer } from "@/stores/customerStore";
import { Product } from "@/stores/productStore";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { defineStore } from "pinia";

export interface Order {
  id: string;
  product: Product;
  customer: Customer;
  quantity: number;
  totalPrice: number;
  status: string;
}

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [] as Order[],
  }),

  actions: {
    async fetchOrders() {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));

        this.orders = await Promise.all(
          querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();
      
            // Extract customerRef and productRef
            const customerRef = orderData.customerRef;
            const productRef = orderData.productRef;

            let customerData = null;
            let productData = null;
      
            if (customerRef) {
              const customerSnap = await getDoc(customerRef);
              if (customerSnap.exists()) {
                customerData = customerSnap.data();
              }
            }
      
            if (productRef) {
              const productSnap = await getDoc(productRef);
              if (productSnap.exists()) {
                productData = productSnap.data();
              }
            }
      
            return { id: orderDoc.id, ...orderData, customer: customerData, product: productData };
          })
        ) as Order[];
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
  }
});