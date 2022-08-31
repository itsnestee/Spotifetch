import express from 'express'; //web app instantiation
import SpotifyWebApi from 'spotify-web-api-node';
var app = express(); // calling app


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

var port = 8888; //port 



var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://localhost:8888/callback/',
    clientId = '24ff0e4c598c4437947c77f5e3c80f70',
    clientSec = '1c097b67a17a42f293c680d46c766036',
    state = 'some-state-of-my-choice';


var spotifyApi = new SpotifyWebApi({ // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
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

    global.code = code;


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

            //console.log('access_token:', access_token);
            // console.log('refresh_token:', refresh_token);

            /* console.log(
                 `Sucessfully retreived access token. Expires in ${expires_in} s.`
             );
             */

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

    //access toke set in the global object
    res.redirect('/dashboard');

});


app.get('/dashboard', (req, res) => { //dasboard page after user authorisation

    var coded = req.query.code; //WHY IS IT NOT WORKING HERE?
    console.log(coded);

    /* spotifyApi.authorizationCodeGrant(coded)
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
 
                 spotifyApi.setAccessToken(access_token);
             }, expires_in / 2 * 1000);
         })
         .then(data => {
             const nestee = spotifyApi.getMe;
             console.log(nestee);
         })
         
 
         .catch(error => {
             console.error('Error getting Tokens:', error);
             //res.send(`Error getting Tokens: ${error}`);
         });
         */


    res.render('dashboard');
});



// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
//console.log(authorizeURL);


console.log("Port Listening...");
app.listen(port);



