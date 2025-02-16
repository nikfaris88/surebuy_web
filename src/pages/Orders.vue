<template>
  <div class="orders-container">
    <h2>Order</h2>

    <!-- Order Table -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Date</th>
          <th>Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.name }}</td>
          <td>{{ order.address }}</td>
          <td>{{ order.date }}</td>
          <td>{{ order.price }}</td>
          <td :class="getStatusClass(order.status)">{{ order.status }}</td>
          <td>
            <select v-model="order.status" @change="updateStatus(order)">
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Sample Order Data
const orders = ref([
  {
    id: 12,
    name: "Abu",
    address: "3, Jalan Tiga",
    date: "3 JAN 2024",
    price: "RM100",
    status: "pending",
  },
]);

// Function to update order status (backend API can be integrated here)
const updateStatus = (order: any) => {
  console.log(`Order ${order.id} status updated to: ${order.status}`);
};

// Function to set color for status
const getStatusClass = (status: string) => {
  return status === "pending" ? "status-pending" : "status-complete";
};
</script>

<style scoped>
.orders-container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background: #f4f4f4;
}

.status-pending {
  color: red;
  font-weight: bold;
}

.status-complete {
  color: green;
  font-weight: bold;
}

select {
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
