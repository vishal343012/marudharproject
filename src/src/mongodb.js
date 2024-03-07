const { mongo_config } = require("./config/config");

const mongoose = require("mongoose");
mongoose.promise = Promise;

mongoose.connection.on('error',(err)=>{
  console.log(err)
  process.exit(-1)
})

exports.connect=()=>{
  mongoose
  .connect(mongo_config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
    serverSelectionTimeoutMS:5000,
    maxPoolSize:10, 
    socketTimeoutMS:45000,
    family:4,
   
  })
  .then(() => console.log("MongoDB Connected..."))
  return mongoose.connection;
}

// const connect = mongoose
//   .connect(mongo_config.mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false, 
//     keepAlive:true,
//   })
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => console.log(err));

// module.exports = connect;


