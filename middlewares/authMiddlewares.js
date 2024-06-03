import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";


// admin access 
export const isAdmin = async(req,res,next)=>{
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId);
        if(!user.role){
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            })
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in Admin Middleware"
        })
    }
}