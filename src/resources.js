import { readFileSync, writeFileSync } from 'fs'
import { isNullOrEmpty } from './lib/collections-utils';
import { v4 } from 'uuid'
const IDGeneratorTypes = { Numeric: "numeric", UUID: "uuid" }

export function getConfigurations() {

    const fileData = getConfigurationData()
    console.log(`config: ${JSON.stringify(fileData, null, '\t')}`)
    return fileData.map(item => getConfiguration(item))

}


export const  IDGeneratorType = IDGeneratorTypes;

export function setConfiguration({ resourceName, identifier, idGenType }) {
    let configurationData = getConfigurationData()
    const resourceIndex = configurationData.findIndex((conf) => conf.resourceName === resourceName)
    if (resourceIndex >= 0) {
        configurationData.splice(resourceIndex, 1, { resourceName, identifier, idGenType })
    }
    else {
        configurationData.push({ resourceName, identifier, idGenType })
    }
    writeConfigurationData(configurationData)
}

export function getConfiguration({ resourceName, identifier, idGenType }) {
    const funct = idGenType == IDGeneratorTypes.Numeric
        ? getNewNumericId
        : getUUIDId
    return { resourceName, identifier, generateId: (items, idField) => funct(items, idField) }
}
export function getConfigurationData() {
    return JSON.parse(readFileSync('src/resources/configurations.json').toString())
}
function getNewNumericId(items, identifierField) {
    if (isNullOrEmpty(items)) {
        return 1
    }
    const max = items.reduce(function (prev, current) {
        return (prev[identifierField] > current[identifierField]) ? prev : current
    })[identifierField] + 1
    return max
}
function getUUIDId(items, identifierField) {
    return v4()

}

function writeConfigurationData(configurationData) {
    writeFileSync('src/resources/configurations.json',
        JSON.stringify(configurationData, null, '\t'),
        { encoding: 'utf8', flag: 'w' })
}