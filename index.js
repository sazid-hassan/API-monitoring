/* 
        title : Uptime monitoring app
        Description : A restful API to monitor up or down time for a link.
        Author : Sazid Hassan Khan
        Date : 15/7/22
*/

const http = require('http');
const environment = require('./assets/environments');
const { handleResReq } = require('./assets/handleResReq');

const app = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`)
    });
}

app.handleReqRes = handleResReq;

app.createServer();