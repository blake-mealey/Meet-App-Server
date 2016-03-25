var API = {}

API.Users = {}

function API.Users.Register(name) {

}

function API.Users.GetId(name) {

}

function API.Users.GetInformation(userid) {

}

API.Friends = {}

function API.Friends.SendRequest(fromUser, toUser) {

}

function API.Friends.GetPendingRequests(userid) {

}

function API.Friends.Accept(userid1, userid2) {

}

function API.Friends.Decline(userid1, userid2) {

}

API.Meetups = {}

function API.Meetups.Create(creator, name, description, lat, lng) {

}

function API.Meetups.GetInformation(meetupid) {

}

function API.Meetups.GetPendingRequests(userid) {

}

module.exports = API