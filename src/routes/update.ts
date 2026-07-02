import {Request,Response,Router} from "express"
import User from "../db/userSchema"
import authmiddleware from "../middleware/authmiddleware"
import zod from "zod"
import bcrypt from "bcrypt"

const update = Router();

update.put("/update", authmiddleware,async(req:Request,res:Response) => {

   const body = req.body;
   const userData = zod.object({
    password:zod.string().min(6).optional(),
    firstname:zod.string().optional(),
    lastname:zod.string().optional()
   })

   const updateUser = userData.safeParse(body);

   if(!updateUser.success){
      return res.status(401).json({
        message:" Error while updating",
        success:false
      })
   }

   try{ 
    const userId = (req as any).userId;

    const updateData: any = { ...updateUser.data};
    if(updateData.password){
        updateData.password = await bcrypt.hash(updateData.password,10);
    }
const result = await User.updateOne(
    {_id:userId},{
        $set:updateData
    }
);

  if(result.matchedCount === 0){
    return res.status(401).json({
        message:'user not found',
        success:false
    })
  }
  res.status(200).json({
    message:"updated succefully",
    success:true
  })

   }catch(e){
       res.status(500).json({
        message:"Internal server during update",
        success: false
       })
   }

})
export default update;
