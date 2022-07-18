const notFound = {};

notFound.notFoundHandler = (reqProps, callback) => {
    callback(404, {
        message: "Requested URL not found"
    });
}

module.exports = notFound;