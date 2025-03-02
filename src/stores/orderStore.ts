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
  date: string;
}

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [] as Order[],
    salesSummary: [] as any[],
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

    async fetchSalesSummary() {
      const querySnapshot = await getDocs(collection(db, "orders"));

      const orders: any[] = await Promise.all(
        querySnapshot.docs.map(async (orderDoc) => orderDoc.data())
      )

      const sales: any = {};
      const now = new Date();
      const sixMonthsAgo = new Date();
      
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const year = date.getFullYear();
          const month = date.toLocaleDateString('US', { month: 'short'});
          sales[`${month} ${year}`] = { "Pending": 0, "Completed": 0 };
      }

      this.salesSummary = orders
        .filter(order => new Date(order.date) >= sixMonthsAgo)
        .reduce((acc: any, order: Order) => {
            const date = new Date(order.date);
            const month = date.toLocaleDateString('US', { month: 'short'});
            const year = date.getFullYear();
            
            if (acc[`${month} ${year}`]) {
              acc[`${month} ${year}`][order.status] += 1;
            }
            
            return acc;
        }, sales);
    }
  }
});