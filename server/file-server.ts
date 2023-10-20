import express, { Application } from 'express';
import https from 'https';
import fs from 'fs';

const app: Application = express();

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

declare var process : {
    env: {
        CLIENT_PREFIX: string | undefined,
        DB: string | undefined,
        CLIENT_BUILD_PREFIX: string | undefined,
        FILE_SERVER_PREFIX: string | undefined,
        PRODUCTION_PREFIX: string | undefined,
        SSL_KEY: string | undefined | fs.PathOrFileDescriptor,
        SSL_CERT: string | undefined | fs.PathOrFileDescriptor,
    }
  }

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        process.env.CLIENT_PREFIX!,
        process.env.DB!, 
        process.env.CLIENT_BUILD_PREFIX!,
        process.env.FILE_SERVER_PREFIX!,
        process.env.PRODUCTION_PREFIX!
    ]
}));

app.use(express.static('./../public'));


const key = fs.readFileSync(process.env.SSL_KEY!);
const cert = fs.readFileSync(process.env.SSL_CERT!);

if (!key || !cert) {
    throw new Error('Certs not defined.');
}

const options = {
    key: key,
    cert: cert
  };

const httpsServer = https.createServer(options, app);

const port = 4000;

httpsServer.listen(port, () => {
    console.log(`FILE-SERVER HTTPS RUNNING : port ${port}`)
})

