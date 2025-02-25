<template>
  <div class="container">
    <button @click="$router.push('/products')" class="back-button">
      ⬅ Back to Product List
    </button>

    <h1>Product Details</h1>

    <div v-if="product">
      <div class="product-info">
        <img :src="product.image" alt="Product Image" class="product-image" />
        <div class="details">
          <h2>{{ product.name }}</h2>
          <p><strong>Category:</strong> {{ product.category }}</p>
          <p><strong>Description:</strong> {{ product.description }}</p>
          <p><strong>Price:</strong> RM {{ product.price }}</p>
          <p><strong>Stock:</strong> {{ product.stock }}</p>
        </div>
      </div>

      <div class="actions">
        <button @click="editProduct" class="edit-button">Edit</button>
        <button @click="confirmDelete" class="delete-button">Delete</button>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <p>Are you sure you want to delete this product?</p>
          <button @click="deleteProduct" class="confirm-button">Yes</button>
          <button @click="showModal = false" class="cancel-button">No</button>
        </div>
      </div>
    </div>

    <p v-else>Loading product details...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default {
  setup() {
    const product = ref(null);
    const route = useRoute();
    const router = useRouter();
    const showModal = ref(false);

    // Fetch product details from Firestore
    const fetchProductDetails = async () => {
      try {
        const productId = route.params.id;
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          product.value = { id: docSnap.id, ...docSnap.data() };
        } else {
          console.error("Product not found.");
          router.push("/products"); // Redirect if product doesn't exist
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const editProduct = () => {
      router.push(`/products/edit/${route.params.id}`);
    };

    const confirmDelete = () => {
      showModal.value = true;
    };

    // Delete product from Firestore
    const deleteProduct = async () => {
      try {
        const productId = route.params.id;
        await deleteDoc(doc(db, "products", productId));
        alert("Product deleted successfully.");
        router.push("/products");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    onMounted(fetchProductDetails);

    return {
      product,
      editProduct,
      confirmDelete,
      deleteProduct,
      showModal,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.back-button {
  background-color: #ccc;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.product-info {
  display: flex;
  gap: 20px;
}

.product-image {
  width: 150px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.details {
  flex: 1;
}

.actions {
  margin-top: 20px;
}

.edit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
}

.delete-button {
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
}

.confirm-button {
  background-color: #d9534f;
  color: white;
  padding: 10px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
}

.cancel-button {
  background-color: #5bc0de;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>