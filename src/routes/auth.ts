import dotenv from "dotenv";
dotenv.config();

import {Router,Request,Response} from "express"
import User from "../db/userSchema"
import jwt from "jsonwebtoken"
import Account from "../db/accountSchema"
const JWT_SECRET = process.env.JWT_SECRET as string;
import zod from "zod"
import bcrypt from "bcrypt"


 const Auth = Router();

 Auth.post("/signup",async(req:Request,res:Response) => {
    const body = req.body;

    const user = zod.object({
        username:zod.string().min(5).email(),
     password:zod.string().min(6),
     firstname:zod.string().min(4),
      lastname:zod.string().min(4)
    });

    const userData = user.safeParse(body);
    if(!userData.success){
       return res.status(401).json({
            message:"Invalid data",
            success:false
        })
    }
    
    try{
        const existingUser = await User.findOne({username:userData.data.username})
        if(existingUser){
           return res.status(401).json({
                message:"Username was already taken",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(userData.data.password,10)

         const newUser = new User({
            username:userData.data.username,
            password:hashedPassword,
            firstname:userData.data.firstname,
            lastname:userData.data.lastname
         })
    
         await newUser.save()
         res.status(201).json({
            message:"successfully signedup",
            success:true
         })

    }catch(err){
           res.status(500).json({
            message:"internal error",
            success:false
           })
    }
 })


 Auth.post("/signin",async(req:Request,res:Response) => {
       const body = req.body;

       const usersignin = zod.object({
        username:zod.string().min(6).email(),
        password : zod.string().min(6)
       })
       
       const userData = usersignin.safeParse(body);

       if(!userData.success){
        return res.status(401).json({
            message:"Invalid data",
            success:true
        })
       }

       try{
       const user = await User.findOne({username:userData.data.username});
         
       if(!user){
        return res.status(401).json({
            message:" Username and password invalid"
        })
       }

       const isPasswordinvalid  = await bcrypt.compare(userData.data.password,user.password)
       if(!isPasswordinvalid){
        return res.status(401).json({
            message:"Invalid username and password",
            success:false
        })
       }
      
       const userId = user?._id;
       await Account.create({
        //@ts-ignore
        userId,
        balance:1 + Math.random() * 10000
       })

      
       const token = jwt.sign({
        userId:user._id
       },JWT_SECRET)
      
       res.status(200).json({
        success:true,
        message:"Signing up",
        token:token
       })

       }catch(err){
        res.status(500).json({
            message:"internal error",
            success:false
        })
       }

 })

 export default Auth;
