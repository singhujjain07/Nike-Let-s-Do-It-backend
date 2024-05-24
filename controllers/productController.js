import productModel from "../models/productModel.js"

import slugify from 'slugify'

export const createProductController = async (req, res) => {
    try {
        const { model,gender,description,price,colors } = req.body
        // validation
        console.log(price)
        switch (true) {
            case !model:
                return res.status(500).send({ error: 'Model is required' })
            case !gender:
                return res.status(500).send({ error: 'Gender is required' })
            case !description:
                return res.status(500).send({ error: 'Description is required' })
            case !price:
                return res.status(500).send({ error: 'Price is required' })
            case !colors:
                return res.status(500).send({ error: 'Category is required' })
        }
        const products = new productModel({ model,gender,description,price,colors, slug: slugify(model+" "+gender) })
        await products.save();
        console.log(products)
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating product'
        })
    }
}


// get Product 
export const getProductsController = async (req, res) => {
    try {
        const products = await productModel.find({}).limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: 'Product fetched successfully',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error: error.message
        })
    }
}

// get Single Product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: 'Product fetched successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting product'
        })
    }
}

export const getProductByIdController = async (req, res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.status(200).send({
            success: true,
            message: 'Product fetched successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting product'
        })
    }
}