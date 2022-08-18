//Dependencies
var http = require("http"); /* Load HTTP Library*/
var express = require("express"); /* Load Express Dependency */
var querystring = require("node:querystring"); /* Load QueryString Parser/Stringyfier*/
var cors = require('cors'); //cross platform security 
var cookieParser = require('cookie-parser'); //placed in middleware to deconstruct cookies


//my app credentials
var cId = '';
var cSec = '';
var URI = '';
var scopes = 'user-read-private user-read-email'; //what do i need from user


var generateRandomString = function (length) { //state generator
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


var stateKey = 'spotify_auth_state'; //Key placed in cookie

var app = express(); //Create App 
app.use(cors());
app.use(cookieParser());

var port = 8888; //port 

app.use(express.static('public')); //render web files to browser


app.get('/login', (req, res) => { //request authorization to user aka client

    var state = generateRandomString(16); //state generated
    res.cookie(stateKey, state); //creates cookie 

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: cId,
            client_seecret: cSec,
            scope: scopes,
            redirect_uri: URI,
            state: state
        }));

    console.log("LoginFuncx");
});


app.get('/callback', (req, res) => { //after getting authorization we get token to get all needed end points

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) //checker if the STATE from both communications are correct
    {
        res.redirect('/#' + querystring.stringify({
            error: 'state mismatch'
        }));
    } else { //When correct clear cookie and send request to spotify for Token in a JSON version
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic' + Buffer.from(cId + ':' + cSec).toString('base64')
            },
            json: true
        };
    }

    res.send('How can i tell html to show Spotipanel');
});

console.log("Port Listening...");
app.listen(port);


