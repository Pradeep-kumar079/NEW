const mongoose = require("mongoose");

const userdetailSchema = new mongoose.Schema({
  name:{
    type:String,
    require:true,

  },
  password:{
    type:String,
    require:true
  },
  mob_no:{
    type:Number,
    maxlength:10,
    require:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  selected_seats:{
    type:Object,
    default:0,
    require:true

  },
  from:{
    type:String,
    

  },
  to:{
    type:String,
    
  }

});


const users = mongoose.model("users",   userdetailSchema );
module.exports = users;