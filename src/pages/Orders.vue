<template>
  <div class="product-container">
    <h1>Order List</h1>
    <div class="header">
      <input type="text" v-model="searchQuery" placeholder="Search Order" class="search-bar" />
    </div>

    <div class="filter-category">
      <label style="margin-right: 10px;">Filter Status:</label>
      <select v-model="selectedStatus">
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
    </div>

    <div class="order-table-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Purchase Date</th>
            <th>Quantity</th>
            <th>Price (RM)</th>
            <th>Total Price (RM)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.product.name }}</td>
            <td>{{ order.customer.name }}</td>
            <td>{{ order.formattedDate }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.product.price }}</td>
            <td>{{ order.totalPrice }}</td>
            <td>
              <span :class="{ pending: order.status === 'Pending', completed: order.status === 'Completed' }">
                {{ order.status }}
              </span>
            </td>
            <td>
              <button v-if="order.status === 'Pending'" @click="completeOrder(order)" class="complete-btn">Complete Order</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useOrderStore } from "@/stores/orderStore";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { computed, onMounted, ref } from "vue";

export default {
  setup() {
    const orderStore = useOrderStore();
    const searchQuery = ref("");
    const selectedStatus = ref("");
    const db = getFirestore();

    onMounted(() => {
      orderStore.fetchOrders();
    });

    const filteredOrders = computed(() => {
      return orderStore.orders.filter((order) => {
        return (
         (order.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
          (selectedStatus.value === "" || order.status === selectedStatus.value)
        );
      });
    });

    const completeOrder = async (order) => {
      const orderRef = doc(db, "orders", order.id);

      try {
        await updateDoc(orderRef, { status: "Completed" });
        order.status = "Completed"; // Update locally
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    return {
      completeOrder,
      filteredOrders,
      searchQuery,
      selectedStatus,
    };
  },
};
</script>

<style scoped>
.product-container {
  padding: 20px;
}

.order-table-container {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.filter-category {
  margin-bottom: 10px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.order-table tbody tr:nth-child(even) {
  background-color: #fff;
}

.order-table th, .order-table td {
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

.completed {
  color: green;
}

.pending {
  color: orange;
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

.complete-btn {
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