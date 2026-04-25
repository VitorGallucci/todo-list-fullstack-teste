import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String, 
        required: true
    }
});

userSchema.set( 'toJSON',{
    virtuals: true,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

export const User = mongoose.model("User", userSchema);