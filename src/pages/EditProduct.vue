<template>
    <div class="edit-product-container">
        <div class="header">
            <button @click="goBack" class="back-btn">⬅ Back to Product Page</button>
            <h2>Edit Product</h2>
        </div>

        <div class="form-container">
            <!-- Product Name -->
            <div class="form-group">
                <label>Product Name</label>
                <input type="text" v-model="product.name" placeholder="Enter product name" required />
            </div>

            <!-- Product Detail -->
            <div class="form-group">
                <label>Product Detail</label>
                <textarea v-model="product.description" placeholder="Enter product details" required></textarea>
            </div>

            <!-- Category Dropdown -->
            <div class="form-group">
                <label>Category</label>
                <select v-model="product.category" required>
                    <option value="" disabled>Select category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>
            </div>

            <!-- Drag and Drop Image Upload -->
            <div class="image-upload" @dragover.prevent @drop="handleDrop">
                <label>Drag & Drop Product Image or Click to Upload</label>
                <input type="file" ref="fileInput" @change="uploadImage" hidden />
                <div class="image-preview" @click="selectFile">
                    <img v-if="product.image" :src="product.image" class="preview-img" />
                    <p v-else class="drop-text">Drop Image Here</p>
                </div>
            </div>

            <!-- Price & Stock -->
            <div class="form-group inline-group">
                <div>
                    <label>Price (RM)</label>
                    <input type="number" v-model="product.price" placeholder="0.00" required />
                </div>
                <div>
                    <label>Stock</label>
                    <input type="number" v-model="product.stock" placeholder="0" required />
                </div>
            </div>

            <!-- Buttons -->
            <div class="button-group">
                <button @click="updateProduct" class="save-btn">Save Changes</button>
            </div>

            <!-- Error Message -->
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
    setup() {
        const productStore = useProductStore();
        const router = useRouter();
        const route = useRoute();
        const db = getFirestore();
        const storage = getStorage();
        const errorMessage = ref("");
        const fileInput = ref(null);
        const product = ref({
            id: "",
            name: "",
            category: "",
            description: "",
            price: 0,
            stock: 0,
            image: "",
        });

        onMounted(async () => {
            const productId = route.params.id;
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                product.value = { id: productId, ...docSnap.data() };
            } else {
                errorMessage.value = "Product not found.";
            }
        });

        const selectFile = () => {
            fileInput.value.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
                uploadImage({ target: { files: [file] } });
            }
        };

        const uploadImage = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const imageRef = storageRef(storage, `products/${file.name}`);

            try {
                const snapshot = await uploadBytes(imageRef, file);
                product.value.image = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error("Error uploading image:", error);
                errorMessage.value = "Failed to upload image.";
            }
        };

        const updateProduct = async () => {
            if (!product.value.name || !product.value.category || !product.value.price) {
                errorMessage.value = "All fields are required.";
                return;
            }

            try {
                const productRef = doc(db, "products", product.value.id);
                await updateDoc(productRef, { ...product.value });

                productStore.fetchProducts(); // Refresh product list
                router.push("/products");
            } catch (error) {
                errorMessage.value = "Failed to update product.";
                console.error(error);
            }
        };

        const goBack = () => {
            router.push("/products");
        };

        return {
            product,
            updateProduct,
            uploadImage,
            selectFile,
            handleDrop,
            goBack,
            errorMessage,
            fileInput,
        };
    },
};
</script>

<style scoped>
.edit-product-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #007bff;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.image-upload {
    text-align: center;
    border: 2px dashed #007bff;
    padding: 20px;
    cursor: pointer;
    position: relative;
}

.image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.preview-img {
    margin-top: 10px;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.save-btn {
    background: #28a745;
    color: white;
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

.error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}
</style>