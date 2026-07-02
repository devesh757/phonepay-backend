  import {model,Schema}from  "mongoose";

interface IUser {
    username:string,
    password:string,
    firstname:string,
    lastname:string
}


const userSchema = new Schema<IUser>({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    lastname:{type:String,required:true},
    firstname:{type:String,required:true}
})


const User = model<IUser>("User",userSchema);

export default User;