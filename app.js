import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import morganLogger from "morgan";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import logger from "./config/logger/index.js";
global.__logger = logger;
import indexRouter from "./routes/index.js";

const app = express();

app.use(morganLogger(process.env.NODE_ENV));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send({
    message: err.message,
    code: err.status,
    data: err.data,
    error: true,
  });
});

export default app;
