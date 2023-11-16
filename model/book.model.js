const mongoose= require('mongoose');
const bookschema=mongoose.Schema({
    title:String,
    author:String,
    addedAt:{
        type:Date,
        default:Date.now()
    },
    addedBy:String
},{
    versionKey:false
})

const Book=mongoose.model("books",bookschema);
module.exports={Book}
