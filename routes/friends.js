var express = require('express');
var router = express.Router();

var API = require('./../api.js');
var MyAPI = API.Friends;

router.post('/sendRequest', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["fromUser", "toUser"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.SendRequest(Number(args.fromUser), Number(args.toUser), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/getPendingRequests', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["userId"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.GetPendingRequests(Number(args.userId), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/accept', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["toUser", "fromUser"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.Accept(Number(args.toUser), Number(args.fromUser), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/decline', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["toUser", "fromUser"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.Decline(Number(args.toUser), Number(args.fromUser), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

module.exports = router;
