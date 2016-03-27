var API = require('./api');

var tests = [];

function test(name, test) {
	tests.push({
		"name": name,
		"func": test
	});
}

test("clear the users db", function(callback) {
	API.Users.ClearDB(function(err) {
		assertNull(err);

		callback();
	});
});

test("register users", function(callback) {
	API.Users.Register("Alma", function(err, id) {
		assertNull(err);
		assertEqual(id, 0);

		API.Users.Register("Alma", function(err, id) {
			assertNotNull(err);
			assertNull(id);

			API.Users.Register("Bert", function(err, id) {
				assertNull(err);
				assertEqual(id, 1);

				API.Users.Register("Candice", function(err, id) {
					assertNull(err);
					assertEqual(id, 2);

					API.Users.Register("David", function(err, id) {
						assertNull(err);
						assertEqual(id, 3);

						API.Users.Register("Elmo", function(err, id) {
							assertNull(err);
							assertEqual(id, 4);

							callback();
						});
					});
				});
			});
		});
	});
});

test("get user IDs", function(callback) {
	API.Users.GetId("Alma", function(err, id) {
		assertNull(err);
		assertEqual(id, 0);

		API.Users.GetId("Frederick", function(err, id) {
			assertNotNull(err);
			assertNull(id);

			API.Users.GetId("Bert", function(err, id) {
				assertNull(err);
				assertEqual(id, 1);

				API.Users.GetId("Candice", function(err, id) {
					assertNull(err);
					assertEqual(id, 2);

					API.Users.GetId("David", function(err, id) {
						assertNull(err);
						assertEqual(id, 3);

						API.Users.GetId("Elmo", function(err, id) {
							assertNull(err);
							assertEqual(id, 4);

							callback();
						});
					});
				});
			});
		});
	});
});

test("get user information", function(callback) {
	API.Users.GetInformation(0, function(err, info) {
		assertNull(err);
		assertNotNull(info);
		assertEqual(info.userId, 0);
		assertEqual(info.username, "Alma");
		assertEqual(info.friends.length, 0);
		assertEqual(info.meetups.length, 0);
		assertEqual(info.pendingFRs.length, 0);
		assertEqual(info.pendingMRs.length, 0);

		API.Users.GetInformation(5, function(err, info) {
			assertNotNull(err);
			assertNull(info);

			API.Users.GetInformation(1, function(err, info) {
				assertNull(err);
				assertNotNull(info);
				assertEqual(info.userId, 1);
				assertEqual(info.username, "Bert");
				assertEqual(info.friends.length, 0);
				assertEqual(info.meetups.length, 0);
				assertEqual(info.pendingFRs.length, 0);
				assertEqual(info.pendingMRs.length, 0);

				API.Users.GetInformation(2, function(err, info) {
					assertNull(err);
					assertNotNull(info);
					assertEqual(info.userId, 2);
					assertEqual(info.username, "Candice");
					assertEqual(info.friends.length, 0);
					assertEqual(info.meetups.length, 0);
					assertEqual(info.pendingFRs.length, 0);
					assertEqual(info.pendingMRs.length, 0);

					API.Users.GetInformation(3, function(err, info) {
						assertNull(err);
						assertNotNull(info);
						assertEqual(info.userId, 3);
						assertEqual(info.username, "David");
						assertEqual(info.friends.length, 0);
						assertEqual(info.meetups.length, 0);
						assertEqual(info.pendingFRs.length, 0);
						assertEqual(info.pendingMRs.length, 0);

						API.Users.GetInformation(4, function(err, info) {
							assertNull(err);
							assertNotNull(info);
							assertEqual(info.userId, 4);
							assertEqual(info.username, "Elmo");
							assertEqual(info.friends.length, 0);
							assertEqual(info.meetups.length, 0);
							assertEqual(info.pendingFRs.length, 0);
							assertEqual(info.pendingMRs.length, 0);

							callback();
						});
					});
				});
			});
		});
	});
});

test("two-way FR, one accepts", function(callback) {
	API.Friends.SendRequest(0, 1, function(err) {
		assertNull(err);

		API.Friends.SendRequest(1, 0, function(err) {
			assertNull(err);

			API.Friends.GetPendingRequests(0, function(err, pending) {
				assertNull(err);
				assertEqual(pending.length, 1);
				assertEqual(pending[0], 1);

				API.Friends.GetPendingRequests(1, function(err, pending) {
					assertNull(err);
					assertEqual(pending.length, 1);
					assertEqual(pending[0], 0);

					API.Friends.Accept(1, 0, function(err) {
						assertNull(err);

						API.Users.GetInformation(0, function(err, info) {
							assertNull(err);
							assertEqual(info.pendingFRs.length, 0);
							assertEqual(info.friends.length, 1);
							assertEqual(info.friends[0], 1);

							API.Users.GetInformation(1, function(err, info) {
								assertNull(err);
								assertEqual(info.pendingFRs.length, 0);
								assertEqual(info.friends.length, 1);
								assertEqual(info.friends[0], 0);

								callback();
							});
						});
					});
				});
			});
		});
	});
});

test("two-way FR, one declines, one accepts", function(callback) {
	API.Friends.SendRequest(2, 3, function(err) {
		assertNull(err);

		API.Friends.SendRequest(3, 2, function(err) {
			assertNull(err);

			API.Friends.GetPendingRequests(2, function(err, pending) {
				assertNull(err);
				assertEqual(pending.length, 1);
				assertEqual(pending[0], 3);

				API.Friends.GetPendingRequests(3, function(err, pending) {
					assertNull(err);
					assertEqual(pending.length, 1);
					assertEqual(pending[0], 2);

					API.Friends.Decline(3, 2, function(err) {
						assertNull(err);

						API.Friends.Accept(2, 3, function(err) {
							assertNull(err);

							API.Users.GetInformation(2, function(err, info) {
								assertNull(err);
								assertEqual(info.pendingFRs.length, 0);
								assertEqual(info.friends.length, 1);
								assertEqual(info.friends[0], 3);

								API.Users.GetInformation(3, function(err, info) {
									assertNull(err);
									assertEqual(info.pendingFRs.length, 0);
									assertEqual(info.friends.length, 1);
									assertEqual(info.friends[0], 2);

									callback();
								});
							});
						});
					});
				});
			});
		});
	});
});

test("clear the meetup db", function(callback) {
	API.Meetups.ClearDB(function(err) {
		assertNull(err);

		callback();
	});
});

test("create meetup", function(callback) {
	API.Meetups.Create(3, { "name": "test", "description": "words and stuff.", "time": "5:00PM" }, { "lat": 1.123, "lng": 2.456 }, function(err, id) {
		assertNull(err);
		assertEqual(id, 0);

		API.Meetups.Create(-1, { "name": "test", "description": "words and stuff.", "time": "5:00PM" }, { "lat": 1.123, "lng": 2.456 }, function(err, id) {
			assertNotNull(err);
			assertNull(id);

			callback();
		});
	});
});

test("get meetup information", function(callback) {
	API.Meetups.GetInformation(0, function(err, info) {
		assertNull(err);
		assertEqual(info.meetupId, 0);
		assertEqual(info.creatorId, 3);
		assertEqual(info.name, "test");
		assertEqual(info.description, "words and stuff.");
		assertEqual(info.time, "5:00PM");
		assertEqual(info.members.length, 1);
		assertEqual(info.members[0], 3);
		assertEqual(info.locations.length, 1);
		assertEqual(info.locations[0].lat, 1.123);
		assertEqual(info.locations[0].lng, 2.456);

		callback();
	});
});

test("send meetup requests", function(callback) {
	API.Meetups.SendRequest(0, 0, function(err) {
		assertNull(err);

		API.Meetups.SendRequest(-1, 0, function(err) {
			assertNotNull(err);

			API.Meetups.SendRequest(0, -1, function(err) {
				assertNotNull(err);

				API.Meetups.SendRequest(0, 1, function(err) {
					assertNull(err);

					callback();
				});
			});
		});
	});
});

test("get pending requests and accept/decline", function(callback) {
	API.Meetups.GetPendingRequests(0, function(err, pending) {
		assertNull(err);
		assertNotNull(pending);
		assertEqual(pending.length, 1);
		assertEqual(pending[0], 0);

		API.Meetups.GetPendingRequests(1, function(err, pending) {
			assertNull(err);
			assertNotNull(pending);
			assertEqual(pending.length, 1);
			assertEqual(pending[0], 0);

			API.Meetups.Decline(0, 0, function(err) {
				assertNull(err);

				API.Meetups.Accept(1, 0, { "lat": 3.789, "lng": 4.123 }, function(err) {
					assertNull(err);

					API.Meetups.GetPendingRequests(0, function(err, pending) {
						assertNull(err);
						assertNotNull(pending);
						assertEqual(pending.length, 0);

						API.Meetups.GetPendingRequests(1, function(err, pending) {
							assertNull(err);
							assertNotNull(pending);
							assertEqual(pending.length, 0);

							callback();
						});
					});
				});
			});
		});
	});
});

test("get meetup information", function(callback) {
	API.Meetups.GetInformation(0, function(err, info) {
		assertNull(err);
		assertEqual(info.meetupId, 0);
		assertEqual(info.creatorId, 3);
		assertEqual(info.name, "test");
		assertEqual(info.description, "words and stuff.");
		assertEqual(info.time, "5:00PM");
		assertEqual(info.members.length, 2);
		assertEqual(info.members[0], 3);
		assertEqual(info.members[1], 1);
		assertEqual(info.locations.length, 2);
		assertEqual(info.locations[0].lat, 1.123);
		assertEqual(info.locations[0].lng, 2.456);
		assertEqual(info.locations[1].lat, 3.789);
		assertEqual(info.locations[1].lng, 4.123);

		callback();
	});
});

test("close meetups", function(callback) {
	API.Meetups.Close(0, function(err) {
		assertNull(err);

		API.Meetups.Close(-1, function(err) {
			assertNotNull(err);

			callback();
		});
	});
});

/*

test("emptytest", function(callback) {
	API.XXX.YYY(function(err) {
		assertNull(err);

		callback();
	});
});

*/

var assertions = [];

function assertEqual(x, y) {
	if(x != y) {
		assertions.push({
			"x": x,
			"y": y,
			"type": " == "
		});
	}
}

function assertNull(x) {
	assertEqual(x, null);
}

function assertNotEqual(x, y) {
	if(x == y) {
		assertions.push({
			"x": x,
			"y": y,
			"type": " != "
		});
	}
}

function assertNotNull(x) {
	assertNotEqual(x, null);
}

function runTests(testIndex) {
	console.log();

	var currentTest = tests[testIndex];

	if(currentTest == null) {
		console.log("Finished testing.")
		return;
	}

	assertions = [];
	currentTest.func(function() {
		if(assertions.length == 0) {
			console.log("Passed test " + (testIndex + 1) + ": " + currentTest.name);
		} else {
			console.log("Failed test " + (testIndex + 1) + ": " + currentTest.name);
			for(var i = 0; i < assertions.length; i++) {
				var assertion = assertions[i];
				console.log("Assertion error: " + assertion.x + assertion.type + assertion.y);
			}
		}

		runTests(testIndex + 1);
	});
}

runTests(0);