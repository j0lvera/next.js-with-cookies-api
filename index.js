// index.js
// where your node app starts

// init project
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = require('isomorphic-unfetch');

const port = process.env.PORT || 3001;
const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(cookieParser())
app.use(bodyParser.json())

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
    response.send('<h1>Hello from Express on Now 2.0!</h1>');
    response.end();
});

app.post('/login', function(request, response, next) {  
  const url = `https://api.github.com/users/${request.body.username}`;
  
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    
      let error = new Error(response.statusText);
      next(error);
    })
    .then(data => response.json({ token: data.id }))
    .catch(error => console.error(error));
});


app.get('/profile', function(request, response, next) {
  const { token } = JSON.parse(request.get('authorization'));
    
  const url = `https://api.github.com/user/${token}`;
  
  console.log(url);
    
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    
      let error = new Error(response.statusText);
      error.response = response;
      next(error);
    })
    .then(data => response.json({ data }))
    .catch(error => console.error(error));
});

// listen for requests :)
app.listen(port, error => {
  if (error) throw error;
  console.log(`Your app is listening on port ${port}`);
});
