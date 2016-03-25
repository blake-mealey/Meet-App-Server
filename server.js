// Server config
var config = require('./server_config');

// Node libraries
var http = require('http');
var qs = require('querystring');

//Setup server
var server = http.createServer(function(req, res) {
	console.log(req.method + ": ");
	if(req.method == "POST") {
		var reqBody = '';
		req.on('data', function(data) {
			reqBody += data;
		});
		req.on('end', function() {
			var formData = qs.parse(reqBody);
			console.dir(formData);

			var returnJSON = {};

			if(formData.api_key == config.api_key) {
				returnJSON.ok = true;
			} else {
				returnJSON.ok = false;
				returnJSON.error = "invalid_api_key";
			}

			if(returnJSON != null) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(returnJSON));
			} else {
				res.end("");
			}

			console.log("\n");
		});
	}
})

server.listen(config.server_port);
console.log('Meet-App server running on localhost:'+config.server_port);