var express = require('express');
var path = require('path');
var act = require('./routes/index.4.js');
var app = express();
var jsonFile = require('./public/cities.json');
var promise = require('promise');
var port = 8000;
var prefix = "https://weather.gc.ca/city/pages/";
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


act.removeAllData().then(function() {
    act.addData();

});


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get('/', function(req, res) {
    res.render("home.ejs");
});
app.get('/searching', act.getCity);
app.get('/query', act.repSubmit);
app.listen(port);
console.log("server is listening on " + port);
setInterval(function() {
    var now = new Date();
    if (now.getMinutes() === 07) {
        act.removeAllData().then(function() {
            act.addData();
        })
    }
}, 60000);