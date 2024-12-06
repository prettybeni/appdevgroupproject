const Product = require('../models/productModel'); // Import product model
const path = require('path');
const fs = require('fs');

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

  getArchivedProducts: async (req, res) => {
    try {
      const products = await Product.getArchivedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error occurred while fetching products:", error);
      res.status(500).json({ message: 'Server error while fetching products', error: error.message });
    }
  },
  // Delete product by ID
  deleteProduct : async (req, res) => {
    const { productId } = req.params;
    console.log('Received DELETE request for product ID:', productId);

    try {
      const result = await Product.deleteProduct(productId);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteArchivedIngredient : async (req, res) => {
    const { id } = req.params;
    console.log('Received DELETE request for product ID:', id);

    try {
      const result = await Product.deleteArchivedIngredient(id);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteArchivedItems : async (req, res) => {
    const { id } = req.params;
    console.log('Received DELETE request for product ID:', id);

    try {
      const result = await Product.deleteArchivedItems(id);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteArchivedProduct : async (req, res) => {
    const { id } = req.params;
    console.log('Received DELETE request for product ID:', id);

    try {
      const result = await Product.deleteArchivedProduct(id);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateIngredientStatus: async (req, res) => {
    const { id } = req.params;
  
    console.log('Received ID from frontend:', id);
  
    try {
      const { id: updatedId } = await Product.updateStatus(id); // Destructure the returned object
      res.json({ message: 'Ingredient status updated successfully', id: updatedId });
    } catch (error) {
      console.error('Error updating ingredient status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateItemStatus: async (req, res) => {
    const { id } = req.params;
  
    console.log('Received ID from frontend:', id);
  
    try {
      const { id: updatedId } = await Product.updateItemStatus(id); // Destructure the returned object
      res.json({ message: 'Ingredient status updated successfully', id: updatedId });
    } catch (error) {
      console.error('Error updating ingredient status:', error);
      res.status(500).json({ message: 'Server error' });
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

  updateProduct : async (req, res) => {
    try {
      const { name, price, category } = req.body;
      const productId = req.params.id;
  
      let imageUrl = null;
      
      // Check if a new image was uploaded
      if (req.file) {
        // If there's an old image, delete it from the server (optional)
        const oldProduct = await Product.findById(productId);
        if (oldProduct && oldProduct.image_url) {
          const oldImagePath = path.join(__dirname, '..', oldProduct.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete old image
          }
        }
  
        // Set the new image URL
        imageUrl = `/uploads/${req.file.filename}`; // Adjust the path as needed
      } else {
        // Use the existing image if no new image is uploaded
        const product = await Product.findById(productId);
        imageUrl = product.image_url;
      }
  
      // Update the product in the database
      const updatedProduct = await Product.update(productId, { name, price, category, image_url: imageUrl });
  
      // If update is successful, send a response with the updated product
      res.status(200).json({ 
        message: 'Product updated successfully', 
        product: updatedProduct,
        image_url: imageUrl, // Include the image URL in the response
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  },

  
  
  
  
  

  addIngredient: async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { name, quantity, unit } = req.body;
    
    if (!name || !quantity || !unit) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if the ingredient already exists
      const existingIngredient = await Product.findIngredientByNameAndUnit(name, unit);
      
      if (existingIngredient) {
        // Update the quantity of the existing ingredient
        const updatedIngredient = await Product.updateIngredientQuantity(
          existingIngredient.id, 
          existingIngredient.quantity + parseFloat(quantity)
        );
        return res.status(200).json({ 
          message: 'Ingredient quantity updated successfully', 
          ingredient: updatedIngredient 
        });
      }
      
      // Add new ingredient if it doesn't exist
      const newIngredient = await Product.createIngredient(name, quantity, unit);
      return res.status(200).json({ 
        message: 'Ingredient added successfully', 
        ingredient: newIngredient 
      });
    } catch (error) {
      console.error(error); // Log the error
      return res.status(500).json({ message: 'Server error' });
    }
  },

  addItem: async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { name, quantity, size } = req.body;
    
    if (!name || !quantity || !size) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if the ingredient already exists
      const existingIngredient = await Product.findItemByNameAndSize(name, size);
      
      if (existingIngredient) {
        // Update the quantity of the existing ingredient
        const updatedIngredient = await Product.updateItemQuantity(
          existingIngredient.id, 
          existingIngredient.quantity + parseFloat(quantity)
        );
        return res.status(200).json({ 
          message: 'Ingredient quantity updated successfully', 
          ingredient: updatedIngredient 
        });
      }
      
      // Add new ingredient if it doesn't exist
      const newIngredient = await Product.createItem(name, quantity, size);
      return res.status(200).json({ 
        message: 'Ingredient added successfully', 
        ingredient: newIngredient 
      });
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
 
  getAvailableIngredients: async (req, res) => {
    try {
      const ingredients = await Product.getAvailableIngredients();
      res.json(ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  },

  getAvailableItems: async (req, res) => {
    try {
      const items = await Product.getAvailableItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  },

  getArchivedIngredients: async (req, res) => {
    try {
      const ingredients = await Product.getArchivedIngredients();
      res.json(ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  },

  getArchivedItems: async (req, res) => {
    try {
      const items = await Product.getArchivedItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
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

  updateItemName: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and cannot be empty' });
    }

    try {
      const result = await Product.updateItemName(id, name.trim());
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

  addItemQuantity: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    try {
      const result = await Product.addItemQuantity(id, quantity);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Stock added successfully' });
    } catch (error) {
      console.error('Error adding stock:', error);
      res.status(500).json({ error: 'Failed to add stock' });
    }
  },

  recoverIngredient : async (req, res) => {
    const { id } = req.params;
    try {
      await Product.recoverIngredient(id);
      res.json({ message: 'Ingredient recovered successfully' });
    } catch (error) {
      console.error('Error recovering ingredient:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  recoverItem : async (req, res) => {
    const { id } = req.params;
    try {
      await Product.recoverItem(id);
      res.json({ message: 'Ingredient recovered successfully' });
    } catch (error) {
      console.error('Error recovering ingredient:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  recoverProduct : async (req, res) => {
    const { id } = req.params;
    try {
      await Product.recoverProduct(id);
      res.json({ message: 'Ingredient recovered successfully' });
    } catch (error) {
      console.error('Error recovering ingredient:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  
  
  
  
  
};

module.exports = productControl;
