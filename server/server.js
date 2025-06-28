import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import apirouter from './router/apirouter.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));


//connectio db 
connectDB();

// router call 

app.use('/api',apirouter );

// start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});