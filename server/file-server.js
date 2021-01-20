var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

// app.use(express.static(__dirname + '/public/assets'));
app.use(express.static('public'));
console.log(__dirname)
console.log("FILE-SERVER running on port 4000");
server.listen(4000);