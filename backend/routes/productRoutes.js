import express from 'express';
import { addProduct, getProductsByFarmerEmail, getFarmersWithProducts, deleteProduct, updateProductQuantity } from '../controller/productController.js';
import upload from '../middleware/upload.js';

const productRouter = express.Router();

// Route to add new product with image upload
productRouter.post('/add-product', upload.single('productImage'), addProduct);

// Route to get products by farmer email
productRouter.get('/farmer/:farmerEmail', getProductsByFarmerEmail);

// Route to get all farmers who have products
productRouter.get('/farmers-with-products', getFarmersWithProducts);

// Route to delete a product
productRouter.delete('/delete/:productId', deleteProduct);

// Route to update product quantity
productRouter.put('/update-quantity/:productId', updateProductQuantity);

export default productRouter;