import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    colors: [],
    slug: {
        type: String,
        required: true,
    },
    threeD:{
        type: Number,
        default: 0,
    }
},{timestamps: true})

export default mongoose.model("Products",productSchema);