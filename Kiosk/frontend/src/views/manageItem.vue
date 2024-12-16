<template>
  <button @click="exitPage" class="exit-btn">&times;</button>
  <div class="manage-items">
    <br><h1>Manage Items</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name or size"
      />
    </div>

    <center>
      <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.size }}</td>
          <td>
            <button @click="openEditModal(index)">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="openAddStockModal(index)">
              <i class="fas fa-plus"></i>
            </button>
            <button @click="deleteItem(item.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    </center>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        &laquo;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        &raquo;
      </button>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" @click="closeEditModal">&times;</button>
        <h2>Edit Item Name</h2>
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
        <button class="close-btn" @click="closeAddStockModal">&times;</button>
        <h2>Add Stock for {{ selectedItem.name }}</h2>
        <input
          type="number"
          v-model="modalQuantity"
          min="1"
          placeholder="Enter quantity to add"
        />
        <div class="modal-actions">
          <button @click="addQuantity">Confirm</button>
          <button @click="closeAddStockModal">Cancel</button>
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
      items: [],
      currentPage: 1,
      itemsPerPage: 5,
      showEditModal: false,
      showAddStockModal: false,
      selectedItem: null,
      modalName: "",
      modalQuantity: 1,
      searchQuery: "",
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.size.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredItems.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    exitPage() {
      window.history.back(); // Go back to the previous page
    },
    changePage(page) {
      this.currentPage = page;
    },
    deleteItem(id) {
      if (confirm("Are you sure you want to delete this item?")) {
        axios.put(`http://localhost:5000/api/admin/manage-items/${id}`)
          .then(() => {
            alert("Item deleted successfully!");
            this.fetchItems();  // Refresh the list of items
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
            alert("Failed to delete the item. Please try again.");
          });
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDropdown(dropdown) {
      this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
    },
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/manageItems');
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    openEditModal(index) {
      this.selectedItem = this.items[index];
      this.modalName = this.selectedItem.name;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedItem = null;
      this.modalName = '';
    },
    async saveNameEdit() {
      if (this.modalName.trim() === '') {
        alert('Name cannot be empty.');
        return;
      }
      try {
        await axios.put(`http://localhost:5000/api/admin/manageItems/${this.selectedItem.id}`, { name: this.modalName });
        this.selectedItem.name = this.modalName;
        alert('Item name updated successfully!');
      } catch (error) {
        console.error('Error updating item name:', error);
      } finally {
        this.closeEditModal();
      }
    },
    openAddStockModal(index) {
      this.selectedItem = this.items[index];
      this.modalQuantity = 0;
      this.showAddStockModal = true;
    },
    closeAddStockModal() {
      this.showAddStockModal = false;
      this.selectedItem = null;
      this.modalQuantity = 0;
    },
    async addQuantity() {
      if (this.modalQuantity > 0) {
        try {
          await axios.put(`http://localhost:5000/api/admin/manageItems/${this.selectedItem.id}/add-quantity`, {
            quantity: this.modalQuantity,
          });
          this.selectedItem.quantity += this.modalQuantity;
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
    handleClickOutside(event) {
      const dropdowns = document.querySelectorAll('.nav-dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
          this.activeDropdown = '';
        }
      });
    },
  },

  mounted() {
    this.fetchItems();
    this.activeDropdown = this.$route.path.includes('item') ? 'items' : ''; 
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>
  
  <style scoped>
/* General Styles */
.manage-items {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  width: 1000px;
  justify-content: center;
}

th, td {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #ddd;
  word-wrap: break-word; /* Allow long text to wrap within the cell */
  max-width: 200px; /* Set a maximum width for table cells */
}

th {
  background-color: #f4f4f4;
  font-size: 16px;
  font-weight: bold;
}

td {
  font-size: 14px;
}

table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f4f4f4;
}

@media screen and (max-width: 768px) {
  th, td {
    font-size: 12px; /* Adjust font size for smaller screens */
    padding: 6px; /* Reduce padding for better fit */
  }
}


/* Button Styles */
button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  width: fit-content;
  margin-left: 40px;
}

button:hover {
  background-color: #45a049;
}

.search-bar {
  padding: 10px;
  margin-left: 240px;
  width: max-content;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-actions button {
  width: 45%;
}

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 3px;
  width: fit-content;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #45a049;
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
  color: rgb(0, 0, 0); /* Retain the text color change */
  background: none; /* Remove the background on hover */
}
</style>