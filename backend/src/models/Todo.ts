import mongoose from "mongoose";

// Define o esquema da tarefa
const todoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    concluida: {
        type: Boolean, 
        default: false // Por padrão, a tarefa não está concluída
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataCriacao: {
        // Nota de Arquitetura: 
        // As datas (createdAt/updatedAt) são mantidas em UTC no banco de dados por padrão
        // A formatação para o fuso horário local do usuário é responsabilidade do frontend
        type: Date,
        default: Date.now // Define a data de criação da tarefa para a data atual
    }
});

// Configura o esquema para incluir um campo virtual "id" e convertê-lo para JSON
todoSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Exporta o modelo "Todo"
export const Todo = mongoose.model('Todo', todoSchema);