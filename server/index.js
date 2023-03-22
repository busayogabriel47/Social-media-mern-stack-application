import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoute from './routes/users.js'
import route from './routes/index.js'

dotenv.config()


const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors())


app.use('/posts', route)
app.use('/user', userRoute);


const port = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URL, 
    {useNewUrlParser: true, 
    useUnifiedTopology: true,
}
)
.then(()=> app.listen(port, ()=> {
    console.log(`Server running on ${port} and connected to Database`)
}))
.catch((err)=> console.log(err.message))


