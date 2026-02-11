// ./server2/index.js

const http = require('http');
const url = require('url');
const UserMessages = require('./lang/messages/en/user');
const DbUtils = require('./modules/dbUtils');

class Server {
    constructor(port) {
        this.port = port;
        this.userMessages = new UserMessages();
        this.dbUtils = new DbUtils();
    }

    setCorsHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    start() {
        const server = http.createServer(async (req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname.replace(/\/+$/,'');

            console.log(`[REQUEST] Method: ${req.method} | Path: '${path}'`);
            
            this.setCorsHeaders(res);

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            // Endpoint to send User Strings to the frontend
            if (path === '/definitions' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(this.userMessages));

            } else if (path === '/insert' && req.method === 'POST') {
                const result = await this.dbUtils.insertDefaultData();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));

            } else if (path === '/sql' && req.method === 'GET') {
                const sqlQuery = parsedUrl.query.query;
                
                if (!sqlQuery) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "No query provided" }));
                    return;
                }

                const result = await this.dbUtils.executeSelect(sqlQuery);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));

            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Lab 4 API is running. Access the client via Netlify.');
            }
        });

        server.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}

const port = process.env.PORT || 8000;
const app = new Server(port);
app.start();

/*

AI Discolsure: While all code was human written and edited, AI was used to assist in the development process.

Assistance from Google Gemini 3 PRO includes:
- Getting help with SQL queries and database interactions.
- Getting help setting up aiven for hosting the database.
- Getting help with CORS issues and how to set up the server to allow cross-origin requests from the frontend.

*/