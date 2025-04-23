const mongoose = require("mongoose");

// database connection

// main().then((res)=>{
//   console.log(" database connected");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/cab_management');
 
// }

const traveldetailsSchema = new mongoose.Schema({
  from:{
    type:String,
    required:true

  },
  to:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  }

});
const travelsearchdetails = mongoose.model("traveldetails", traveldetailsSchema);
module.exports = travelsearchdetails;


//----------------this is for register database-------//
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  mobie_no:{
    type:Number,
    require:true
  },

});


const users = mongoose.model("userSchema",  userSchema );
module.exports = users;




// -----------this is for reset password for otp varification------------//


const resetSchema = new mongoose.Schema({
  mobile_no:{
    type:Number,
    require:true
  },
  otp:{
    type:Number,
    require:true
  },
  password:{
    type:String,
    require:true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

});


const reset = mongoose.model("reset",  resetSchema );
module.exports = reset;