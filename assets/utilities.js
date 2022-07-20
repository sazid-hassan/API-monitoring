
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
}

module.exports = utilities;