import { isNullOrEmpty } from './collections-utils';
import { readFileSync, writeFileSync } from 'fs'

export function getAdapter() {
    return {
        getById,
        getAll,
        add,
        update

    }
}
function getById(config, id) {
    const items = getAll(config)
    if (isNullOrEmpty(items))
        return null
    const item = items.find(i => i[config.identifier] == id)
    return item
}

function getAll(config) {
    console.log('enter getAll')
    var filePath = getFilePath(config)
    if (!fileExist(filePath)) {
        return null
    }
    const buffer = readFileSync(filePath)
    return JSON.parse(buffer.toString())

}


function add(config, item) {
    console.log('enter add')
    let items = getAll(config)
    item[config.identifier] = config.generateId()
    items.push(item)
    writeItems(config, items)

    return item
}
function writeItems(config, items) {
    writeFileSync(getFilePath(config),
        JSON.stringify(items, null, '\t'),
        { encoding: 'utf8', flag: 'w' })
}

function update(config, item, id) {
    let items = getAll(config)
    let existingItemIndex = items.findIndex(i => i[config.identifier] == id);
    item[config.identifier] = id
    if (existingItemIndex > -1) {
        items.splice(existingItemIndex, 1, item)
    }
    writeItems(config, items)
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