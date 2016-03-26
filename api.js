var MongoClient = require('mongodb').MongoClient;
var config = require('./server_config');

var API = {}

API.Errors = {
	"DatabaseError": "database_error",
	"InvalidArguments": "invalid_arguments",
	"UserDNE": "user_dne",
	"MeetupDNE": "meetup_dne",
	"UserExists": "user_exists",
	"InvalidAPIKey": "invalid_api_key",
	"InvalidFriendAssociation": "invalid_friend_association"
}

API.ValidateRequest = function(req, args) {
	if(req.apiKey != config.api_key) {
		return API.Errors.InvalidAPIKey;
	} else {
		for(var i = 0; i < args.length; i++) {
			if(req[args[i]] == null) {
				return API.Errors.InvalidArguments;
			}
		}
	}
	return null;
}

API.ConstructResponse = function(err, result) {
	var res = {
		"ok": err == null,
		"error": err,
		"result": result
	}
	return res;
}

API.Users = {}

API.Users.ClearDB = function(callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").remove({}, function(err, results) {
			if(err != null) { callback(API.Errors.DatabaseError); return; }

			db.close();
			callback(null);
		});
	});
}

API.Users.Register = function(name, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").count(
			{ "username": name },
			function(err, count) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(count != 0) {
					db.close();
					callback(API.Errors.UserExists);
				} else {
					db.collection("users").count({}, function(err, count) {
						if(err != null) { callback(API.Errors.DatabaseError); return; }

						var user = {
							"username": name,
							"friends": [],
							"meetups": [],
							"userId": count,
							"pendingFRs": [],
							"pendingMRs": []
						}

						db.collection("users").insertOne(user, function(err, results) {
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							db.close();
							callback(null, count);
						});
					});
				}
			}
		);
	});
}

API.Users.GetId = function(name, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "username": name },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				if(user == null) {
					callback(API.Errors.UserDNE);
				} else {
					callback(null, user.userId);
				}
			}
		);
	});
}

API.Users.GetInformation = function(userId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": userId },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				if(user == null) {
					callback(API.Errors.UserDNE);
				} else {
					callback(null, user)
				}
			}
		);
	});
}

API.Friends = {}

API.Friends.SendRequest = function(fromUser, toUser, callback) {
	if(fromUser == toUser) {
		callback(API.Errors.InvalidFriendAssociation);
	} else {
		MongoClient.connect(config.db_url, function(err, db) {
			if(err != null) { callback(API.Errors.DatabaseError); return; }

			db.collection("users").findOne(
				{ "userId": toUser, "pendingFRs": { $nin: [fromUser] }, "friends": { $nin: [fromUser] } },
				function(err, user) {
					if(err != null) { callback(API.Errors.DatabaseError); return; }

					if(user == null) {
						db.close();
						callback(API.Errors.UserDNE);
					} else {
						db.collection("users").updateOne(
							{ "userId": toUser },
							{ $push: { "pendingFRs": fromUser } },
							function(err, results) {
								if(err != null) { callback(API.Errors.DatabaseError); return; }

								db.close();
								callback(null);
							}
						);
					}
				}
			);
		});
	}
}

API.Friends.GetPendingRequests = function(userId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": userId },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				if(user == null) {
					callback(API.Errors.UserDNE);
				} else {
					callback(null, user.pendingFRs);
				}
			}
		);
	});
}

API.Friends.Accept = function(toUser, fromUser, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": toUser, "pendingFRs": { $in: [fromUser] } },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(user == null) {
					db.close();
					callback(API.Errors.UserDNE);
				} else {
					db.collection("users").updateOne(
						{ "userId": toUser },
						{ $pull: { "pendingFRs": fromUser }, $push: { "friends": fromUser } },
						function(err, results) {
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							db.collection("users").updateOne(
								{ "userId": fromUser },
								{ $pull: { "pendingFRs": toUser }, $push: { "friends": toUser } },
								function(err, results) {
									if(err != null) { callback(API.Errors.DatabaseError); return; }

									db.close();
									callback(null);
								}
							);
						}
					);
				}
			}
		);
	});
}

API.Friends.Decline = function(toUser, fromUser, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		console.log(err);
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": toUser, "pendingFRs": { $in: [fromUser] } },
			function(err, user) {
				console.log(err);
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(user == null) {
					db.close();
					callback(API.Errors.UserDNE);
				} else {
					db.collection("users").updateOne(
						{ "userId": toUser },
						{ $pull: { "pendingFRs": fromUser } },
						function(err, results) {
							console.log(err);
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							db.close();
							callback(null);
						}
					);
				}
			}
		);
	});
}

API.Meetups = {}

API.Meetups.ClearDB = function(callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("meetups").remove({}, function(err, results) {
			if(err != null) { callback(API.Errors.DatabaseError); return; }

			db.close();
			callback(null);
		});
	});
}

API.Meetups.Create = function(creator, info, location, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("meetups").count({}, function(err, count) {
			if(err != null) { callback(API.Errors.DatabaseError); return; }

			var meetup = {
				"meetupId": count,
				"creatorId": creator,
				"name": info.name,
				"description": info.description,
				"time": info.time,
				"members": [creator],
				"locations": [location]
			}

			db.collection("meetups").insertOne(meetup, function(err, results) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				callback(null, count);
			});
		});
	});
}

API.Meetups.Close = function(meetupId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("meetups").removeOne(
			{ "meetupId": meetupId },
			function(err, results) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.collection("users").updateMany(
					{ $or: [{ "meetups": { $in: [meetupId] } }, { "pendingMRs": { $in: [meetupId] } }] },
					{ $pull: { "meetups": meetupId, "pendingMRs": meetupId } },
					function(err, results) {
						if(err != null) { callback(API.Errors.DatabaseError); return; }

						db.close();
						callback(null);
					}
				);
			}
		);
	});
}

API.Meetups.GetInformation = function(meetupId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("meetups").findOne(
			{ "meetupId": meetupId },
			function(err, meetup) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				if(meetup == null) {
					callback(API.Errors.MeetupDNE);
				} else {
					callback(null, meetup);
				}
			}
		);
	});
}

API.Meetups.SendRequest = function(meetupId, toUser, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("meetups").findOne(
			{ "meetupId": meetupId },
			function(err, meetup) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(meetup == null) {
					db.close();
					callback(API.Errors.MeetupDNE);
				} else {
					db.collection("users").findOne(
						{ "userId": toUser, "meetups": { $nin: [meetupId] }, "pendingMRs": { $nin: [meetupId] } },
						function(err, user) {
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							if(user == null) {
								db.close();
								callback(API.Errors.UserDNE);
							} else {
								db.collection("users").updateOne(
									{ "userId": toUser },
									{ $push: { "pendingMRs": meetupId } },
									function(err, results) {
										if(err != null) { callback(API.Errors.DatabaseError); return; }

										callback(null);
									}
								);
							}
						}
					);
				}
			}
		);
	});
}

API.Meetups.GetPendingRequests = function(userId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": userId },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				db.close();
				if(user == null) {
					callback(API.Errors.UserDNE);
				} else {
					callback(user.pendingMRs);
				}
			}
		);
	});
}

API.Meetups.Accept = function(toUser, meetupId, location, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": toUser, "pendingMRs": { $in: [meetupId] } },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(user == null) {
					db.close();
					callback(API.Errors.UserDNE);
				} else {
					db.collection("users").updateOne(
						{ "userId": toUser },
						{ $pull: { "pendingMRs": meetupId }, $push: { "meetups": meetupId } }
						function(err, results) {
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							db.collection("meetups").updateOne(
								{ "meetupId": meetupId },
								{ $push: { "members": toUser, "locations": location } },
								function(err, results) {
									if(err != null) { callback(API.Errors.DatabaseError); return; }

									callback(null);
								}
							);
						}
					);
				}
			}
		);
	});
}

API.Meetups.Decline = function(toUser, meetupId, callback) {
	MongoClient.connect(config.db_url, function(err, db) {
		if(err != null) { callback(API.Errors.DatabaseError); return; }

		db.collection("users").findOne(
			{ "userId": toUser, "pendingMRs": { $in: [meetupId] } },
			function(err, user) {
				if(err != null) { callback(API.Errors.DatabaseError); return; }

				if(user == null) {
					db.close();
					callback(API.Errors.UserDNE);
				} else {
					db.collection("users").updateOne(
						{ "userId": toUser },
						{ $pull: { "pendingMRs": meetupId } }
						function(err, results) {
							if(err != null) { callback(API.Errors.DatabaseError); return; }

							callback(null);
						}
					);
				}
			}
		);
	});
}

module.exports = API