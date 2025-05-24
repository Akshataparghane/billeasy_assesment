const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3000;
const mongodburl = process.env.MONGODB_URL;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    mongodburl,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(PORT, function () {
  console.log("Express app running on port " + (PORT));
});
