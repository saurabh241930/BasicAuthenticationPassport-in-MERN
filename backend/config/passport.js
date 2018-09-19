var LocalStrategy = require('passport-local').Strategy;
var LinkedinStrategy = require('passport-linkedin').Strategy;


var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function (passport) {


	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			process.nextTick(function () {
				User.findOne({
					'local.username': email
				}, function (err, user) {
					if (err)
						return done(err);
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					} else {
						var newUser = new User();
						newUser.local.username = email;
						newUser.local.password = newUser.generateHash(password);

						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser); 
                         

						})
					}
				})

			});
		}));



	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			process.nextTick(function () {
				User.findOne({
					'local.username': email
				}, function (err, user) {
					if (err)
						return done(err);
					if (!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if (!user.validPassword(password)) {
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);

				});
			});
		}
	));


	


	passport.use(new LinkedinStrategy({
		consumerKey: configAuth.linkedinAuth.consumerKey,
		consumerSecret: configAuth.linkedinAuth.consumerSecret,
		callbackURL: configAuth.linkedinAuth.callbackURL,
		profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
	},
		function (token, tokenSecret, profile, done) {
			process.nextTick(function () {
				User.findOne({
					'linkedin.id': profile.id
				}, function (err, user) {
					if (err)
						return done(err);
					if (user)
						return done(null, user);
					else {
						console.log(profile);

						var newUser = new User();
						newUser.linkedin.id = profile.id;
						newUser.linkedin.token = token;
						newUser.linkedin.tokenSecret = tokenSecret;
						newUser.linkedin.firstName = profile._json.firstName;
						newUser.linkedin.lastName = profile._json.lastName;
						newUser.linkedin.emailAdress = profile._json.emailAdress;
						newUser.linkedin.headline = profile._json.headline;





						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						})




					}
				})
			})
		}))


}