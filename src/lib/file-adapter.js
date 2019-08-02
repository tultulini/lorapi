const fs = require('fs')
function getById(config, id) {
    var filePath = getFilePath(config)
    if (!fileExist(filePath)) {
        return null
    }
    const buffer = fs.readFileSync(filePath)
    var items = JSON.parse(buffer.toString())

}

function getAll(config) {

}


function add(config) {

}


function update(config, item) {

}
function getFilePath(config) {
    return './' + config.resourceName + '.json'

}
function fileExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                console.error(err)
                return reject(err);
            }
            //file exists
            resolve();
        })
    });
}