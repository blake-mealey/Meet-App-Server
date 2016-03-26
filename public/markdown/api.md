# Meet-App API

## Types

	MeetupID: int
	UserID: int
	Location: { lat: double, lng: double}
	MeetupInfo: { name: String, description: String, time: String }

## Errors
	
	database_error
		An error occurred while performing a database operation
	invalid_arguments
		Incorrect argument types were passed
	user_dne
		No user existed for a given userID
	meetup_dne
		No meetup existed for a given meetupID
	user_exists
		A user already exists with that name
	invalid_api_key
		The provided API key is invalid
	invalid_friend_association
		You tried to send a FR from a user to itself

## API Usage

Every API method returns a JSON object of the following form:

	ok : bool
	error : String
	result : variable

Where `ok` denotes whether there is a `result` and no `error` or vise-versa. `error` will always be one of the above listed errors. `result` will be of whatever type the called method returns and will contain the returned result.

To call an API method, make a `POST` request to `http://meetapp.blakemealey.ca/System/Method` where `System` is the system you want to use (`Users`, `Friends`, `Meetups`) and `Method` is the method within that system you want to call. Arguments to methods should be passed using url parameters or with JSON.

Every request must include an `apiKey` parameter. Currently there is only one valid `apiKey`, which is `1234`. Having this key permits full usage of the API.

## API Description

### Users System

	UserID : Users.Register(name : String)
		Stores user in database
		Generates UserId and returns it

	UserID : Users.GetId(name : String)
		Returns the ID for the user with the given name

	JSON : Users.GetInformation(userId : UserID)
		Returns the data (name) associated with the specified user

### Friends System

	void : Friends.SendRequest(fromUser : UserID, toUser : UserID)
		Adds pending friend request to ToUser's entry in database

	UserID[] : Friends.GetPendingRequests(userId : UserID)
		Returns an array of all pending user IDs for a given user

	void : Friends.Accept(toUser : UserID, fromUser : UserID)
		Removes pending user id from ToUser
		Adds FromUser to ToUser's friends
		Adds ToUser to FromUser's friends

	void : Friends.Decline(toUser : UserID, fromUser : UserID)
		Removes pending user id from ToUser

### Meetups System

	MeetupID : Meetups.Create(creator : UserID, info : MeetupInfo, location : Location)
		Stores meetup in database
		Generates MeetupId and returns it

	void : Meetups.Close(meetupId : MeetupID)
		Deletes the meetup and places where it is referenced to by users from the database

	JSON : Meetups.GetInformation(meetupId : MeetupID)
		Returns the data (name, description, users, locations) associated with the specified meet up

	void : Meetups.SendRequest(meetupId : MeetupID, toUser : UserID)
		Adds pending meetup request to ToUser's entry in database

	MeetupID[] : Meetups.GetPendingRequests(userId : UserID)
		Returns an array of all pending meetup IDs for a given user

	void : Meetups.Accept(toUser : UserID, meetupId : MeetupID, location : Location)
		Removes pending meetup from user, adds user and user's location to meetup

	void : Meetups.Decline(toUser : UserID, meetupId : MeetupID)
		Removes pending meetup from ToUser

## Database Structure

	meet-app: Database

		users: Collection

			username: String
			friends: UserID[]
			meetups: MeetupID[]
			userId: UserID
			pendingFRs: UserID[]
			pendingMRs: MeetupID[]

		meetups: Collection

			meetupId: MeetupID
			creatorId: UserID
			name: String
			description: String
			time: String
			members: UserID[]
			locations: Location[]