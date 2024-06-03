import mongoose, { mongo } from "mongoose";

const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    blockno: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    // addressType: {
    //     type: String,
    //     // enum: ['home', 'work', 'billing'],
    //     // default: 'home',
    // }
});
const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Products',
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    size:{
        type: String,
        required: true,
    },
    color: {
        type: Number,
        required: true,
    },
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        favorites: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Products',
            // type: String
        }],
        addresses: [addressSchema],
        cart: [cartSchema],
        role: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);