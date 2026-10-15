import mongoose from 'mongoose';
import { env } from './env.js';

const connectDB = async () => {
    await mongoose.connect(env.mongoUrl, { dbName: 'optenfleet' });
    console.log('MongoDB conectado com sucesso!');
};

export default connectDB;
