import mongoose from "mongoose";

// Define o esquema do usuário, com email e senha obrigatórios
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Garante que o email seja único no banco de dados
    },
    senha: {
        type: String, 
        required: true
    }
});

// Configura o esquema para incluir um campo virtual "id" e convertê-lo para JSON
userSchema.set( 'toJSON',{
    virtuals: true, // Inclui os campos virtuais na conversão para JSON
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id; // Cria um campo "id"
        delete ret._id; // Remove o campo "_id" original
        delete ret.__v; // Remove o campo "__v" que é usado internamente pelo Mongoose
    }
});

// Exporta o modelo "User"
export const User = mongoose.model("User", userSchema);