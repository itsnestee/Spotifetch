
import express from 'express'; //web app instantiation
import SpotifyWebApi from 'spotify-web-api-node';
//import path from 'path';
var app = express(); // calling app



app.set('views', './views');
app.set('view engine', 'ejs');

//Not working properly for now, so directly styling on HTMLs
app.use(express.static('public'));
app.use(express.static('public'));


var port = 8888; //port 



var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://localhost:8888/callback/',
    redirectUri = 'http://localhost:8888/dashboard/',
    clientId = '',
    clientSec = '',
    state = 'some-state-of-my-choice';


var spotifyApi = new SpotifyWebApi({ // Setting credentials can be done in the wrapper's constructor, or using the API object setters.
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSec
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);// Create the authorization URL

app.get('/', (req, res) => {
    res.render('login'); //this routes to my initial page
})

app.get('/login', (req, res) => { //Login request to user


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

    spotifyApi //handles all the exange between code <--> access token
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);


            setInterval(async () => { //function that after 1H it activates
                const data = await spotifyApi.refreshAccessToken(); //handles the refreshing of the token
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


    res.redirect('/dashboard');

});

app.get('/dashboard', (req, res) => {
    var error = req.query.error;
    var coded = req.query.code;
    var state = req.query.state;



    spotifyApi.authorizationCodeGrant(coded)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            (async () => {

                //requesting endpoints
                const nestee = await spotifyApi.getMe()
                const category = await spotifyApi.getUserPlaylists();
                //Get tracks based on playlist after search button callback

                res.render('dashboard', {
                    user: nestee.body.display_name,

                    genre1: category.body.items.at(0).name,
                    genre2: category.body.items.at(1).name,
                });




            })().catch(e => {
                console.error(e);
            });


        });


});

console.log("Port Listening...");
app.listen(port);



