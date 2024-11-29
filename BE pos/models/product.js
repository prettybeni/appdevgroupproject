const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM('Beverages', 'Desserts', 'Add Ons'), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: true,
  tableName: 'Products',
});

module.exports = Product;
