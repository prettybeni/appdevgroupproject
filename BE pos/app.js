const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sequelize = require('./models/db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Sync Database and Start Server
sequelize.sync().then(() => {
  console.log('Database synced.');
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
}).catch((error) => console.error('Database sync error:', error));
