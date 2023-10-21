import express from "express";

import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import ProductRoutes from "./routes/ProductRout.js"
import cors from 'cors';
import path from 'path' 
import { start } from "repl";

//config
dotenv.config();

//database config
connectDB();

//rest object
const app = express();
//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')))


const authCorsOptions = {
    origin: '*', 
    methods: 'GET,PUT,POST,DELETE',
  };
//routes
app.use('/api/v1/auth',cors(authCorsOptions), authRoutes)

//category Routes

app.use('/api/v1/category',categoryRoutes)

// productApi

app.use('/api/v1/product',ProductRoutes)

//rest api
// app.get('/',(req,res)=>{
//     res.send("<h2>Hello Server </h2>")
// })

app.use('*',function(req,res){
  res.send(path.join(__dirname,'./client/build/index.html'))
})
//port
const PORT=process.env.PORT || 8080;

//run listen

app.listen(PORT,()=>{

})