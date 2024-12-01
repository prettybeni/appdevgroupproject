// models/productModel.js
const db = require('../config/db'); // Database connection

// Get all products
const productModel = {
  getAll : () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM products';
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  getProductById : async (productId) => {
    try {
      const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
      return rows.length ? rows[0] : null; // Return the product if found, else return null
    } catch (error) {
      console.error('Error fetching product from DB:', error);
      throw error; // Throw the error to be handled in the controller
    }
  },

  findProductByName: async (name) => {
    try {
      const query = 'SELECT * FROM products WHERE name = ?';
      const [rows] = await db.execute(query, [name]);  // Ensure to use `await` for the query execution
      
      // Check if rows were returned and return the first row, else return null
      if (rows.length > 0) {
        return rows[0];  // Return the first product if found
      } else {
        return null;  // No product found, return null
      }
    } catch (error) {
      console.error('Error in findProductByName:', error);
      throw error;  // Re-throw the error for handling in the controller
    }
  },
  

// Delete product by ID
deleteById : (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
},

addProduct: async (productData) => {
  const { name, price, category, image_url } = productData;

  const query = `
    INSERT INTO products (name, price, category, image_url)
    VALUES (?, ?, ?, ?)
  `;

  console.log('Preparing to insert product with data:', productData);
  console.log('Executing query:', query, [name, price, category, image_url]);

  try {
    // Execute the query
    const [result] = await db.execute(query, [name, price, category, image_url]);

    console.log('Insert results:', result); // Log the result to inspect structure

    if (result.affectedRows > 0) {
      console.log('Product inserted with ID:', result.insertId);
      return result; // Return the result
    } else {
      console.log('Insertion did not affect any rows.');
      throw new Error('No rows affected during insertion.');
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Re-throw the error for the calling code to handle
  }
},

getUserByToken: (token) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id FROM users WHERE token = ? LIMIT 1';
    db.query(query, [token], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]); // Return the user object
    });
  });
},

getCartDataByToken: async (token) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        carts.id AS cart_id,
        cart_items.product_id,
        cart_items.quantity,
        products.name AS product_name,
        products.price AS product_price,
        products.image_url
      FROM carts
      JOIN users ON users.id = carts.user_id
      LEFT JOIN cart_items ON carts.id = cart_items.cart_id
      LEFT JOIN products ON cart_items.product_id = products.id
      WHERE users.cookie = ?
    `;
    db.query(query, [token], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) return resolve(null);

      // Organize data: cart_id and items
      const cartData = {
        cart_id: results[0].cart_id,
        items: results.map((row) => ({
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          quantity: row.quantity,
          image_url: row.image_url,
        })),
      };

      resolve(cartData);
    });
  });
},

getCartItems: (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ci.id, ci.product_id, ci.quantity, ci.sugar_level, ci.size, ci.note, p.name, p.price 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?`;
    db.query(query, [cartId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
},




createIngredient : async (name, quantity, unit) => {
  try {
    const query = 'INSERT INTO ingredients (name, quantity, unit) VALUES (?, ?, ?)';
    const result = await db.execute(query, [name, quantity, unit]);
    return { id: result.insertId, name, quantity, unit };
  } catch (error) {
    throw new Error('Database error');
  }
},

getAllIngredients: async () => {
  const query = 'SELECT * FROM ingredients';
  const [rows] = await db.execute(query);
  return rows;
},

// Update ingredient name
updateIngredientName: async (id, name) => {
  const query = 'UPDATE ingredients SET name = ? WHERE id = ?';
  const [result] = await db.execute(query, [name, id]);
  return result;
},

// Add stock quantity
addIngredientQuantity: async (id, quantity) => {
  const query = 'UPDATE ingredients SET quantity = quantity + ? WHERE id = ?';
  const [result] = await db.execute(query, [quantity, id]);
  return result;
},

getAllProducts :async (callback) => {
  try {
    // Use await instead of providing a callback
    const [rows, fields] = await db.query('SELECT * FROM products');
    return rows; // Return the result
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if needed
  }
},

// Function to add a product to the cart
addToCart : (userId, productId, quantity, sugar_level, size, note) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO cart_items (cart_id, product_id, quantity, sugar_level, size, note) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [cart_id, productId, quantity, sugar_level, size, note], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

// Function to update quantity of an item in the cart
updateCartItem : (userId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE cart_items SET quantity = ?, sugar_level = ?, size = ? WHERE user_id = ? AND product_id = ?`;    
    db.query(query, [quantity, userId, productId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},
};

module.exports = productModel;
