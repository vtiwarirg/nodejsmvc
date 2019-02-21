const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

require('./config/passport');
// Set up the express app
const app = express();

//Middleware for CORS
app.use(cookieParser());
app.use(cors());
const CONFIG = require('./server/config/config');
// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ limit: "250mb", extended: true }));
app.use(bodyParser.json({ limit: "250mb" }));

//Models
var models = require('./server/models');

models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database');
}).catch(err => {
    console.error('Unable to connect to SQL database');
});

if (CONFIG.app === 'dev') {
    models.sequelize.sync();
}

//Passport
app.use(passport.initialize());

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;