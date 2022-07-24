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

    const phone =
        typeof (reqProps.body.phone) === 'string' &&
            reqProps.body.phone.trim().length === 11
            ? reqProps.body.phone
            : false;

    const password =
        typeof (reqProps.body.password) === 'string' &&
            reqProps.body.password.trim().length > 0
            ? reqProps.body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPass = hash(password);

            if (hashedPass === parseJSON(userData).password) {
                let tokenID = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObj = {
                    phone: phone,
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
                            message: 'Server Error!',
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
    callBack(200, {
        message: "route created!"
    })

};


token._tokens.put = (reqProps, callBack) => {

};

token._tokens.delete = (reqProps, callBack) => {

};

// console.log(token);

module.exports = token;