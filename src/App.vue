<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();

// Simulated authentication state (Replace this with Vuex or Pinia for real auth)
const isAuthenticated = ref(false);

// Hide sidebar if on the login page
const showSidebar = computed(() => isAuthenticated.value && route.path !== '/login');
</script>

<template>
  <div class="app-container">
    <!-- Sidebar (Only shown when logged in) -->
    <aside v-if="showSidebar" class="sidebar">
      <h2 class="logo">Admin</h2>
      <nav>
        <RouterLink to="/" active-class="active">Dashboard</RouterLink>
        <RouterLink to="/orders" active-class="active">Orders</RouterLink>
        <RouterLink to="/products" active-class="active">Products</RouterLink>
        <RouterLink to="/customers" active-class="active">Customers</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" @loginSuccess="isAuthenticated = true" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
