import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"


export const createCategoryController = async(req,res)=>{
    try {
        const {name,gender,description} = req.body
        if(!name){
            return res.status(401).send({
                message: 'Name is required'
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            })
        }
        const category = await new categoryModel({name,gender,description,slug: slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}


// update category
export const updateCategoryController = async (req,res)=>{
    try {
        const {name,gender,description} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,gender,description,slug:slugify(name)},{new: true})
        res.status(200).send({
            success:true,
            message: 'Category updated successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message:'Error while updating category'
        })
    }
}

// get all categories
export const categoryController = async(req,res)=>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: 'All categories fetched successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all categories'
        })
    }
}

// get single category
export const singleCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message: 'Single category fetched successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting category'
        })
    }
}

// delete category
export const deleteCategoryController = async(req,res)=>{
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: 'Error in deleting category'
        })
    }
}