//express
const express = require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const app = express();
dotenv.config();


//routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

//custom modules


//templete engine
app.set("view engine","ejs");


//models

// app.use(kategori);



//middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('node_modules'));


app.use("/auth",authRoutes);
app.use("/",userRoutes);
app.use("/admin",adminRoutes);
// app.use("/",userRoutes);


app.listen(process.env.PORT || 30000 , () => {
    console.log(process.env.PORT,". port dinleniyor")
    mongoose
      .set("strictQuery", false)
      .connect(process.env.URI)
      .then(() => console.log("connected to db"))
      .catch((error) => console.log(error));
  });