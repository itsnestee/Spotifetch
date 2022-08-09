//Dependencies
var express = require("express"); /* Load Express Dependency */
var app = express(); ///Create App 
var port = 8888; //port 
app.use(express.static('public')); //render web files to browser
console.log("Port Listening...")
app.listen(port);




