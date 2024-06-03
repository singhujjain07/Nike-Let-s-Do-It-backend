import productModel from "../models/productModel.js"

import slugify from 'slugify'

export const createProductController = async (req, res) => {
    try {
        const { model, gender, description, price, colors } = req.body
        // validation
        // console.log(price)
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
        const products = new productModel({ model, gender, description, price, colors, slug: slugify(model + " " + gender) })
        await products.save();
        // console.log(products)
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
        const { productId } = req.body
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


// get Product 
export const getFilteredProductsController = async (req, res) => {
    try {
        const products = await productModel.find(req.query).limit(12).sort({ createdAt: -1 })
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


// export const getProductSbyColorController = async (req, res) => {
//     const colorQueries = req.query.colors ? req.query.colors.split(',') : null;
//     const genderQueries = req.query.gender ? req.query.gender.split(',') : null;

//     try {
//         // Create regex patterns for each color query
//         const colorRegexes = colorQueries ? colorQueries.map(color => new RegExp(color, 'i')) : [];

//         // Conditionally build the match stage based on query parameters
//         let matchStage = {};

//         if (colorRegexes.length > 0) {
//             matchStage['colors.name'] = { $in: colorRegexes };
//         }

//         if (genderQueries !== null && genderQueries.length > 0) {
//             matchStage['gender'] = { $in: genderQueries };
//         }

//         // Build the aggregation pipeline
//         let pipeline = [
//             { $match: matchStage },
//             { $unwind: '$colors' },
//             {
//                 $project: {
//                     _id: 1,
//                     model: 1,
//                     gender: 1,
//                     price: 1,
//                     color: '$colors.name',
//                     image: { $arrayElemAt: ['$colors.images', 0] }
//                 }
//             }
//         ];

//         // If color queries are present, add an additional $match stage
//         if (colorRegexes.length > 0) {
//             pipeline.splice(2, 0, {
//                 $match: {
//                     $and: [
//                         matchStage,
//                         { 'colors.name': { $in: colorRegexes } }
//                     ]
//                 }
//             });
//         }
//         // Add $sample stage for random sorting
//         pipeline.push({ $sample: { size: 100 } }); // You can adjust the size as needed

//         const products = await productModel.aggregate(pipeline);

//         const formattedProducts = products.map(product => ({
//             _id: product._id,
//             model: product.model,
//             gender: product.gender,
//             price: product.price,
//             color: product.color,
//             image: product.image
//         }));

//         res.json(formattedProducts);
//     } catch (error) {
//         console.error("Error finding products by colors:", error);
//         res.status(500).send("Server Error");
//     }
// }

export const getProductSbyColorController = async (req, res) => {
    const colorQueries = req.query.colors ? req.query.colors.split(',') : null;
    const genderQueries = req.query.gender ? req.query.gender.split(',') : null;
    const sortBy = req.query.sortBy ? req.query.sortBy : 0;
    try {
        // Create regex patterns for each color query
        const colorRegexes = colorQueries ? colorQueries.map(color => new RegExp(color, 'i')) : [];

        // Conditionally build the match stage based on query parameters
        let matchStage = {};

        if (colorRegexes.length > 0) {
            matchStage['colors.name'] = { $in: colorRegexes };
        }

        if (genderQueries !== null && genderQueries.length > 0) {
            matchStage['gender'] = { $in: genderQueries };
        }

        // Build the aggregation pipeline
        let pipeline = [
            { $match: matchStage },
            { $unwind: '$colors' },
            {
                $project: {
                    _id: 1,
                    model: 1,
                    gender: 1,
                    price: 1,
                    color: '$colors.name',
                    image: { $arrayElemAt: ['$colors.images', 0] },
                    slug: 1,
                    threeD: 1
                }
            }
        ];

        // If color queries are present, add an additional $match stage
        if (colorRegexes.length > 0) {
            pipeline.splice(2, 0, {
                $match: {
                    $and: [
                        matchStage,
                        { 'colors.name': { $in: colorRegexes } }
                    ]
                }
            });
        }
        // Add $sample stage for random sorting
        // pipeline.push({ $sample: { size: 100 } }); // You can adjust the size as needed

        const products = await productModel.aggregate(pipeline);

        const formattedProducts = products.map(product => ({
            _id: product._id,
            model: product.model,
            gender: product.gender,
            price: product.price,
            color: product.color,
            image: product.image,
            slug: product.slug,
            threeD: product.threeD
        }));
        let newData = [];
        let prev_ind = 2;
        while (formattedProducts.length >= 3) {
            newData.push(formattedProducts[prev_ind]);
            formattedProducts.splice(prev_ind, 1);
            prev_ind += 3;
            prev_ind %= formattedProducts.length;
        }
        for (let i of formattedProducts) {
            newData.push(i);
        }
        if(sortBy==1){
            newData = newData.filter(item => item.threeD !== 0);
        }
        else if(sortBy==2){
            newData = newData.filter(item => item.threeD === 0);
        }
        else if(sortBy>2){
            newData = [...newData].sort((a, b) => {
                if (a['price'] < b['price']) return sortBy == 3? -1 : 1;
                if (a['price'] > b['price']) return sortBy == 3 ? 1 : -1;
                return 0;
              });
        }
        res.json(newData);
    } catch (error) {
        console.error("Error finding products by colors:", error);
        res.status(500).send("Server Error");
    }
}