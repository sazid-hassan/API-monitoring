const sample = {};

sample.sampleHandler = (reqProps, callback) => {
    callback(200, {
        message: "Sample URL"
    });
}

module.exports = sample;