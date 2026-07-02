import  mongoose,{Schema,model,ObjectId,Types} from "mongoose"


interface IAccount{
    userId:Types.ObjectId,
    balance:Number
}

const accountSchema = new Schema<IAccount>({
    balance:{type:Number,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId as any, required:true , ref:"User"}
})

const Account = model<IAccount>("account",accountSchema);

export default Account;