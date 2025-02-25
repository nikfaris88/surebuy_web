import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Orders from "@/pages/Orders.vue";
import Products from "@/pages/Products.vue";
import Customers from "@/pages/Users.vue";
import Login from "@/pages/Login.vue";
import ProductDetails from "@/pages/ProductDetails.vue";
import AddProduct from "@/pages/AddProduct.vue";
import EditProduct from "@/pages/EditProduct.vue";
import { auth, db } from "@/firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
      { path: "/products/:id", component: ProductDetails, props: true },
      { path: "/products/add", component: AddProduct, meta: { requiresAuth: true } },
      { path: "/products/edit/:id", component: EditProduct, props: true, meta: { requiresAuth: true } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🛠 FIX: Use onAuthStateChanged to wait for Firebase authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Wait for Firebase to initialize user
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening once we get the user

      if (!user) {
        console.warn("🔴 No user found, redirecting to login...");
        next("/login");
        return;
      }

      // Check if user is an admin
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists() && adminSnap.data().role === "admin") {
        console.log("✅ Admin verified, granting access.");
        next();
      } else {
        console.warn("⛔ Access denied: Not an admin.");
        alert("Access Denied: You are not an admin.");
        next("/login");
      }
    });
  } else {
    next();
  }
});

export default router;