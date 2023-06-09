const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = async()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }).then(()=> {console.log("connection of DB successfuly")}).catch((error)=>{
        console.log(error);
        console.log("DB connection faild")
    })
}
