// ./index.js

const http = require('http');
const url = require('url');
const fs = require('fs');

const UserMessages = require('./lang/messages/en/user');
const DbUtils = require('./modules/dbUtils');


class Server {
    constructor(port) {
        this.port = port;
        this.userMessages = new UserMessages();
        this.dbUtils = new DbUtils();
    }
    
    start() {
        const server = http.createServer(function(req, res) {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname.replace(/\/+$/,'');

            if (path === '' && req.method === 'GET') {
                fs.readFile('./index.html', function(err, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }.bind(this));
            } else if (path === '/insert' && req.method === 'POST') {
                // Here you would call your SQL functions to check/create table 
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
        }.bind(this));

        server.listen(this.port, function() {
            console.log(`Server is listening on port ${this.port}`);
        }.bind(this));
    }
}

const port = process.env.PORT || 8000;
const app = new Server(port);
app.start();

/*

AI Discolsure: While all code was human written and edited, AI was used to assist in the development process.

Assistance from Google Gemini 3 PRO includes:
- Getting help with SQL queries and database interactions.

*/