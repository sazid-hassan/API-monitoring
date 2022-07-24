const url = require('url');

const { StringDecoder } = require('string_decoder');

const routes = require('./routes');

const { notFoundHandler } = require('./../handlers/routeHandler/notFoundHandler');

const { parseJSON } = require('./../assets/utilities');

const handler = {};

handler.handleResReq = (req, res) => {


    const parsedURL = url.parse(req.url, true);

    const path = parsedURL.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const method = req.method.toLowerCase();

    const queryString = parsedURL.query;

    const headersObj = req.headers;

    const reqProps = {
        parsedURL,
        path,
        trimmedPath,
        queryString,
        method,
        headersObj
    }


    const decoder = new StringDecoder('utf-8');

    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        reqProps.body = parseJSON(realData);

        chosenHandler(reqProps, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            console.log(payload.message);

            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });

};

module.exports = handler;