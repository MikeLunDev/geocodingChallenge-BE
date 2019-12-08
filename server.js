const expess = require("express");
const markerRouter = require("./routes/markerRouter");
const mongoose = require("mongoose");
const cors = require("cors");
const app = expess();

app.set("port", 3055 || process.env.PORT);
app.use(expess.json());
app.use(cors());
app.use("/markers", markerRouter);
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
  })
  .catch(error => {
    console.log(error);
  });
app.listen(app.get("port"), () => {
  console.log("running on", app.get("port"));
});

module.exports = { app };
