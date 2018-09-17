const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
var mongoose = require('mongoose')
var User = require('./models/user')
var LocalStrategy = require('passport-local')
var passport = require('passport')


app.use(require('express-session')({
    secret: "This is secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/linkedInProject', {
    useMongoClient: true,
});




app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => res.send("connected"))


app.post('/login',
    function (req, res, next) {
        console.log(req.body);
        next()
    },
    passport.authenticate('local'),
    function (req, res) {
        console.log(req.user)

        res.json(req.user);
    });


app.post('/register', (req, res) => {

    var user = {
        username: req.body.username,
        email: req.body.email,
        entries: 0,
        joined: new Date()
    }

    User.register(user, req.body.password, function (err, newUser) {
        if (err) {
            console.log(err);
            return res.send("error registering");
        } else {
            passport.authenticate("local")(req, res, function () {
                if (err) {
                    console.log(err);
                } else {
                    User.findById(newUser._id, function (err, data) {
                        if (err) {
                            console.log(err);

                        } else {
                            res.json(data)
                        }
                    })
                }

            })
        }

    })


})




app.listen(3001, () => console.log('app listening on port 3001!'))