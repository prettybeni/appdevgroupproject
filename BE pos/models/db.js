const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('pos_system', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;
