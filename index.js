const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const database = require("./models/config");
const travels = require("./models/config");
const travelsearchdetails = require("./models/searchform");
const users = require("./models/users.js");
const reset = require("./models/searchform");
const recipt = require("./models/recipt.js");
const bodyParser      = require("body-parser");
const methodOverride  = require("method-override");
const bcrypt = require('bcryptjs');
const fast2sms = require('fast-two-sms');
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const session = require('express-session')
const flash = require('express-flash');



// database connection

main().then((res)=>{
  console.log(" database connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
 
}



// --------------app is using middlewares are functions before server and after clients browsing-------------//
app.use(session({
  secret:"key",
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:600000
  }
}));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(flash());
 


// --------------app is setting-------------//

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname,"views"));




//-----------base route starts from here--------//

app.get("/",(req,res)=>{
  res.redirect("/login");
});

//----------------this is for first user visit to the  login page----------------//

app.get("/login",(req,res)=>{

  res.render("login",{messages:req.flash()});

});
//-----------------this is for user post their data to the database after login if data not registered in database going to the register
app.post("/login", async(req,res)=>{


    const data = {
      name:req.body.name,
      password:req.body.password,
    }
    const check = await users.findOne({name:req.body.name});
    console.log(check);
    if(!check){
      res.render("notreg");
    }
    else if(check.password == req.body.password){
      res.render("home",{check});
    }
    else  {
   res.render("wrongpass");
    }

});
 
//---------this is for after wrong password enter ok btn going to login page-------//
app.post("/wrongpass", (req,res)=>{
  res.redirect("/login");
});
//--------this is for not registerd-------//
app.post("/notregister",(req,res)=>{
  res.redirect("/register");
})






//-----------this route is showing register page to the user-----------//

app.get("/register",async(req,res)=>{
  
  res.render("register");

});

//----------------actually this post route post user data to the database-----//
app.post("/register",async(req,res)=>{
  const data = {
    name:req.body.name,
    password:req.body.password,
    mob_no:req.body.mob_no,
  }
  console.log(data);
  const check = await users.findOne({name:req.body.name});
  if(check){
    res.render("existuser");

  }else if(data.mob_no<10){
    res.send("Invalid phone number");
  }
  
  else{
    const datainsertion = await users.insertMany(data);
    res.render("login");
  }
   
});
//-----------------this is for existing user----------//
app.post("/existuser",(req,res)=>{
  res.redirect("/login");
});


//------------------this is for logout route--------------------//
app.get("/logout", async(req,res)=>{
  res,redirect("/login");
});
 

///------------------------this is for home page route--------------------//

app.get("/home",(req,res)=>{
  
  res.render("home");
});
app.post("/home",(req,res)=>{
  
});

// ----------- this is for bus agent registrations---------------//
app.get("/bus_agent_registration",(req,res)=>{
  res.render("bus_register");

});
app.post("/bus_agent_registration", async(req,res)=>{
  const data = {
    v_name:req.body.v_name,
    v_number:req.body. v_number,
    v_driver_name:req.body.v_driver_name,
    dr_mob_no:req.body.dr_mob_no,
    alt_mob_no:req.body.alt_mob_no,
    from:req.body.from,
    to:req.body.to,
    departure_time:req.body.departure_time,
    Arrival_time:req.body.Arrival_time,
    Duration:req.body.Duration,
    Rating:req.body.Rating,
    Amount:req.body.Amount,


  };
  console.log(data);
  const vechicledata =await travels.insertMany(data);
  res.render("bus_register");
});

// --------------this is search form deails -------------//
app.get("/travelsearchdetails", async(req,res)=>{
  
  let id = travels.id;
  res.render("home");

});
app.post("/travelsearchdetails",async(req,res)=>{
  let {id , name} = req.params;
 // console.log(id);
  let searchformdetails = {
    from:req.body.from,
    to:req.body.to,
    
  };
 const insertrides = await users.insertMany({name:name},{"from": req.body.from ,"to": req.body.to}); 
  console.log(insertrides);
 
  const findrides = await travels.find({"from": req.body.from ,"to": req.body.to}); 


   // console.log(findrides);
    if(findrides){
      res.render("showvechicles.ejs", {findrides });

    }
    else{
      res.render("showvechicles.ejs", {findrides});

    }
  
      //res.render("showvechicles.ejs", {findrides});
    //  
    
});

// --------------this is for showing vechicles after search-----------//
app.get("/showvechicles", async(req,res)=>{
  

  res.render("showvechicles");
  
});
app.post("/showvechicles", async(req,res)=>{

 
  res.render("travel_seats");

});
//--------------this is for select seats--------//

app.get("/sendSelectedDivs", async(req,res)=>{
  res.render("travel_seats");
});
app.post('/sendSelectedDivs', async(req, res) => {
  const  selectedDivs  = req.body;
  const id = req.params;

  console.log('Selected divs:', selectedDivs,id);
  

  const selected_seat = await users.findOneAndUpdate({selected_seats:req.body.selectedDivs});
  console.log(selected_seat._id);
  //const location = await users.find({from:selected_seat.from});
  ///console.log(location);
  
  res.render("details",{selected_seat,id});
  
});
//----------this is for fill user details----------//
app.get("/details", async(req,res)=>{
  const id = req.params;
  const selected_seat = await users.findOneAndUpdate({selected_seats});
  console.log(selected_seat);
  console.log(id);
  res.render("details" , {selected_seat,id});
});
 

app.post("/details", async(req,res)=>{
  //const amount =await travels.findOne(Amount);
  //console.log(amount);
  let { id } = req.params;
  console.log(id);
  const session = await stripe.checkout.sessions.create({
  line_items: [
    {
    price_data:{
      currency:"usd",
      product_data:{
        name:"Travel Amount"
      },
      unit_amount:50 * 100
      
    },
    quantity:1
  }
  ],
    mode:"payment",
    success_url:`${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${process.env.BASE_URL}/cancel`
  })
  res.redirect(session.url)
  console.log(session);
});

//--------------this is after payment successfull-------------//


app.get("/complete", async(req,res)=>{
  const session = await
   stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log(session);

   res.render("recipt");

});
app.post("/complete",(req,res)=>{
  res.redirect("/");

})
  
//----------- this is for payment if failed--------------------//
app.get("/cancel",(req,res)=>{
  res.render("cancel");
});
app.post("/cancel",(req,res)=>{
  res.redirect("/sendSelectedDivs");

})


//-----------this is for about us-----------//
app.get("/about",(req,res)=>{
  res.render("about");
});

app.get("/busbook", (req,res)=>{
   const check1 = req.params;console.log(check1);
   const check = check1.password;
   console.log(check);
   //res.render("home",{check});
});
 
app.get("/admin" , (req,res)=>{
  res.render("admin");
});
app.post("/admin",(req,res)=>{
  let inputs = req.params;
  console.log(inputs);
  if(req.body.name == "admin"){
    res.render("bus_register");
  }

});
app.get("/kk",(req,res)=>{
  res.render("review");
});
app.post("/kk",(req,res)=>{
  res.redirect("/");
})
app.get("/ticketcancel", (req,res)=>{
  res.render("ticketcancel.ejs")
});
app.post("/ticketcancel",(req,res)=>{
  res.render("login");
})

 




app.get("/forgot",(req,res)=>{
  res.render("forgot");
});
app.post("/forgot", async(req,res)=>{
  let info = req.body.name;
  let infopassword = req.body.password;
  const resetpass = await users.findOneAndUpdate({name:info},{password:infopassword});
  console.log(resetpass)
  res.render("login");
});


app.listen(3000,(req,res)=>{
  console.log("server is connected");
});