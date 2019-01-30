'use strict';
const express = require('express');
const app = express();
const routes = require('./routes');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require("mongoose");

//---Middleware
app.use(logger('dev'));
app.use(jsonParser());
    // allow requests to this API from any domain, from the browser
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE');
        return res.statusCode(200).json({});
    }
    next();
});

//---Database
mongoose.connect("mongodb://localhost:27017/qa", { useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("db connection successful");
});

//---Routes
app.use('/questions', routes);

//---Error handling
    // 404
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

//---Port declaring and server listening
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});