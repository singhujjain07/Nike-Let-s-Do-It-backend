import orderModel from "../models/orderModel.js"
import userModel from '../models/userModel.js'
import Stripe from "stripe"
import dotenv from 'dotenv';
import productModel from "../models/productModel.js";


// configure env
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
export const placeOrderController = async (req, res) => {
    const frontend_url = 'http://localhost:5173'
    try {
        const {userId,items,amount,address} = req.body;
        const newOrder = new orderModel({userId,items,amount,address});
        await newOrder.save();
        const line_items = items.map((item)=>({
            price_data:{
                currency: "inr",
                product_data:{
                    name:item.name,
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:100*100*items.length
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.status(200).send({
            success:true,
            session_url: session.id,
            message:"Order placed successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in placing order'
        })
    }
}

export const verifyOrderController = async(req,res)=>{
    const {orderId,success}= req.body;
    try {
        if(success=="true"){
            const order = await orderModel.findById(orderId);
            const user = await userModel.findById(order.userId);
            if (order) {
                for (let i of order.items) {
                    const product = await productModel.findOne({ model: i.name });
                    if (product) {
                        let updated = false;
                        // Define a label for the outer loop
                        outer: 
                        for (let color of product.colors) {
                            if (color.name === i.color) {
                                color.sizes[i.size]-=i.quantity;
                                // console.log('Updated product:', product.model, 'Color:', color.name, 'Size:', i.size, 'New Quantity:', color.sizes[i.size]);
                                updated=true;
                                break outer;
                            }
                        }
                        if (updated) {
                            await productModel.findOneAndUpdate(
                                { _id: product._id },
                                { $set: { colors: product.colors } },
                                { new: true, runValidators: true }
                            );
                        }
                        // await product.save(); // Save the product after modifying
                    }
                }
            }
            await userModel.findByIdAndUpdate(user._id,{cart: []})
            await orderModel.findByIdAndUpdate(orderId,{payment: true});
            res.status(200).send({
                success:true,
                message:"Paid"
            })
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).send({
                success:true,
                message:"Not Paid"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in verifying order'
        })
    }
}

export const getUsersOrdersController = async(req,res)=>{
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({userId:userId}).select("-payment -__v -createdAt -updatedAt");
        res.status(200).send({
            success:true,
            orders,
            message:"Orders fetched successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in placing order'
        })
    }
}
