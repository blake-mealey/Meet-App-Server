var express = require('express');
var router = express.Router();

var API = require('./../api.js');
var MyAPI = API.Meetups;

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

router.post('/create', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["creator", "info", "location"]);
	if(!err) err = API.ValidateRequest(args.info, ["name", "description", "time"], true);
	if(!err) err = API.ValidateRequest(args.location, ["lat", "lng"], true);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		var location = {
			lat: Number(args.location.lat),
			lng: Number(args.location.lng)
		}
		MyAPI.Create(args.creator, args.info, location, function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/close', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["meetupId"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.Close(Number(args.meetupId), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/getInformation', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["meetupId"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.GetInformation(Number(args.meetupId), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/sendRequest', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["meetupId", "toUser"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.SendRequest(Number(args.meetupId), Number(args.toUser), function(err, result) {
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
	var err = API.ValidateRequest(args, ["toUser", "meetupId", "location"]);
	if(!err) err = API.ValidateRequest(args.location, ["lat", "lng"], true);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		var location = {
			lat: Number(args.location.lat),
			lng: Number(args.location.lng)
		}
		MyAPI.Accept(Number(args.toUser), Number(args.meetupId), location, function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

router.post('/decline', function(req, res, next) {
	var args = req.body;
	console.log(args);
	var err = API.ValidateRequest(args, ["toUser", "meetupId"]);
	if(err) {
		res.json(API.ConstructResponse(err, null));
	} else {
		MyAPI.Decline(Number(args.toUser), Number(args.meetupId), function(err, result) {
			res.json(API.ConstructResponse(err, result));
		});
	}
});

module.exports = router;
