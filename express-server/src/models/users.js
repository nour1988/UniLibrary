 //Creating and exporting a mongo schema of User 
module.exports = function(mongoose) {
    delete mongoose.connection.models['usermodel'];
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
        username:  String, 
        name: String,
        surname: String,
        password: Object,
        role: String,
    },{
        versionKey: false
    });    
    return mongoose.model('usermodel', UserSchema, 'users');
};


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:  String, 
    name: String,
    surname: String,
    password: String,
    role: String,
});
module.exports = mongoose.model('usermodel', UserSchema, 'users');*/