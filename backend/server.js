const multer = require("multer");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Upload folder
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Multer setup
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }

});


const upload = multer({ storage });


// Serve uploads
app.use(
  "/uploads",
  express.static(uploadDir)
);


// Serve frontend
app.use(
  express.static(path.join(__dirname, "../"))
);


// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err)=>{
  console.log(err);
});



// Home Page

app.get("/", (req,res)=>{

  res.sendFile(
    path.join(__dirname,"../index.html")
  );

});




// Appointment Schema

const AppointmentSchema = new mongoose.Schema({

  name:String,
  phone:String,
  department:String,
  date:String,
  reason:String,
  report:String

});


const Appointment =
mongoose.model(
  "Appointment",
  AppointmentSchema
);





// Contact Schema

const ContactSchema = new mongoose.Schema({

 email:String,
 message:String

});


const Contact =
mongoose.model(
 "Contact",
 ContactSchema
);





// Appointment API

app.post("/appointment", async(req,res)=>{

try{


const appointment =
new Appointment(req.body);


await appointment.save();



res.json({

success:true,

message:"Appointment saved successfully"

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});





// Contact API

app.post("/contact", async(req,res)=>{

try{


const contact =
new Contact(req.body);


await contact.save();



res.json({

success:true,

message:"Message sent successfully"

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});






// Upload API

app.post(
"/upload",
upload.single("file"),
(req,res)=>{


try{


res.json({

success:true,

filename:req.file.filename,

path:
`/uploads/${req.file.filename}`


});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});







// Render Port

const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{


console.log(
`Server running on port ${PORT}`
);


});
