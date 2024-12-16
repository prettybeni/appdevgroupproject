<template>
  <div class="manage-ingredients">
    <button @click="exitPage" class="exit-btn">&times;</button>
    <div class="container">
      <h1>Manage Ingredients</h1>

      <!-- Search Bar -->
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name or unit" 
        />
      </div>

      <!-- Ingredients Table -->
      <table class="ingredients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ingredient, index) in paginatedIngredients" :key="ingredient.id">
            <td>{{ ingredient.name }}</td>
            <td>{{ ingredient.quantity }}</td>
            <td>{{ ingredient.unit }}</td>
            <td>
              <div class="action-btns-container">
                <button @click="openEditModal(index)" class="action-btn edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="openAddStockModal(index)" class="action-btn add-btn">
                  <i class="fas fa-plus"></i>
                </button>
                <button @click="deleteIngredient(ingredient.id)" class="action-btn delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <center>
        <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"><</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">></button>
      </div>
      </center>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h2>Edit Ingredient Name</h2>
          <input type="text" v-model="modalName" placeholder="Enter new name" />
          <div class="modal-actions">
            <button @click="saveNameEdit">Save</button>
            <button @click="closeEditModal">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Add Stock Modal -->
      <div v-if="showAddStockModal" class="modal">
        <div class="modal-content">
          <h2>Add Stock for {{ selectedIngredient.name }}</h2>
          <input type="number" v-model="modalQuantity" min="1" placeholder="Enter quantity to add" />
          <div class="modal-actions">
            <button @click="addQuantity">Confirm</button>
            <button @click="closeAddStockModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      ingredients: [],
      isMenuOpen: false,
      activeDropdown: null,
      showEditModal: false,
      showAddStockModal: false,
      selectedIngredient: null,
      modalName: '',
      modalQuantity: 1,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 6, // Number of items per page
    };
  },
  computed: {
    filteredIngredients() {
      if (!this.searchQuery) {
        return this.ingredients;
      }
      const query = this.searchQuery.toLowerCase();
      return this.ingredients.filter(ingredient => 
        ingredient.name.toLowerCase().includes(query) || 
        ingredient.unit.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredIngredients.length / this.itemsPerPage);
    },
    paginatedIngredients() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredIngredients.slice(start, end);
    },
  },
  methods: {
    exitPage() {
      window.history.back(); // Go back to the previous page
    },

    deleteIngredient(id) {
      if (confirm("Are you sure you want to mark this ingredient as unavailable?")) {
        axios.put(`http://localhost:5000/api/admin/manage-ingredients/${id}`)
          .then(() => {
            alert("Ingredient marked as unavailable successfully!");
            this.fetchIngredients();
          })
          .catch((error) => {
            console.error("Error marking ingredient as unavailable:", error);
            alert("Failed to mark the ingredient as unavailable. Please try again.");
          });
      }
    },
    async fetchIngredients() {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/manageIngredients');
        this.ingredients = response.data;
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    },
    openEditModal(index) {
      this.selectedIngredient = this.ingredients[index];
      this.modalName = this.selectedIngredient.name;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedIngredient = null;
      this.modalName = '';
    },
    async saveNameEdit() {
      if (this.modalName.trim() === '') {
        alert('Name cannot be empty.');
        return;
      }
      try {
        await axios.put(`http://localhost:5000/api/admin/manageIngredients/${this.selectedIngredient.id}`, { name: this.modalName });
        this.selectedIngredient.name = this.modalName;
        alert('Ingredient name updated successfully!');
      } catch (error) {
        console.error('Error updating ingredient name:', error);
      } finally {
        this.closeEditModal();
      }
    },
    openAddStockModal(index) {
      this.selectedIngredient = this.ingredients[index];
      this.modalQuantity = 0;
      this.showAddStockModal = true;
    },
    closeAddStockModal() {
      this.showAddStockModal = false;
      this.selectedIngredient = null;
      this.modalQuantity = 0;
    },
    async addQuantity() {
      if (this.modalQuantity > 0) {
        try {
          await axios.put(`http://localhost:5000/api/admin/manageIngredients/${this.selectedIngredient.id}/add-quantity`, {
            quantity: this.modalQuantity,
          });
          this.selectedIngredient.quantity += this.modalQuantity;
          alert('Stock added successfully!');
        } catch (error) {
          console.error('Error adding stock:', error);
        } finally {
          this.closeAddStockModal();
        }
      } else {
        alert('Please enter a valid stock quantity.');
      }
    },
    changePage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) return;
      this.currentPage = pageNumber;
    },
  },
  mounted() {
    this.fetchIngredients();
  },
};
</script>


<style>
.manage-ingredients {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #efece1;
}

.container {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 900px;
  text-align: center;
  margin-top: -120px;
}

.exit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  width: fit-content;
  margin-right: 20px;
  margin-top: -10px;
}

.exit-btn:hover {
  color: rgb(0, 0, 0);
  background-color: transparent; /* Prevent green background */
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  margin: 5px;
  width: fit-content;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.ingredients-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 10px;
}

ingredients-table th,
.ingredients-table td {
  padding: 5px;
  text-align: left;
  border: 1px solid #ddd;

}

ingredients-table th {
  background-color: #f9f9f9;
}

.action-btns-container {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  color: #fff;
}

.edit-btn {
  background-color: #4caf50;
}

.add-btn {
  background-color: #2196f3;
}

.delete-btn {
  background-color: #f44336;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
}

.pagination button:disabled {
  cursor: not-allowed;
  background-color: #f1f1f1;
}

.pagination span {
  margin: 0 10px;
  line-height: 30px;
}
</style>
