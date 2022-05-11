/* Organize Date: 22/12/2021
*/
/**************PACKAGES*****************************************/
const express = require("express"); // require express
const https = require('https') //for HTTP
const fs = require('fs') //for https certificate
const path = require("path"); // path module
const route = require("./routes");//load the routes
const bodyParser = require('body-parser'); //post data 
const sessions = require('express-session'); //for session 
const MySQLStore = require('express-mysql-session')(sessions);
const cors = require("cors");
const passport = require('passport')// require the passport
require("./config/passport")(passport); 

/****************************************************************/


/* IMPORTANT EVENT!
   create the application
*/
const app = express();



//*******************Cors option******************//
var corsOptions = {
  origin: "http://localhost:8080"
};


app.use(cors(corsOptions)); 


/* ***********************Session setup ************************/
const dbOptions = require("./config/sessions/config");
const sessionStore = new MySQLStore(dbOptions); 

const {
	SESS_NAME = 'sid',
	SESS_SECRET = 'thisisthepropertyofcentsolution',
	SESS_LIFETIME = 1000 * 60 * 60 * 24,  //Session is 24 hours
} = process.env


const session_config = sessions({
      name: SESS_NAME,
      resave: false, 
      saveUninitialized: false,
      secret: SESS_SECRET,
      store: sessionStore, 
      cookie : {
        maxAge: SESS_LIFETIME,
      }
    })

app.use(session_config);

//this is for passport
/* Apply the passport as Session
    For Google Authentication
*/
app.use(passport.initialize());
app.use(passport.session());

/******************************************************************/


/******************SERVER*****************************************/
/* This is for the port and configuration on HTTPS
  [PORT INSIDE ENV ON SESSION]  
*/
const PORT = process.env.PORT ||  8000 ;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})


/* DEVELOPMENT PHASE WITH MANUAL SSL CERTIFICATE

   SSL certificate for to make https request all valid
*/
// const httpsOptions = {
//     key: fs.readFileSync('./security_certificate_https/cert.key'),
//     cert: fs.readFileSync('./security_certificate_https/cert.pem')
// }

/* Set up the server on the app
*/
// const server = https.createServer(httpsOptions, app)
//     .listen(port, () => {
//         console.log('listening to port ' + port)
//  })
/***********************************************************/


/*  Middle ware for Body Parser
*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

// all static content
app.use(express.static(path.join(__dirname, "./assets/")));

/* SET the view engine
*/
app.set('views', path.join(__dirname, './views'));

//views for user
app.set('views', path.join(__dirname, './views'));
app.set('views/user/ticket', path.join(__dirname, './views'));

app.set('view engine', 'ejs');// root route to render the index.ejs view

/*IMPORTANT
  Middle ware for route
*/
app.use(route);






