// ./index.js

// ./index.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const UserMessages = require('./lang/messages/en/user');
const DbUtils = require('./modules/dbUtils');

// Helper class to inject user.js strings into HTML
class UIHandler {
    constructor(userMessages) {
        this.messages = userMessages;
    }

    fillHtml(htmlContent) {
        let modifiedHtml = htmlContent;
        modifiedHtml = modifiedHtml.replace('{{TITLE}}', this.messages.title);
        modifiedHtml = modifiedHtml.replace('{{HEADER}}', this.messages.header);
        modifiedHtml = modifiedHtml.replace('{{INSERT_BUTTON}}', this.messages.insertButton);
        modifiedHtml = modifiedHtml.replace('{{QUERY_TITLE}}', this.messages.queryTitle);
        modifiedHtml = modifiedHtml.replace('{{QUERY_PLACEHOLDER}}', this.messages.queryPlaceholder);
        modifiedHtml = modifiedHtml.replace('{{SUBMIT_QUERY_BUTTON}}', this.messages.submitQueryButton);
        modifiedHtml = modifiedHtml.replace('{{RESPONSE_TITLE}}', this.messages.responseTitle);
        return modifiedHtml;
    }
}

class Server {
    constructor(port) {
        this.port = port;
        this.userMessages = new UserMessages();
        this.dbUtils = new DbUtils();
        this.uiHandler = new UIHandler(this.userMessages);
    }

    // Helper to handle CORS
    setCorsHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    start() {
        const server = http.createServer(async function(req, res) {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname.replace(/\/+$/,'');
            
            this.setCorsHeaders(res);

            // Handle Preflight OPTIONS request for CORS
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            if (path === '' && req.method === 'GET') {
                // Serve HTML with injected User Strings
                fs.readFile('./index.html', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading HTML');
                        return;
                    }
                    const finalHtml = this.uiHandler.fillHtml(data);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(finalHtml);
                });

            } else if (path === '/insert' && req.method === 'POST') {
                // Handle INSERT request 
                const result = await this.dbUtils.insertDefaultData();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));

            } else if (path === '/sql' && req.method === 'GET') {
                // Handle SELECT query
                const sqlQuery = parsedUrl.query.query;
                
                if (!sqlQuery) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "No query provided" }));
                    return;
                }

                const result = await this.dbUtils.executeSelect(sqlQuery);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));

            } else if (path.includes('.css')) {
                // Serve CSS
                fs.readFile('.' + parsedUrl.pathname, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end();
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data);
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
        }.bind(this));

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

*/