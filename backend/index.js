import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import agriInputRouter from './routes/agriInputRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';


// Get current directory path (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

// Serve static files from uploads directory
const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('Serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

//API Endpoints
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRouter);
app.use('/api/agri-inputs', agriInputRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


