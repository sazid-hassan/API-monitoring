/* 
        title : Uptime monitoring app
        Description : A restful API to monitor up or down time for a link.
        Author : Sazid Hassan Khan
        Date : 15/7/22
*/


const http = require('http');

const { handleResReq } = require('./assets/handleResReq');

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

app.handleReqRes = handleResReq;

app.createServer();