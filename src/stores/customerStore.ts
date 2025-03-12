import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { defineStore } from "pinia";

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as Customer[],
  }),

  actions: {
    async fetchCustomers() {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        this.customers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Customer[];
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },
  }
});