<template>
  <div class="container">
    <div class="content">
      <h1>Product List</h1>
      <button @click="addProduct">Add Product</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>
              <span
                :class="{ available: product.status === 'Available', disabled: product.status === 'Disabled' }"
                @click="productStore.toggleStatus(product.id)"
              >
                {{ product.status }}
              </span>
            </td>
            <td>{{ product.stock }}</td>
            <td>RM {{ product.price }}</td>
            <td>
              <button @click="productStore.confirmDelete(product.id)">Delete</button>
              <router-link :to="`/products/${product.id}`">
                <button class="view-button">View</button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="productStore.showModal"
      @confirm="productStore.deleteProduct"
      @close="productStore.showModal = false"
    />
  </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const productStore = useProductStore();
    const router = useRouter();

    const addProduct = () => {
      router.push('/products/add');
    };

    return {
      productStore,
      addProduct,
    };
  },
};
</script>

<style scoped>
.view-button {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  margin-left: 5px;
  border: none;
  cursor: pointer;
}
</style>
