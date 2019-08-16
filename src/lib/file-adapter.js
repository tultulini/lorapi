import { isNullOrEmpty } from './collections-utils';
import { readFileSync, writeFileSync, existsSync } from 'fs'

export function getAdapter() {
    return {
        getById,
        getAll,
        add,
        update,
        delete: deleteItem

    }
}
function getById(config, id) {
    console.log('getById entered')
    const items = getAll(config)
    if (isNullOrEmpty(items)) {
        console.error('found no item by ID')
        return null
    }
    const item = items.find(i => i[config.identifier] == id)
    return item
}

function getAll(config) {
    console.log(`enter getAll for: ${JSON.stringify(config, null, '\t')}`)
    var filePath = getFilePath(config)
    if (!existsSync(filePath)) {
        console.log(`${filePath} doesn't exists`)
        return null
    }
    const buffer = readFileSync(filePath)
    return JSON.parse(buffer.toString())

}


function add(config, item) {
    console.log('enter add')
    let items = getAll(config)
    if (!items) {

        items = []
    }
    item[config.identifier] = config.generateId(items, config['identifier'])
    items.push(item)
    writeItems(config, items)

    return item
}
function writeItems(config, items) {
    writeFileSync(getFilePath(config),
        JSON.stringify(items, null, '\t'),
        { encoding: 'utf8', flag: 'w' })
}

function deleteItem(config, id) {
    let items = getAll(config)
    if (isNullOrEmpty(items)) {
        return 0
    }
    let existingItemIndex = items.findIndex(i => i[config.identifier] == id)
    if (existingItemIndex < 0) {
        return 0
    }
    items.splice(existingItemIndex, 1)
    writeItems(config, items)

}

function update(config, item, id) {
    let items = getAll(config)
    let existingItemIndex = items.findIndex(i => i[config.identifier] == id);
    item[config.identifier] = id
    if (existingItemIndex > -1) {
        items.splice(existingItemIndex, 1, item)
    }
    writeItems(config, items)
    return true
}
function getFilePath(config) {
    const filePath = './resource-data/' + config.resourceName + '.json'
    console.log(`filePath: ${filePath}`)
    return filePath

}
