import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Orders from "@/pages/Orders.vue";
import Products from "@/pages/Products.vue";
import Customers from "@/pages/Users.vue";
import Login from "@/pages/Login.vue";
import ProductDetails from "@/pages/ProductDetails.vue";

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Layout,
    children: [
      { path: "dashboard", component: Dashboard, meta: { requiresAuth: true } },
      { path: "orders", component: Orders, meta: { requiresAuth: true } },
      { path: "products", component: Products, meta: { requiresAuth: true } },
      { path: "customers", component: Customers, meta: { requiresAuth: true } },
      { path: '/products/:id', component: ProductDetails, props: true }, // Product Details Page

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard: Redirect to login if not authenticated
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router;
