var express = require('express'); //web app instantiation
var SpotifyWebApi = require('spotify-web-api-node');//library instantiation
var app = express(); // calling app


//app.use(express.static('public')); //rendering files to browser
app.set('view engine', 'ejs');

var port = 8888; //port 


var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://localhost:8888/callback/',
    clientId = '',
    clientSec = '',
    state = 'some-state-of-my-choice';


var spotifyApi = new SpotifyWebApi({ // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSec
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);// Create the authorization URL

app.get('/', (req, res) => { //Login request to user
    res.render('index');
    res.send("mhasgdf");
    res.redirect(authorizeURL);
})

app.get('/callback', (req, res) => {//if error give error if not get token
    var error = req.query.error;
    var code = req.query.code;
    var state = req.query.state;


    if (error) {
        console.error('Yoo Error:', error);
        res.send('Callback error: ${error}');
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];



            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );

            console.log(data.body); //Important


            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });

});
// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
//console.log(authorizeURL);


console.log("Port Listening...");
app.listen(port);



