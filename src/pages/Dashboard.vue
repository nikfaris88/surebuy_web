<template>
  <div class="dashboard-container">
    <!-- Sidebar -->

    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Sales Analytics -->
      <h1>Sales Analytics</h1>
      <LineChart :labels="salesLabels" 
        :datasets="[
          { label: 'Completed', data: completedSalesData, borderColor: 'green' },
          { label: 'Pending', data: pendingSalesData, borderColor: 'orange' },
        ]"
      />

      <!-- Statistics Cards -->
      <div class="stats">
        <div class="stat-card">
          <h2>📈 Orders</h2>
          <div class="summary-card"><h3>Pending: </h3> <h3 class="summary-value">{{ orders.pendingOrder }}</h3></div>
          <div class="summary-card"><h3>Completed: </h3> <h3 class="summary-value">{{ orders.completedOrder }}</h3></div>
        </div>
        <div class="stat-card">
          <h2>📦 Products</h2>
          <div class="summary-card"><h3>Available: </h3> <h3 class="summary-value">{{ products.available }}</h3></div>
          <div class="summary-card"><h3>Disabled: </h3> <h3 class="summary-value">{{ products.disabled }}</h3></div>
        </div>
        <div class="stat-card">
          <h2>👥 Customers</h2>
          <div class="summary-card"><h3>Verified: </h3> <h3 class="summary-value">{{ customers.verified }}</h3></div>
          <div class="summary-card"><h3>Unverified: </h3> <h3 class="summary-value">{{ customers.unverified }}</h3></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { useOrderStore } from "@/stores/orderStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useProductStore } from "@/stores/productStore";
import LineChart from "@/components/LineChart.vue";

    const orderStore = useOrderStore();
    const customerStore = useCustomerStore();
    const productStore = useProductStore();

    onMounted(() => {
      orderStore.fetchOrders();
      orderStore.fetchSalesSummary();
      customerStore.fetchCustomers();
      productStore.fetchProducts();
    });

    const orders = computed(() => {
      let pendingOrder = 0, completedOrder = 0;

      for (const order of orderStore.orders) {
        if (order.status === 'Pending') pendingOrder += 1
        if (order.status === 'Completed') completedOrder += 1
      }

      return { pendingOrder, completedOrder }
    })

    const customers = computed(() => {
      let unverified = 0, verified = 0;

      for (const customer of customerStore.customers) {
        if (customer.status === 'Unverified') unverified += 1
        if (customer.status === 'Verified') verified += 1
      }

      return { unverified, verified }
    })

    const products = computed(() => {
      let available = 0, disabled = 0;

      for (const product of productStore.products) {
        if (product.status === 'Available') available += 1
        if (product.status === 'Disabled') disabled += 1
      }

      return { available, disabled }
    })

    const salesSummary = computed(() => orderStore.salesSummary || {});
    const salesLabels = computed(() => Object.keys(salesSummary.value)); 
    const pendingSalesData = computed(() => Object.values(salesSummary.value).map(x => x["Pending"]));
    const completedSalesData = computed(() => Object.values(salesSummary.value).map(x => x["Completed"]));

    console.log(completedSalesData.value)
</script>

<style scoped>
.dashboard-container {
  background-color: #f3f3f4;
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #f8f9fa;
  padding: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
}

.sidebar .active {
  font-weight: bold;
  background: yellow;
}

.dashboard-content {
  flex-grow: 1;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}

.stats {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h3 {
  margin: 5px;
}

.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-value {
  background-color: #f3f3f4;
  border-radius: 5px;
  padding: 10px;
  width: 100px;
}
</style>
