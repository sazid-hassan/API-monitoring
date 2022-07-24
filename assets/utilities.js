
const crypto = require('crypto');

const environment = require('./../assets/environments')

const utilities = {};

//parsing JSON obj

utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString);
    }
    catch {
        output = {};
    }

    return output;
}

utilities.hash = (string) => {
    if (typeof (string) === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(string)
            .digest('hex')
        return hash;
    }
    else {
        return false;
    }
};

utilities.createRandomString = (strLength) => {
    let length = strLength;

    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        let possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let output = '';

        for (let i = 1; i <= length; i++) {
            let randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

            output += randomChar;
        }

        return output;
    }
    else {
        return false;
    }
};

module.exports = utilities;