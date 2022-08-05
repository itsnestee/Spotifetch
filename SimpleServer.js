//Dependencies
var http = require("http"); /* Load HTTP Library*/
var express = require("express"); /* Load Express Dependency */

//App
var app = express(); /* Create App */

//Variable
var port = 8888; /* port */

app.set('view engine' , 'ejs');
app.use(express.static('public'))

/*Basic Routing server*/ 
app.get('/',(req, res) => {
    console.log("HTML OUT");

   // res.render("index"); //Response to browser
});


app.listen(port);


