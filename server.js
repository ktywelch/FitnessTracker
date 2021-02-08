const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const app = express();

app.use(logger("dev"));
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "workout";
const collections = ["workouts"];

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//APIs for Public
const clientRoutes = require('./routes/client_routes');
//APIs for internals
const apiRoutes = require('./routes/api_routes');

//apply the routes
clientRoutes(app);
apiRoutes(app);


app.listen(PORT, () => {
  console.log(`App running on PORT http://localhost:${PORT}`);
});
