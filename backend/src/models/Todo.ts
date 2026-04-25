import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    concluida: {
        type: Boolean, 
        default: false
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

todoSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});