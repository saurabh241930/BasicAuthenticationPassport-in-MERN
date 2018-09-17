var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({

    name: String,
    password: String,
    email: String,
    joined: Date


}, {
    usePushEach: true
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);