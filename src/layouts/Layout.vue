<template>
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <ul>
          <li :class="{ active: isActive('dashboard') }" @click="navigate('dashboard')"><i class="pi pi-home"></i> Dashboard</li>
          <li :class="{ active: isActive('orders') }" @click="navigate('orders')"><i class="pi pi-box"></i> Orders</li>
          <li :class="{ active: isActive('products') }" @click="navigate('products')"><i class="pi pi-objects-column"></i> Products</li>
          <li :class="{ active: isActive('customers') }" @click="navigate('customers')"><i class="pi pi-users"></i> Customers</li>
        </ul>
  
        <!-- Logout Button -->
        <button class="logout-button" @click="logout">Logout</button>
      </aside>
  
      <!-- Main Content -->
      <main class="dashboard-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter, useRoute } from "vue-router";
  
  const router = useRouter();
  const route = useRoute();
  
  const navigate = (page: string) => {
    router.push(`/${page}`);
  };
  
  const isActive = (page: string) => {
    return route.path.includes(page);
  };
  
  const logout = () => {
    // Clear user session (example: remove token from localStorage)
    localStorage.removeItem("authToken");
  
    // Redirect to login page
    router.push("/login");
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    background-color: #f3f3f4;
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    color: #a7b1c2;
    background: #2f4050;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Push logout button to bottom */
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar li {
    padding: 10px 30px;
    cursor: pointer;
  }
  
  .sidebar .active {
    font-weight: bold;
    background: #293846;
  }
  
  .logout-button {
    margin-top: auto; /* Push to bottom */
    background: #f8ac59;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    text-align: center;
  }
  
  .logout-button:hover {
    background: darkred;
  }
  
  .dashboard-content {
    flex-grow: 1;
    padding: 20px;
  }

  i.pi {
    margin-right: 10px;
  }
  </style>
  