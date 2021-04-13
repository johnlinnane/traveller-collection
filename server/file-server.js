const express = require('express');
// const http = require('http');
const https = require('https'); // this is new
const fs = require('fs')
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config({path: '../.env'})

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        process.env.CLIENT_PREFIX,
        process.env.DB, 
        process.env.CLIENT_BUILD_PREFIX,
        process.env.FILE_SERVER_PREFIX,
        process.env.PRODUCTION_PREFIX
    ]
}));

app.use(express.static('public'));


// const server = http.createServer(app);

const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
  };

const httpsServer = https.createServer(options, app);

// server.listen(4000);

const port = 4000;

httpsServer.listen(port, () => {
    console.log(`FILE-SERVER HTTPS RUNNING : port ${port}`)
})

