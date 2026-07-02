import {Router,Request,Response} from "express"
import authmiddleware from "../middleware/authmiddleware"
import Account from "../db/accountSchema"
import mongoose from "mongoose";
const transfer = Router();

transfer.post("/transfer",authmiddleware,async(req:Request,res:Response)=>{
  const session = await mongoose.startSession();

  session.startTransaction();

  const{amount,to} = req.body;
  const userId = (req as any).userId;

  const account = await Account.findOne({userId}).session(session);
  if(!account || account.balance < amount){
    await session.abortTransaction();
    return res.status(403).json({
        message:"Insufficient balance",
        success:false
    })
  }
  
  const toAccount = await Account.findOne({userId : new mongoose.Types.ObjectId(to)}).session(session);
  if(!toAccount){
    await session.abortTransaction();
    return res.status(403).json({
        message:"Invalid Account",
        success:false
    })
  }

  await Account.updateOne({userId:userId},{$inc:{balance: -amount}}).session(session);

  await Account.updateOne({userId:to},{$inc:{balance: amount}}).session(session);

  await session.commitTransaction();

  res.json({
    success:true,
    message:"Transfer successful"
  })
})

export default transfer; 