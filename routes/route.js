var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var config = require('config');
var debug = require('debug')('route');

var Model = require('../models/model');

var index = function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.render('index', {title: 'Home'});
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        res.render('index', {title: 'Home', user: user});
    }
};

var indexPost = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({"status":"ERROR", "msg":"You are not authorized."});
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }
    }
};

var login = function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');

    res.render('login', {title: 'Login'});
};

var loginPost = function (req, res, next) {
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}, function (err, user, info) {
        if (err) {
            return res.render('login', {title: 'Login', errorMessage: err.message});
        }
        if (!user) {
            return res.render('login', {title: 'Login', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('login', {title: 'Login', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

var registration = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('registration', {title: 'Registration'});
    }
};

var registrationPost = function (req, res, next) {
    var user = req.body;

    var usernamePromise = new Model.User({username: user.username}).fetch();

    return usernamePromise.then(function (model) {
        if (model) {
            res.render('registration', {title: 'Registration', errorMessage: 'Username already exists'});
        } else {
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var registerUser = new Model.User({
                username: user.username,
                password: hash,
                email: user.email
            });
            registerUser.save().then(function (model) {
                loginPost(req, res, next);
            });
        }
    });
};

var profile = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.render('login', {title: 'Login'});
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        res.render('profile', {title: 'Profile', user: user});
    }
};

var logout = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        //notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/login');
    }
};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};





module.exports.index = index;
module.exports.indexPost = indexPost;

module.exports.login = login;
module.exports.loginPost = loginPost;

module.exports.registration = registration;
module.exports.registrationPost = registrationPost;

module.exports.profile = profile;

module.exports.logout = logout;

module.exports.notFound404 = notFound404;