import mongoose from "mongoose";


const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true
    },
    decs:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category',
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shpping:{
        type:Boolean,
    }

},{timestamps:true})
export default mongoose.model("Products",ProductSchema)