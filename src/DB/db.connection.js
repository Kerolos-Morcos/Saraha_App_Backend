import mongoose from 'mongoose';
import envConfig from '../Config/env.config.js';

export const dbConnection = async () => {
    try {
        await mongoose.connect(envConfig.database.DB_URI_LOCAL);
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
