/* 
        title : Uptime monitoring app
        Description : A restful API to monitor up or down time for a link.
        Author : Sazid Hassan Khan
        Date : 15/7/22
*/


const http = require('http');

const url = require('url')

const app = {};

app.config = {
    port: 3001,
};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`)
    });
}

app.handleReqRes = (req, res) => {

    const parsedURL = url.parse(req.url, true);

    const path = parsedURL.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const method = req.method.toLowerCase();

    const queryString = parsedURL.query;

    const headersObj = req.headers;

    console.log(headersObj);

    res.end('some message');
}

app.createServer();