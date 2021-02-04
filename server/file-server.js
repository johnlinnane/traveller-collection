var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        process.env.REACT_APP_CLIENT_PREFIX,
        process.env.REACT_APP_DB, 
        process.env.REACT_APP_CLIENT_BUILD_PREFIX,
        process.env.REACT_APP_FILE_SERVER_PREFIX
    ]
}));

app.use(express.static('public'));
console.log("FILE-SERVER running on port 4000");
server.listen(4000);