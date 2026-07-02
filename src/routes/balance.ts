import {Router,Request,Response} from "express"
import Account from "../db/accountSchema"
import authmiddleware from "../middleware/authmiddleware"
const balance = Router();

balance.get("/balance",authmiddleware,async(req:Request,res:Response)=>{

 const accountBalance = await Account.findOne({userId:(req as any).userId}).select("balance")

res.json({
    balance:accountBalance,
    success: true
})

})

export default balance;