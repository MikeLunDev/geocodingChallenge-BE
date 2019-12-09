const expess = require("express");
const markerRouter = require("./routes/markerRouter");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config()
const app = expess();

app.set("port",process.env.PORT || 3055 );
app.use(expess.json());

//white list for cors()
var whitelist = ["https://geocoding-markers-fe.herokuapp.com","http://localhost:3000"]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use("/markers",cors(corsOptions), markerRouter);
let connectDbUri;

switch (process.env.NODE_ENV) {
  case "test":
    connectDbUri = "mongodb://localhost:27017/testdb";
    break;
  case "development":
    connectDbUri = "mongodb://localhost:27017/markersdb";
    break;
  case "production":
    connectDbUri = process.env.CONNECT_STRING_DB;
    break;
  default:
    connectDbUri = "mongodb://localhost:27017/developdb";
    break;
}
mongoose
  .connect(connectDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(conn => {
    console.log("connected with", connectDbUri);
    console.log("url whitelisted",process.env.WHITE_LIST_ONLINE)
  })
  .catch(error => {
    console.log(error);
  });
  var connection = mongoose.connection
  connection.once("open",function(){
  app.listen(app.get("port"), () => {
    console.log("running on", app.get("port"));
  }) })
module.exports = { app };
