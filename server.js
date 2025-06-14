'use strict';
require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use(cors());; //For FCC testing purposes only
//Use helmet to secure Express headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"],
    scriptSrc: ["'self'"],
    // Optionally, you can add 'imgSrc' and others as needed
  }
}));

app.use('/public', express.static(process.cwd() + '/public'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// app.use(helmet.xssFilter());
//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(404)
    .type('text')
    .send('Not Found');
});

app.route('/test-cors')
  .get(function(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.send('CORS is enabled for this route');
  });
//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
