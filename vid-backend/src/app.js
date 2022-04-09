const express = require('express');
const compression = require("compression");
// to allow sharing of files, styles etc
const cors = require("cors")
const httpStatus = require("http-status");
const config = require("./config/config")
// The format function will be called with three arguments tokens, req, and res, where tokens is an object with all defined tokens, req is the HTTP request and res is the HTTP response. 
const morgan = require("./config/morgan")
const helmet = require("helmet")
const routes = require("./routes/v1")
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");


const app = express();

if(config.env!=="test"){
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}


// set security HTTP headers - https://helmetjs.github.io/
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// gzip compression
app.use(compression());


// enable cors
app.use(cors());
app.options("*", cors());

// Reroute all API request starting with "/v1" route
app.use("/v1",routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

