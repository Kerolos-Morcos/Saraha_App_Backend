import mongoose from 'mongoose';
import { dbConfig } from '../Config/db.config.js';

export const dbConnection = async () => {
    try {
        await mongoose.connect(dbConfig);
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
