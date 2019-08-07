import { readFileSync, readdirSync } from 'fs'
import { isNullOrEmpty } from './lib/collections-utils';
import { v4 } from 'uuid'
const IDGeneratorTypes = { Numeric: "numeric", UUID: "uuid" }

export function getConfigurations() {

    const fileData = JSON.parse(readFileSync('src/resources/configurations.json').toString())
    console.log(`config: ${JSON.stringify(fileData, null, '\t')}`)
    return fileData.map(item => getConfiguration(item))

}

function getConfiguration({ resourceName, identifier, idGenType }) {
    const funct = idGenType == IDGeneratorTypes.Numeric
        ? getNewNumericId
        : getUUIDId
    return { resourceName, identifier, generateId: (items, idField) => funct(items, idField) }
}

function getNewNumericId(items, identifierField) {
    if (isNullOrEmpty(items)) {
        return 1
    }
    const max = items.reduce(function(prev, current) {
        return (prev[identifierField] > current[identifierField]) ? prev : current
    })[identifierField] + 1
    return max
}
function getUUIDId(items, identifierField) {
    return v4()

}