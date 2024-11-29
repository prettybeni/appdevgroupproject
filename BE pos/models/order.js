const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./product');

const Order = sequelize.define('Order', {
  order_number: { type: DataTypes.STRING, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: true });

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: true });

Order.hasMany(OrderItem, { foreignKey: 'OrderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

Product.hasMany(OrderItem, { foreignKey: 'ProductId' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId' });

module.exports = { Order, OrderItem };
