var User = require('./models/user');
module.exports = function (app, passport) {
	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	app.get('/login', function (req, res)  {
		res.render('login.ejs', { 
			message: req.flash('loginMessage')
		});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function (req, res) {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});


	app.post('/register', passport.authenticate('local-signup'),
		function(req,res){

		console.log(req.user.local)	
		res.json(req.user.local)
	})
	



	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user
		});
	});



	app.get('/auth/linkedin',
		passport.authenticate('linkedin', {
			scope: ['r_basicprofile', 'r_emailaddress']
		}));

	app.get('/auth/linkedin/callback',
		passport.authenticate('linkedin', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));









	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}