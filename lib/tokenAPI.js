/**
Created by Damian Villanueva
**/
var request = require('superagent');
require('superagent-proxy')(request);
var tokenEndPoint = 'https://www.pivotaltracker.com/services/v5/me';
var proxy = 'http://172.20.240.5:8080';


var getTrackerToken = function(userCredential, callback) {
    request
        .get(tokenEndPoint)
        .proxy(proxy)
        .auth(userCredential.userAccount, userCredential.userPassword)
        .end(function(err, res) {
            console.log('this is a username:    ', res.body.username);
            if (err) {
                console.log('error when getting the token ..' + JSON.stringify(res.body));
            } else {
                console.log('Token object..' + JSON.stringify(res.body));
                console.log('Token ..' + res.body.TokenString);
            }
            callback(res.body);
        });
};

exports.getTrackerToken = getTrackerToken;