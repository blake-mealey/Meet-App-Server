var express = require('express');
var router = express.Router();

var API = require('./../api.js');
var MyAPI = API.Users;

router.post('/clearDB', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, []);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.ClearDB(function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/register', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["name"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.Register(args.name, function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/getId', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["name"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.GetId(args.name, function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/getInformation', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["userId"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.GetInformation(Number(args.userId), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

module.exports = router;
