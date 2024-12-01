const express = require('express');
const router = express.Router();
const userControl = require('../controller/userControl');
const productControl = require('../controller/productControl');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
    }
  });
  
  const upload = multer({ storage });



// User Authentication Routes
router.post('/register', userControl.registerUser );
router.post('/', userControl.loginUser );
router.get('/verify', userControl.verifyUser );
router.post('/reset-password', userControl.resetPassword);
router.post('/password-changed', userControl.resetPasswordWithToken);
router.get('/user-profile', userControl.getProfile);
router.put('/edit-profile', userControl.updateProfile);
router.get('/dashboard', userControl.getHomepage);

// Product Management Routes
router.get('/admin/products', productControl.getAllProducts);
router.post('/admin/addProd', upload.single('image'), productControl.addProduct);
router.get('/product/:productId', productControl.getProductDetails);
router.delete('/products', productControl.getAllProducts); // Consider renaming this route for clarity
router.post('/cart/add', productControl.addItemToCart);
router.get('/cart', productControl.getCart);
router.post('/cart/update', productControl.updateCartItem);
router.get('/menu', productControl.getMenu);

// Ingredient Management Routes
router.post('/admin/addIngredient', productControl.addIngredient);
router.get('/admin/manageIngredients', productControl.getAllIngredients);
router.put('/admin/manageIngredients/:id', productControl.updateIngredientName);
router.put('/admin/manageIngredients/:id/add-quantity', productControl.addIngredientQuantity);












module.exports = router;