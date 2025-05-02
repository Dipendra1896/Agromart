import express from 'express';
import { addAgriInput, getAgriInputsBySupplierEmail, getSuppliersWithAgriInputs, deleteAgriInput, updateAgriInputQuantity } from '../controller/agriInputController.js';
import upload from '../middleware/upload.js';

const agriInputRouter = express.Router();

// Route to add new agri-input with image upload
agriInputRouter.post('/add-agri-input', upload.single('inputImage'), addAgriInput);

// Route to get agri-inputs by supplier email
agriInputRouter.get('/supplier/:supplierEmail', getAgriInputsBySupplierEmail);

// Route to get all suppliers who have agri-inputs
agriInputRouter.get('/suppliers-with-inputs', getSuppliersWithAgriInputs);

// Route to delete an agri-input
agriInputRouter.delete('/delete/:inputId', deleteAgriInput);

// Route to update agri-input quantity
agriInputRouter.put('/update-quantity/:inputId', updateAgriInputQuantity);

export default agriInputRouter;