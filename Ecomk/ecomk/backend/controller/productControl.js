const Product = require('../models/productModel'); // Import product model
const multer = require('multer');
const path = require('path');

// Product controller
const productControl = {
  // Fetch all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error occurred while fetching products:", error);
      res.status(500).json({ message: 'Server error while fetching products', error: error.message });
    }
  },
  // Delete product by ID
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      await Product.deleteById(id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  },

  // Create new product
  addProduct: async (req, res) => {
    try {
      const { name, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
  
      console.log('Received product data:', { name, price, category, image });
  
      // Validate required fields
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
  
      // Check if the product already exists
      const existingProduct = await Product.findProductByName(name);
      console.log('Existing product:', existingProduct);
  
      if (!existingProduct) {
        const productData = { name, price, category, image_url: image };
  
        // Insert product into the database
        const productId = await Product.addProduct(productData);
        
        if (productId) {
          console.log('Product added successfully with ID:', productId);
  
          // Send the success response after product is inserted
          return res.status(201).json({
            message: 'Product added successfully',
            productId: productId,
          });
        } else {
          console.log('Failed to insert product');
          return res.status(500).json({ message: 'Failed to insert product.' });
        }
      } else {
        console.log('Product already exists');
        return res.status(400).json({ message: 'Product already exists.' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ message: 'Error adding product' });
    }
  },

  
  
  
  
  

  addIngredient: async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { name, quantity, unit } = req.body;
    
    if (!name || !quantity || !unit) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
      const newIngredient = await Product.createIngredient(name, quantity, unit);
      return res.status(200).json({ message: 'Ingredient added successfully', ingredient: newIngredient });
    } catch (error) {
      console.error(error); // Log the error
      return res.status(500).json({ message: 'Server error' });
    }
  },

  getMenu : async (req, res) => {
    console.log('Session:', req.session); // Debug session

    try {
      // Await the result of getAllProducts, which returns a Promise
      const products = await Product.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the products' });
    }
  },

  getProductDetails: async (req, res) => {
    const productId = req.params.productId;
    const token = req.query.token; // Fetch token from query parameters

    try {
        const product = await Product.getProductById(productId); // Fetch product details
        if (product) {
            res.json({ product, token }); // Include token in the response
        } else {
            res.status(404).json({ message: 'Product not found', token });
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Internal server error', token });
    }
},


  getCart:async (req, res) => {
    try {
      const { token } = req.query; // Get token from query params
      const cartId = await Product.getCartDataByToken(token);
      if (!cartId) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json({ cart_id: cartId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  
  // Add item to cart
  addItemToCart: async (req, res) => {
    console.log(req.body); // Log the incoming request body
    console.log('User ID from session:', req.session.userId);

    const { productId, quantity } = req.body;
    const userId = req.session.userId;
  
    // Check if user is logged in
    // if (!userId) {
    //   return res.status(401).json({ message: 'User not logged in' });
    // }
  
    // Check if all required fields are provided
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
  
    try {
      // Call the addToCart function from Product model (assumed to be a promise)
      await Product.addToCart(userId, productId, quantity);
  
      // Return success response
      return res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (err) {
      // Log error and return server error
      console.error('Error adding item to cart:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  
  
  // Update item quantity in the cart
  updateCartItem : (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;
  
    if (!userId) {
      return res.redirect('/'); // If the user is not logged in, redirect to login
    }
  
    Product.updateCartItem(userId, productId, quantity)
      .then(() => {
        res.redirect('/cart'); // Redirect to the cart page after updating the item
      })
      .catch(err => {
        console.error('Error updating cart item:', err);
        res.status(500).send('Server Error');
      });
  },
 
  getAllIngredients: async (req, res) => {
    try {
      const ingredients = await Product.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  },

  // Update ingredient name
  updateIngredientName: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and cannot be empty' });
    }

    try {
      const result = await Product.updateIngredientName(id, name.trim());
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }
      res.json({ message: 'Ingredient name updated successfully' });
    } catch (error) {
      console.error('Error updating ingredient name:', error);
      res.status(500).json({ error: 'Failed to update ingredient name' });
    }
  },

  // Add stock to ingredient quantity
  addIngredientQuantity: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    try {
      const result = await Product.addIngredientQuantity(id, quantity);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }
      res.json({ message: 'Stock added successfully' });
    } catch (error) {
      console.error('Error adding stock:', error);
      res.status(500).json({ error: 'Failed to add stock' });
    }
  },
  
  
  
};

module.exports = productControl;
