<template>
  <div class="container">
    <h1>Customer List</h1>

    <!-- Search Bar -->
    <input type="text" v-model="searchQuery" placeholder="Search customers..." />

    <button @click="addCustomer">Add Customer</button>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in filteredCustomers" :key="customer.id">
          <td>{{ customer.name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone }}</td>
          <td>
            <button @click="editCustomer(customer.id)">Edit</button>
            <button @click="confirmDelete(customer.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showModal"
      @confirm="deleteCustomer"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const customers = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const customerToDelete = ref(null);

const fetchCustomers = async () => {
  try {
    const response = await axios.get("https://api.example.com/customers");
    customers.value = response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};

const filteredCustomers = computed(() => {
  return customers.value.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const addCustomer = () => {
  // Navigate to Add Customer Page
  console.log("Redirect to Add Customer Page");
};

const editCustomer = (id) => {
  console.log("Edit customer:", id);
  // Navigate to edit page
};

const confirmDelete = (id) => {
  customerToDelete.value = id;
  showModal.value = true;
};

const deleteCustomer = async () => {
  try {
    await axios.delete(`https://api.example.com/customers/${customerToDelete.value}`);
    customers.value = customers.value.filter(customer => customer.id !== customerToDelete.value);
    showModal.value = false;
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

onMounted(fetchCustomers);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
