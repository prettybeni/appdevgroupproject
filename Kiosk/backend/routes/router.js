const express = require('express');
const router = express.Router();
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


// Product Management Routes
router.get('/admin/products', productControl.getAllProducts);
router.get('/admin/archived-products', productControl.getArchivedProducts);
router.post('/admin/addProd', upload.single('image'), productControl.addProduct);
router.get('/product/:productId', productControl.getProductDetails);
router.put('/admin/products/:productId/delete', productControl.deleteProduct); // Consider renaming this route for clarity
router.post('/cart/:product_id', productControl.addItemToCart);
router.get('/cart', productControl.getCart);
router.put('/cart/:cartItemId', productControl.editCartItem);
router.delete('/cart/:cartItemId', productControl.deleteCartItem);
router.post('/cart/update', productControl.updateCartItem);
router.get('/menu', productControl.getMenu);
router.put('/admin/products/:id', upload.single('image'), productControl.updateProduct);
router.put('/admin/products/:id/recover', productControl.recoverProduct);
router.delete('/admin/products/:id/delete', productControl.deleteArchivedProduct);

// Ingredient Management Routes
router.post('/admin/addIngredient', productControl.addIngredient);
router.get('/admin/manageIngredients', productControl.getAvailableIngredients);
router.get('/admin/archivedIngredients', productControl.getArchivedIngredients);
router.put('/admin/manageIngredients/:id', productControl.updateIngredientName);
router.put('/admin/manageIngredients/:id/add-quantity', productControl.addIngredientQuantity);
router.put('/admin/archivedIngredients/:id/recover', productControl.recoverIngredient);
router.put('/admin/manage-ingredients/:id', productControl.updateIngredientStatus);
router.delete('/admin/archivedIngredients/:id/delete', productControl.deleteArchivedIngredient);

// Item Management Routes
router.post('/admin/addItem', productControl.addItem);
router.get('/admin/manageItems', productControl.getAvailableItems);
router.put('/admin/manageItems/:id', productControl.updateItemName);
router.put('/admin/manageItems/:id/add-quantity', productControl.addItemQuantity);
router.put('/admin/manage-items/:id', productControl.updateItemStatus);
router.get('/admin/archivedItems', productControl.getArchivedItems);
router.put('/admin/archivedItems/:id/recover', productControl.recoverItem);
router.delete('/admin/archivedItems/:id/delete', productControl.deleteArchivedItems);

module.exports = router;