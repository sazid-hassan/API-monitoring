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
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fDescriptor) => {
        if (!err & fDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fDescriptor, (err) => {
                                if (!err) {
                                    callback("File Closed");
                                }
                                else {
                                    callback("An error occured in file closing!")
                                }
                            });
                        }
                        else {
                            console.log("Error in writing file!");
                        }
                    })
                }
                else {
                    console.log("error truncating file");
                }
            })
        }
        else {
            console.log('error in updating data!');
        }
    })
}


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