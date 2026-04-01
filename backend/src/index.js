import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    }).on("error", (error)=> {
      console.log("Error: ", error);
      throw error;
    })
  })
  .catch(error => {
    console.log('MongoDB connection failed:', error);
  });