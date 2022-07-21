const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, './../.data/');

lib.create = function (dir, file, data, callback) {
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err, fDescriptor) => {
        if (!err && fDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        }
                        else {
                            callback("Error while closing the file!")
                        }
                    });
                }
                else {
                    callback("Error in writing!")
                }
            })
        }
        else {
            callback('Could not create new file! May already exists.');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    })
}

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (err === null && fileDescriptor) {

            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            // close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            });
                        }
                        else {
                            callback('Error writing to file!');
                        }
                    });
                }
                else {
                    callback('Error truncating file!');
                }
            });
        } else {
            console.log(`Error updating. File may not exist`);
        }
    });
};


lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        }
        else {
            callback("Error Deleting File!");
        }
    })
}


module.exports = lib;