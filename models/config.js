const mongoose = require("mongoose");



const vechicleSchema = new mongoose.Schema({
  v_name:{
    type:String,
    required:true
  },
  v_number:{
    type:String,
    required:true
  },
  v_driver_name:{
    type:String,
    required:true
  },
  dr_mob_no:{
    type:Number,
    required:true
  },
  alt_mob_no:{
    type:Number,
    required:true
  },
  from:{
    type:String,
    required:true
  },
  to:{
    type:String,
    required:true
  },
  
departure_time:{
  type:String,
},
Arrival_time:{
  type:String,
},
Duration:{
  type:String,
},
Rating:{
  type:Number,
},
Amount:{
  type:Number,
},


});

const travels = mongoose.model("travels",vechicleSchema);

//const vechicle1 = travels.insertOne({v_name:"nagashree",v_number:"3467",v_driver_name:"suresh", dr_mob_no:9972605831,alt_mob_no:9353198519,from:"Devadurga",to:"Banglore"});
//vechicle1.save();
module.exports = travels ;

//const config = module.exports;