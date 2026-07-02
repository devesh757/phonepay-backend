import {Router,Response,Request} from "express"
import User from "../db/userSchema"


const account = Router();

account.get("/bulk",async(req:Request,res:Response) => {
    const filter = (req.query.filter as string) || "";

    const users = await User.find({
        $or:[{
            firstname:{"$regex":filter,"$options":"i"}},{
                lastname:{"$regex":filter,"$options":"i"}
            
        }]
    })

    res.json({
        user: users.map(user => ({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})

export default account;