const data = require('./../../lib/data');

const { hash } = require('./../../assets/utilities');

const { parseJSON } = require('./../../assets/utilities');

const user = {};

user.userHandler = (reqProps, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(reqProps.method) > -1) {
        user._users[reqProps.method](reqProps, callback);
    }
    else {
        callback(405)
    }
}

user._users = {};

user._users.post = (reqProps, callback) => {
    const firstName =
        typeof (reqProps.body.firstName) === 'string' &&
            reqProps.body.firstName.trim().length > 0
            ? reqProps.body.firstName
            : false;

    const lastName =
        typeof (reqProps.body.lastName) === 'string' &&
            reqProps.body.lastName.trim().length > 0
            ? reqProps.body.lastName
            : false;

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

    const tosAgreement =
        typeof (reqProps.body.tosAgreement) === 'boolean' &&
            reqProps.body.tosAgreement
            ? reqProps.body.tosAgreement
            : false;


    if (firstName && lastName && phone && password && tosAgreement) {
        //verifying unique user
        data.read('users', phone, (err) => {
            if (err) {
                let user = {
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    password: hash(password),
                    tosAgreement: tosAgreement
                };

                //store user
                data.create('users', phone, user, (err) => {
                    if (!err) {
                        callback(200, {
                            'message': 'Successfully created User!'
                        })
                    }
                    else {
                        callback(500, 'Error 500 : Could not create user!')
                    }
                })
            }
            else {
                callback(500, {
                    error: "Phone number or file already exists!",
                })
            }
        })

    }
    else {
        callback(400, {
            error: "Input type doesn't match."
        })
    }
};


user._users.get = (reqProps, callback) => {
    const phone =
        typeof (reqProps.queryString.phone) === 'string' &&
            reqProps.queryString.phone.trim().length === 11
            ? reqProps.queryString.phone
            : false;

    if (phone) {
        data.read('users', phone, (err, user) => {
            if (!err && user) {
                user = { ...parseJSON(user) };
                delete user.password;

                callback(200, user);
            }
            else {
                callback(404, {
                    message: "Error occured while loading user!",
                })
            }
        })
    }
    else {
        callback(404, {
            message: "404 Not Found User",
        })
    }
};

user._users.put = (reqProps, callback) => {

    const phone =
        typeof reqProps.body.phone === 'string' &&
            reqProps.body.phone.trim().length === 11
            ? reqProps.body.phone
            : false;

    const firstName =
        typeof reqProps.body.firstName === 'string' &&
            reqProps.body.firstName.trim().length > 0
            ? reqProps.body.firstName
            : false;

    const lastName =
        typeof reqProps.body.lastName === 'string' &&
            reqProps.body.lastName.trim().length > 0
            ? reqProps.body.lastName
            : false;

    const password =
        typeof reqProps.body.password === 'string' &&
            reqProps.body.password.trim().length > 0
            ? reqProps.body.password
            : false;

    // console.log(reqProps.body);

    if (phone) {
        if (firstName || lastName || password) {
            // loopkup the user
            data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };

                if (!err1 && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }

                    // store to database
                    data.update('users', phone, userData, (err2) => {

                        if (!err2) {

                            callback(200, {
                                message: 'User was updated successfully!',
                            });
                        } else {
                            callback(500, {
                                error: err2,
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have a problem in your request!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
};

user._users.delete = (reqProps, callback) => {
    const phone =
        typeof (reqProps.queryString.phone) === 'string' &&
            reqProps.queryString.phone.trim().length === 11
            ? reqProps.queryString.phone
            : false;

    if (phone) {
        data.read('users', phone, (err) => {
            if (!err) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Successfully Deleted',
                        })
                    }
                    else {
                        callback(500, {
                            message: 'An error occured! ' + err,
                        })
                    }
                })
            }
            else {
                callback(500, {
                    message: "an error occured, " + err,
                })
            }
        })
    }
    else {
        callback(400, {
            message: "User Not Found",
        })
    }

};

// console.log(user);

module.exports = user;