/* 
        title : Uptime monitoring app
        Description : A restful API to monitor up or down time for a link.
        Author : Sazid Hassan Khan
        Date : 15/7/22
*/


const http = require('http');

const environment = require('./assets/environments');

const data = require('./lib/data')
const { handleResReq } = require('./assets/handleResReq');

const app = {};

//Testing Purpose

// Creating File
// data.create('test', 'new', { 'name': 'Bangladesh', 'language': "Bangla" }, (err) => {
//     console.log(`Error : ${err}`);
// })

// Reading File

// data.read('test', 'new', (err, data) => {
//     console.log(err, data);
// })

// Updating File

// data.update('test', 'new', { 'name': 'china', 'language': 'mandarin' }, (err) => {
//     console.log(err);
// })

//Deleting File

// data.delete('test', 'new', (err) => {
//     console.log(err);
// })

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`)
    });
}

app.handleReqRes = handleResReq;

app.createServer();