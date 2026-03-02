import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"], 
        minlength: 6, 
        select: false 
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    }
}, { timestamps: true });

const argon2Options = {
    type: argon2.argon2id, 
    memoryCost: 2 ** 16,   
    timeCost: 3,           
    parallelism: 1         
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await argon2.hash(this.password, argon2Options);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (err) {
        return false;
    }
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model("User", userSchema);
export default User;