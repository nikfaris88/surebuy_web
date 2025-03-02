<template>
  <div class="product-container">
    <h1>Product List</h1>
    <div class="header">
      <input type="text" v-model="searchQuery" placeholder="Search Product" class="search-bar" />
      <button @click="addProduct" class="add-product-btn">+ Add Product</button>
    </div>

    <div class="filter-category">
      <label style="margin-right: 10px;">Filter Category:</label>
      <select v-model="selectedCategory">
        <option value="">All</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>
    </div>

    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Price (RM)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <input type="checkbox" v-model="selectedProducts" :value="product.id" />
            </td>
            <td><img :src="product.image" alt="Product Image" class="product-thumbnail" /></td>
            <td>{{ product.name }}</td>
            <td>
              <span @click="toggleStatus(product)"
                :class="{ available: product.status === 'Available', disabled: product.status === 'Disabled' }">
                {{ product.status }}
              </span>
            </td>
            <td>{{ product.stock }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProduct(product.id)" class="edit-btn">Edit</button>
              <button @click="previewProduct(product.id)" class="preview-btn">Preview</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    

    <button v-if="selectedProducts.length" @click="confirmDelete" class="delete-selected-btn">Delete Selected</button>

    <ConfirmationModal v-if="showModal" @confirm="deleteSelectedProducts" @close="showModal = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  components: { ConfirmationModal },
  setup() {
    const productStore = useProductStore();
    const router = useRouter();
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedProducts = ref([]);
    const showModal = ref(false);
    const db = getFirestore();

    onMounted(() => {
      productStore.fetchProducts();
    });

    const addProduct = () => {
      router.push("/products/add");
    };

    const editProduct = (productId) => {
      router.push(`/products/edit/${productId}`);
    };

    const previewProduct = (productId) => {
      router.push(`/products/${productId}`);
    };

    const filteredProducts = computed(() => {
      return productStore.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
          (selectedCategory.value === "" || product.category === selectedCategory.value)
        );
      });
    });

    const toggleStatus = async (product) => {
      const newStatus = product.status === "Available" ? "Disabled" : "Available";
      const productRef = doc(db, "products", product.id);

      try {
        await updateDoc(productRef, { status: newStatus });
        product.status = newStatus; // Update locally
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    const confirmDelete = () => {
      showModal.value = true;
    };

    const deleteSelectedProducts = async () => {
      try {
        for (const productId of selectedProducts.value) {
          const productRef = doc(db, "products", productId);
          await deleteDoc(productRef);
        }
        productStore.fetchProducts(); // Refresh the product list
        selectedProducts.value = [];
        showModal.value = false;
      } catch (error) {
        console.error("Error deleting products:", error);
      }
    };

    return {
      searchQuery,
      selectedCategory,
      selectedProducts,
      showModal,
      addProduct,
      editProduct,
      previewProduct,
      filteredProducts,
      toggleStatus,
      confirmDelete,
      deleteSelectedProducts,
    };
  },
};
</script>

<style scoped>
.product-container {
  padding: 20px;
}

.product-table-container {
  background-color: #fff;
  box-shadow: 1px 1px 7px 0px #bababc;
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

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.product-table tbody tr:nth-child(even) {
  background-color: #fff;
}

.product-table th, .product-table td {
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

.available {
  color: green;
  cursor: pointer;
}

.disabled {
  color: red;
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

.preview-btn {
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