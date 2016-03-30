var API = require('./api');

var alma;
var bert;
var cuthbert;
var drake;
var elrond;

var meet1;
var meet2;
var meet3;

function setupUsers() {
	API.Users.ClearDB(function() {
		API.Meetups.ClearDB(function() {
			API.Users.Register("Alma", function(id) {
				alma = id;
				API.Users.Register("Bert", function(id) {
					bert = id;
					API.Users.Register("Cuthbert", function(id) {
						cuthbert = id;
						API.Users.Register("Drake", function(id) {
							drake = id;
							API.Users.Register("Elrond", function(id) {
								elrond = id;

								setupFriends();
							});
						});
					});
				});
			});
		});
	});
}

function setupFriends() {
	API.Friends.SendRequest(alma, bert, function() {
		API.Friends.SendRequest(alma, cuthbert, function() {
			API.Friends.SendRequest(alma, drake, function() {
				API.Friends.SendRequest(elrond, alma, function() {
					API.Friends.Accept(bert, alma, function() {
						API.Friends.Accept(cuthbert, alma, function() {
							API.Friends.Accept(drake, alma, function() {
								setupMeetups();
							});
						});
					});
				});
			});
		});
	});
}

function setupMeetups() {
	API.Meetups.Create(alma, 
			{"name":"Final project discussion", "description":"Let's have a quick talk face-to-face about who will do what for the final project.", "time":"10:15"},
			{"lat":51.076915,"lng":-114.140947}, function(id) {

		meet1 = id;

		API.Meetups.Create(cuthbert, 
				{"name":"Hangout", "description":"Wanna hang out?", "time":"19:00"},
				{"lat":51.035885,"lng":-114.056253}, function(id) {
					
			meet2 = id;

			API.Meetups.Create(drake, 
					{"name":"Coffee?", "description":"Or something.", "time":"12:30"},
					{"lat":51.035885,"lng":-114.056253}, function(id) {
						
				meet3 = id;

				API.Meetups.SendRequest(meet1, bert, function() {
					API.Meetups.SendRequest(meet1, cuthbert, function() {
						API.Meetups.SendRequest(meet1, drake, function() {
							API.Meetups.SendRequest(meet1, elrond, function() {
								API.Meetups.SendRequest(meet2, alma, function() {
									API.Meetups.SendRequest(meet2, cuthbert, function() {
										API.Meetups.SendRequest(meet3, alma, function() {
											API.Meetups.Accept(alma, meet2, {"lat":51.035885,"lng":-114.056253}, function() {
												// done?
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}

setupUsers();