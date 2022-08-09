//Dependencies
var http = require("http"); /* Load HTTP Library*/
var express = require("express"); /* Load Express Dependency */
var querystring = require("node:querystring"); /* Load QueryString Parser/Stringyfier*/
const { Console } = require("console");

//my app credentials
var cId = '';
var cSec = '';
var URI = '';
var scopes = ''; //what do i need from user


var app = express(); ///Create App 

var port = 8888; //port 

app.use(express.static('public')); //render web files to browser


app.get('/login', (req, res) => { //request authorization to user aka client

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: cId,
            client_seecret: cSec,
            scope: scopes,
            redirect_uri: URI
        }));

    console.log("LoginFuncx");
});


app.get('/callback', (req, res) => {

    res.redirect('/#' + res.send("In"));

});

console.log("Port Listening...");
app.listen(port);


