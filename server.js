import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'

// configure env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products',productRoutes)


// rest api
app.get('/',(req,res)=>{
    res.send('<h1>Nike Server - lesgo</h1>')
})


// PORT
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})