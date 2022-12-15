import express from "express";
import * as bodyParser from "body-parser";

require("dotenv").config();

const cors = require("cors");


const app = express();

function errorHandler(err, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//require("./routes/routes")(app);
app.use(errorHandler);

export default app;
