const mongoose = require("mongoose");

const DBconnect = () => {
  try {
    mongoose.set('strictQuery',false)
    mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("connection sucessfull");
    
  } catch (error) {
    console.log("connection failed");
  }
};

DBconnect();
