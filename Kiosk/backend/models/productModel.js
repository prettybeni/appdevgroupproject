// models/productModel.js
const db = require('../config/db'); // Database connection
const path = require('path');


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

getUserByToken: async (token) => {
  const query = 'SELECT id FROM users WHERE cookie = ?'; // Use 'cookie' as the column name
  try {
      const [rows] = await db.execute(query, [token]);
      console.log('Query result:', rows); // Log the result for debugging
      return rows[0] || null; // Return the user or null if not found
  } catch (error) {
      console.error('Error in getUserByToken:', error);
      throw error; // Re-throw error for the controller to handle
  }
},

getCartByUserId: async (userId) => {
  console.log('User  ID:', userId);
  const query = 'SELECT * FROM carts WHERE user_id = ?'; // Query to fetch the cart
  try {
      const [rows] = await db.execute(query, [userId]); // Execute the query
      console.log('Cart query result:', rows); // Log the result for debugging
      return rows[0] || null; // Return the first cart or null if none found
  } catch (error) {
      console.error('Error in getCartByUserId:', error); // Log any error
      throw error; // Re-throw the error to the controller
  }
},

getCartItemsByCartId: async (cartId) => {
  const query = 'SELECT * FROM cart_items WHERE cart_id = ?'; // Query to fetch cart items
  try {
      const [rows] = await db.execute(query, [cartId]); // Execute the query
      return rows; // Return the cart items (could be an empty array if no items found)
  } catch (error) {
      console.error('Error in getCartItemsByCartId:', error); // Log any error
      throw error; // Re-throw the error to be handled by the controller
  }
},

getProductDetailsForCartItems : async (cartItems) => {
  const productIds = cartItems.map(item => item.product_id);
  const query = `
    SELECT * FROM products WHERE id IN (${productIds.join(',')})
  `;
  const [products] = await db.execute(query);

  // Map cart items to product details
  return cartItems.map(item => {
    const product = products.find(p => p.id === item.product_id);
    return {
      cart_item_id: item.id,
      quantity: item.quantity,
      size: item.size,
      note: item.note,
      sugar_level: item.sugar_level,
      total_price: item.quantity * product.price,
      product_name: product.name,
      product_image_url: product.image_url,
      price: product.price
    };
  });
},

  checkIfItemExistsForEdit : (userId, productId, sugarLevel, size, note) => {
  return db.query(`
    SELECT * FROM cart_items
    WHERE user_id = ? AND product_id = ? AND sugar_level = ? AND size = ? AND note = ?`,
    [userId, productId, sugarLevel, size, note]
  );
},

updateCartItemDetails : (cartItemId, quantity, sugarLevel, size, note) => {
  return db.query(`
    UPDATE cart_items
    SET quantity = ?, sugar_level = ?, size = ?, note = ?
    WHERE id = ?`,
    [quantity, sugarLevel, size, note, cartItemId]
  );
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

createItem : async (name, quantity, size) => {
  try {
    const query = 'INSERT INTO items (name, quantity, size) VALUES (?, ?, ?)';
    const result = await db.execute(query, [name, quantity, size]);
    return { id: result.insertId, name, quantity, size };
  } catch (error) {
    throw new Error('Database error');
  }
},

getAvailableIngredients: async () => {
  const query = `SELECT * FROM ingredients WHERE status = 'available'`;
  const [rows] = await db.execute(query);
  return rows;
},

getAvailableItems: async () => {
  const query = `SELECT * FROM items WHERE status = 'available'`;
  const [rows] = await db.execute(query);
  return rows;
},

getArchivedIngredients: async () => {
  const query = `SELECT * FROM ingredients WHERE status = 'unavailable'`;
  const [rows] = await db.execute(query);
  return rows;
},

getArchivedItems: async () => {
  const query = `SELECT * FROM items WHERE status = 'unavailable'`;
  const [rows] = await db.execute(query);
  return rows;
},

// Update ingredient name
updateIngredientName: async (id, name) => {
  const query = 'UPDATE ingredients SET name = ? WHERE id = ?';
  const [result] = await db.execute(query, [name, id]);
  return result;
},

updateItemName: async (id, name) => {
  const query = 'UPDATE items SET name = ? WHERE id = ?';
  const [result] = await db.execute(query, [name, id]);
  return result;
},

recoverIngredient : async (id) => {
  const query = `UPDATE ingredients SET status = 'available' WHERE id = ?`;
  const [result] = await db.execute(query, [id]);
  return result;
},

recoverItem : async (id) => {
  const query = `UPDATE items SET status = 'available' WHERE id = ?`;
  const [result] = await db.execute(query, [id]);
  return result;
},

recoverProduct : async (id) => {
  const query = `UPDATE products SET status = 'available' WHERE id = ?`;
  const [result] = await db.execute(query, [id]);
  return result;
},

// Add stock quantity
addIngredientQuantity: async (id, quantity) => {
  const query = 'UPDATE ingredients SET quantity = quantity + ? WHERE id = ?';
  const [result] = await db.execute(query, [quantity, id]);
  return result;
},

addItemQuantity: async (id, quantity) => {
  const query = 'UPDATE items SET quantity = quantity + ? WHERE id = ?';
  const [result] = await db.execute(query, [quantity, id]);
  return result;
},

findIngredientByNameAndUnit: async (name, unit) => {
  const [rows] = await db.execute(
    'SELECT * FROM ingredients WHERE name = ? AND unit = ?',
    [name, unit]
  );
  return rows[0]; // Return the first matching ingredient or undefined
},

findItemByNameAndSize: async (name, size) => {
  const [rows] = await db.execute(
    'SELECT * FROM items WHERE name = ? AND size = ?',
    [name, size]
  );
  return rows[0]; // Return the first matching ingredient or undefined
},

deleteProduct : (productId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE products SET status = 'unavailable' WHERE id = ?`;
    db.query(query, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
},

deleteArchivedItems : (productId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM items WHERE id = ?`;
    db.query(query, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
},

deleteArchivedProduct : (productId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM products WHERE id = ?`;
    db.query(query, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
},

deleteCartItemById: (cartItemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `DELETE FROM cart_items WHERE id = ?`;
      console.log(`Executing query: ${query} with ID: ${cartItemId}`); // Log the query being executed
      
      // Use db.execute with async/await for better promise handling
      const [result] = await db.execute(query, [cartItemId]);
      
      console.log('Deletion result:', result); // Log the result of the deletion
      console.log('Affected rows:', result.affectedRows); // Log affected rows
      
      resolve(result.affectedRows > 0); // Resolve true if rows were deleted
    } catch (err) {
      console.error('Error executing query:', err); // Log the error for debugging
      reject(err); // Reject the promise with the error
    }
  });
},


findById : async (id) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
},

update : async (id, { name, price, category, image_url }) => {
  const [result] = await db.execute(
    'UPDATE products SET name = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
    [name, price, category, image_url, id]
  );
  if (result.affectedRows > 0) {
    return { id, name, price, category, image_url };
  } else {
    throw new Error('Product update failed');
  }
},

updateStatus: async (id) => {
  const [result] = await db.execute(
    `UPDATE ingredients SET status = ? WHERE id = ?`,
    ['unavailable', id]
  );

  if (result.affectedRows > 0) {
    return result; // Return the result directly
  } else {
    throw new Error('Ingredient update failed');
  }
},

updateItemStatus: async (id) => {
  const [result] = await db.execute(
    `UPDATE items SET status = ? WHERE id = ?`,
    ['unavailable', id]
  );

  if (result.affectedRows > 0) {
    return result; // Return the result directly
  } else {
    throw new Error('Ingredient update failed');
  }
},

// Update the quantity of an existing ingredient
updateIngredientQuantity: async (id, newQuantity) => {
  await db.execute(
    'UPDATE ingredients SET quantity = ? WHERE id = ?',
    [newQuantity, id]
  );
  const [rows] = await db.execute(
    'SELECT * FROM ingredients WHERE id = ?',
    [id]
  );
  return rows[0]; // Return the updated ingredient
},

updateItemQuantity: async (id, newQuantity) => {
  await db.execute(
    'UPDATE items SET quantity = ? WHERE id = ?',
    [newQuantity, id]
  );
  const [rows] = await db.execute(
    'SELECT * FROM items WHERE id = ?',
    [id]
  );
  return rows[0]; // Return the updated ingredient
},

getAllProducts :async (callback) => {
  try {
    // Use await instead of providing a callback
    const [rows, fields] = await db.query(`SELECT * FROM products WHERE status = 'available'`);
    return rows; // Return the result
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if needed
  }
},

getArchivedProducts :async (callback) => {
  try {
    // Use await instead of providing a callback
    const [rows, fields] = await db.query(`SELECT * FROM products WHERE status = 'unavailable'`);
    return rows; // Return the result
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if needed
  }
},

// Function to add a product to the cart
addProductToCart: async (cartId, productId, quantity, sugarLevel, size, note) => {
  const productIdInt = parseInt(productId, 10);
  const cart1 = cartId.id; // Assuming cartId is an object with an 'id' property
  console.log('Adding product to cart with parameters:', { cart1, productIdInt, quantity, sugarLevel, size, note });

  // Validate input types
  if (typeof cart1 !== 'number' || typeof productIdInt !== 'number' || typeof quantity !== 'number' ||
      typeof sugarLevel !== 'number' || typeof size !== 'string' || typeof note !== 'string') {
    throw new Error('Invalid input types');
  }

  // Check for null or undefined values
  if (cartId == null || productId == null || quantity == null || sugarLevel == null || size == null || note == null) {
    throw new Error('cartId, productId, quantity, sugarLevel, size, and note are required');
  }

  try {
    // Check if the item already exists in the cart
    const [existingItem] = await db.execute(
      `SELECT quantity FROM cart_items 
       WHERE cart_id = ? AND product_id = ? AND sugar_level = ? AND size = ? AND note = ?`,
      [cart1, productIdInt, sugarLevel, size, note]
    );

    if (existingItem.length > 0) {
      // If the item exists, update the quantity
      const currentQuantity = existingItem[0].quantity;
      const newQuantity = currentQuantity + quantity;

      await db.execute(
        `UPDATE cart_items 
         SET quantity = ?, size = ?, note = ? 
         WHERE cart_id = ? AND product_id = ? AND sugar_level = ?`,
        [newQuantity, size, note, cart1, productIdInt, sugarLevel]
      );
    } else {
      // If the item does not exist, insert a new record
      await db.execute(
        `INSERT INTO cart_items (cart_id, product_id, quantity, sugar_level, size, note) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cart1, productIdInt, quantity, sugarLevel, size, note]
      );
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow the error for further handling
  }
},

createCart: async (userId) => {
  const query = 'INSERT INTO carts (user_id) VALUES (?)';
  const [result] = await db.execute(query, [userId]);
  return result.insertId; // Return the new cart ID
},

// Function to update quantity of an item in the cart
updateCartItem: async (cartItemId, data) => {
  const query = 'UPDATE cart_items SET quantity = ?, sugar_level = ?, size = ?, note = ? WHERE id = ?';
  const [result] = await db.execute(query, [data.quantity, data.sugar_level, data.size, data.note, cartItemId]);
  console.log('Update result:', result); // Log the result
  if (result.affectedRows === 0) {
    console.log('No rows updated. Check if the cart item ID exists.');
}
  return result;
  
},
};

module.exports = productModel;
