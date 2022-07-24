const data = require('./../../lib/data');
const { hash } = require('./../../assets/utilities');
const { createRandomString } = require('./../../assets/utilities');
const { parseJSON } = require('./../../assets/utilities');


const token = {};

token.tokenHandler = (reqProps, callBack) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(reqProps.method) > -1) {
        token._tokens[reqProps.method](reqProps, callBack);
    } else {
        callBack(405);
    }
};

token._tokens = {};


token._tokens.post = (reqProps, callBack) => {

    const id =
        typeof (reqProps.body.id) === 'string' &&
            reqProps.body.id.trim().length === 11
            ? reqProps.body.id
            : false;

    const password =
        typeof (reqProps.body.password) === 'string' &&
            reqProps.body.password.trim().length > 0
            ? reqProps.body.password
            : false;

    if (id && password) {
        data.read('users', id, (err, userData) => {
            let hashedPass = hash(password);

            if (hashedPass === parseJSON(userData).password) {
                let tokenID = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObj = {
                    id: id,
                    'id': tokenID,
                    expires: expires
                };

                data.create('tokens', tokenID, tokenObj, (err) => {
                    if (!err) {
                        callBack(200, {
                            message: 'Successfully token created!',
                        })
                    }
                    else {
                        callBack(500, {
                            message: 'Server Error! ' + err,
                        })
                    }
                })
            }
            else {
                callBack(400, {
                    message: 'Password is not valid!',
                })
            }
        })
    }
    else {
        callBack(400, {
            message: 'Phone or Password not found',
        })
    }
};

token._tokens.get = (reqProps, callBack) => {

    const id =
        typeof (reqProps.queryString.id) === 'string' &&
            reqProps.queryString.id.trim().length === 20
            ? reqProps.queryString.id
            : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const newToken = { ...parseJSON(tokenData) };

            if (!err && newToken) {
                callBack(200, newToken);
            }
            else {
                callBack(404, {
                    message: 'Token was not found!'
                })
            }
        })
    }
    else {
        callBack(404, {
            message: 'Token didn\'t recieve!',
        })
    }
};

token._tokens.put = (reqProps, callBack) => {
    const id =
        typeof (reqProps.body.id) === 'string' &&
            reqProps.body.id.trim().length === 20
            ? reqProps.body.id
            : false;
    const extend =
        typeof (reqProps.body.extend) === 'boolean' &&
            reqProps.body.extend === true
            ? true
            : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {

            const tokenObj = parseJSON(tokenData);

            if (tokenObj.expires > Date.now()) {
                tokenObj.expires += Date.now() + 60 * 60 * 1000;

                data.update('tokens', id, tokenObj, (err) => {
                    if (!err) {
                        callBack(200);
                    }
                    else {
                        callBack(500, {
                            message: 'Server side error',
                        })
                    }
                })
            }
            else {
                callBack(400, {
                    message: 'Token expired',
                })
            }
        })
    }
    else {
        callBack(400, {
            message: "An error occured"
        })
    }
};

token._tokens.delete = (reqProps, callBack) => {
    const id =
        typeof (reqProps.queryString.id) === 'string' &&
            reqProps.queryString.id.trim().length === 20
            ? reqProps.queryString.id
            : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callBack(200, {
                            message: 'Token Successfully Deleted',
                        })
                    }
                    else {
                        callBack(500, {
                            message: 'An error occured! ' + err,
                        })
                    }
                })
            }
            else {
                callBack(500, {
                    message: "an error occured, " + err,
                })
            }
        })
    }
    else {
        callBack(400, {
            message: "Token Not Found",
        })
    }
};

module.exports = token;