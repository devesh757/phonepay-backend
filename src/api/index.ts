import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import Auth from "../routes/auth"
import cors from "cors"
import mongoose from "mongoose"
import update from "../routes/update"
import balance from "../routes/balance"
import transfer from "../routes/transaction"
import account from "../routes/account"


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user",Auth);
app.use('/api/v1/user',update);
app.use("/api/v1/user",balance);
app.use("/api/v1/user",transfer);
app.use("/api/v1/user",account);
 const PORT = process.env.PORT;
 const mongo_url = process.env.MONGO_URL as string;

 async function main(){
    await mongoose.connect(mongo_url as string,{   
    }).then(() => {
        app.listen(PORT)
    })
 }
main();