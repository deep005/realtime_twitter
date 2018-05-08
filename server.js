const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const config = require('./config/secret');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const cookieParser  = require('cookie-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.connect(config.database, function(err){
    if(err) 
        console.log(err);
    console.log("connected to the database");
})

//mongodb://<dbuser>:<dbpassword>@ds153494.mlab.com:53494/deeptwitter

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: new MongoStore({url:config.database, autoReconnect: true})
}));
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

require('./realtime/io')(io);

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');


app.use(mainRoutes);
app.use(userRoutes);


http.listen(3030, (err)=> {
    if(err) console.log(err);
    console.log(`Running on port ${3030}`);
});
