<template>
  <div class="product-container">
    <h1>Customer List</h1>
    <div class="header">
      <input type="text" v-model="searchQuery" placeholder="Search Customer" class="search-bar" />
    </div>

    <div class="filter-status">
      <label style="margin-right: 10px;">Filter Status:</label>
      <select v-model="selectedStatus">
        <option value="">All</option>
        <option value="Verified">Verified</option>
        <option value="Unverified">Unverified</option>
      </select>
    </div>

    <div class="customer-table-container">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.address }}</td>
            <td>
              <span @click="toggleStatus(customer)"
                :class="{ verified: customer.status === 'Verified', unverified: customer.status === 'Unverified' }">
                {{ customer.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "@/stores/customerStore";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const customerStore = useCustomerStore();
    const router = useRouter();
    const searchQuery = ref("");
    const selectedStatus = ref("");
    const selectedProducts = ref([]);
    const db = getFirestore();

    onMounted(() => {
      customerStore.fetchCustomers();
    });

    const filteredCustomers = computed(() => {
      return customerStore.customers.filter((customer) => {
        return (
          customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
          (selectedStatus.value === "" || customer.status === selectedStatus.value)
        );
      });
    });

    const toggleStatus = async (customer) => {
      const newStatus = customer.status === "Verified" ? "Unverified" : "Verified";
      const customerRef = doc(db, "customers", customer.id);

      try {
        await updateDoc(customerRef, { status: newStatus });
        customer.status = newStatus; // Update locally
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    return {
      searchQuery,
      selectedStatus,
      selectedProducts,
      filteredCustomers,
      toggleStatus,
    };
  },
};
</script>

<style scoped>
.product-container {
  padding: 20px;
}

.customer-table-container {
  background-color: #fff;
  box-shadow: 1px 1px 7px 0px #bababc;
  border-radius: 5px;
  padding: 20px;
  margin-top: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search-bar {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
}

.add-product-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.filter-status {
  margin-bottom: 10px;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.customer-table tbody tr:nth-child(even) {
  background-color: #fff;
}

.customer-table th, .customer-table td {
  border-bottom: 1px solid #ddd;
  text-align: center;
  padding: 5px 8px;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.verified {
  color: green;
  cursor: pointer;
}

.unverified {
  color: red;
  cursor: pointer;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.preview-btn {
  background-color: #007bff;
  color: white;
  padding: 8px;
  margin-left: 5px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.delete-selected-btn {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
</style>