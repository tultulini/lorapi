import { readFileSync, writeFileSync } from 'fs'
import { isNullOrEmpty } from './lib/collections-utils';
import { v4 } from 'uuid'
import { Validator } from 'jsonschema'
import { isNullOrWhiteSpace, stringContains } from './lib/string-utils';
const IDGeneratorTypes = { Numeric: "numeric", UUID: "uuid" }
const AssertTypes = { Schema: "schema", Field: "field" }
const HttpMethods = { Get: "get", Put: "put", Post: "post", Delete: "delete", Patch: "patch" }
export function getConfigurations() {

    const fileData = getConfigurationData()
    console.log(`config: ${JSON.stringify(fileData, null, '\t')}`)
    return fileData.map(item => getConfiguration(item))

}


export const IDGeneratorType = IDGeneratorTypes;

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

export function getConfiguration({ resourceName, identifier, idGenType, asserts }) {
    const generator = idGenType == IDGeneratorTypes.Numeric
        ? getNewNumericId
        : getUUIDId

    const asserters = getAsserts(asserts)

    return {
        resourceName,
        identifier,
        generateId: (items, idField) =>
            idGenType == IDGeneratorTypes.Numeric
                ? getNewNumericId(items, idField)
                : getUUIDId(items, idField)
        ,
        assert: (method, data) => asserters.forEach(asserter => {
            if (asserter.isForMethod(method)) {
                asserter.assert(data)
            }
        })
    }
}

function getAsserts(assertsData) {
    if (isNullOrEmpty(assertsData)) {
        return null
    }
    let asserts = []
    let idx
    for (idx in assertsData) {
        let assertData = assertsData[idx]
        let assert;
        switch (assertData.type) {
            case AssertTypes.Schema:
                assert = getSchemaAssert(assertData)
                break;
            // case FailureTypes.Field:
            //     failure = getFieldFailure(assertData)
            //     break;
            default:
                throw new Error(`${assertData.type} is not supported`)
        }
        asserts.push(assert)
    }
    return asserts
}

function getSchemaAssert(assertData) {
    const methods = assertData.methods.toLowerCase().trim()
    if (validateNethods(methods)) {
        throw new Error("missing [for] property")
    }

    const supportsAllMethods = methods.includes("*")

    return {
        assert: data => {
            const validator = new Validator()
            const result = validator.validate(data, assertData.schema)
            if (!result.valid) {
                throw new Error(result.errors.map(e => `${e.property} - ${e.message}`).join(", \r\n"))
            }
        },
        isForMethod: (action) => supportsAllMethods
            ? true
            : methods.includes(action.toLowerCase()),
        supportsAllMethods: () => supportsAllMethods
    }
}
function validateNethods(methods) {
    if (isNullOrWhiteSpace(methods))
        return false

    return methods.includes("*")
        || methods.includes(HttpMethods.Get)
        || methods.includes(HttpMethods.Put)
        || methods.includes(HttpMethods.Post)
        || methods.includes(HttpMethods.Patch)
        || methods.includes(HttpMethods.Delete)


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