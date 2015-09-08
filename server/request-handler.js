/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var md5 = require("md5");
var messages = [];

var requestHandler = function(request, response) {
  console.log("URL: " + request.url, "Method: " + request.method);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/JSON";

  if ( request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end();
  } else if (request.url === "/classes/messages") {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({"Hello, World!": "Hello, World!", results: []}));
  } else if (request.url === "/send") {
    if (request.method === "POST") {
      statusCode = 201;
      response.writeHead(statusCode, headers);

      var rawData = "";
      var post;
      request.on('data', function (chunk) {
        rawData += chunk;
      });
      request.on('end', function () {
        post = JSON.parse(rawData);

        var messageObj = {
          username: post.username,
          message: post.message,
          objectId: md5(Date.now().toString()),
          roomname: post.roomname
        };

        messages.push(messageObj);

        response.end();
      });
    } else if (request.method === 'GET') {
      response.writeHead(statusCode, headers);

      response.end(JSON.stringify({results: messages}));
    } 
  } else if (request.url === "/classes/room1") {
    if (request.method === "GET") {
      response.writeHead(statusCode, headers);
      console.log(messages.slice(0).reverse());
      response.end(JSON.stringify({results: messages.slice(0).reverse()}));
    } else if (request.method === "POST") {
      statusCode = 201;
      response.writeHead(statusCode, headers);

      var rawData = "";
      var post;
      request.on('data', function(chunk) {
        rawData += chunk;
      });
      request.on('end', function() {
        post = JSON.parse(rawData);
        var messageObj = {
          username: post.username,
          message: post.message,
          objectId: md5(Date.now().toString()),
          roomname: post.roomname
        };

        messages.push(messageObj);

        response.end();
      });
    }
  } else {
    statusCode = 404;

    response.writeHead(statusCode, headers);
    response.end();
  }
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;