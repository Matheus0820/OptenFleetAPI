import mongoose from 'mongoose';
import 'dotenv/config';

const url = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            dbName: 'optenfleet',
        });
        console.log('MongoDB conectado com sucesso!');

    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;