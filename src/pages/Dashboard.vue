<template>
  <div class="dashboard-container">
    <!-- Sidebar -->


    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Header -->
      <div class="header">
        <span class="admin-icon">👤</span> Admin
      </div>

      <!-- Sales Analytics -->
      <h2>Sales Analytics</h2>
      <LineChart />

      <!-- Statistics Cards -->
      <div class="stats">
        <div class="stat-card">
          <p>Sales</p>
          <h3>174</h3>
          <span>📈</span>
        </div>
        <div class="stat-card">
          <p>Orders</p>
          <h3>235</h3>
          <span>📦</span>
        </div>
        <div class="stat-card">
          <p>Customers</p>
          <h3>42</h3>
          <span>👥</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/dashboard/products" },
  { label: "Orders", path: "/dashboard/orders" },
  { label: "Customers", path: "/dashboard/customers" },
];

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.dashboard-container {
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
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 150px;
}
</style>
