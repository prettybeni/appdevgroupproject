<template>
  <div class="menu-items-container">
    <!-- Category Buttons -->
    <div class="categories">
      <button @click="fetchAll" :class="{ active: selectedCategory === 'All' }">All Menu</button>
      <button @click="filterCategory('Beverages')" :class="{ active: selectedCategory === 'Beverages' }">Beverages</button>
      <button @click="filterCategory('Desserts')" :class="{ active: selectedCategory === 'Desserts' }">Desserts</button>
      <button @click="filterCategory('Add Ons')" :class="{ active: selectedCategory === 'Add Ons' }">Add Ons</button>
    </div>

    <!-- Product Cards -->
    <div class="items">
      <div v-for="item in products" :key="item.id" class="item-card">
        <img :src="item.image_url" :alt="item.name" />
        <p class="item-name">{{ item.name }}</p>
        <p class="item-price">{{ item.price }} Php</p>
        <button @click="addItem(item)">Add Item</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      products: [],
      selectedCategory: 'All',
    };
  },
  methods: {
    fetchAll() {
      this.selectedCategory = 'All';
    },
    filterCategory(category) {
      this.selectedCategory = category;
    },
  },
};
</script>

<style>
.categories {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.categories button {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.categories button.active {
  background-color: #007bff;
  color: white;
}

.items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.item-card {
  background: #ffffff;
  border-radius: 8px;
  text-align: center;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
</style>
