import mongoose from "mongoose";

// Conexão asíncrona com o MongoDB usando Mongoose
export const connectDB = async () => {
    // Tenta conectar ao MongoDB
    try {
        // Busca a URI do MongoDB no arquivo .env e tenta conectar
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        // Se ocorrer um erro, exibe a mensagem e encerra o processo
        console.error(`Erro ao conectar ao MongoDB: ${error}`);
        process.exit(1);
    }
};