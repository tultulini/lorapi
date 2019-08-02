import { readFileSync } from 'fs'
import { isNullOrEmpty } from './lib/collections-utils';
export function getResourceNames() {
    return ['alpha', 'beta']
}
export function getConfigurations() {
    const fileData = JSON.parse(readFileSync('./resources/configurations.json').toString())

}
function getConfiguration({ resourceName, identifier, idGenType }) {
    const funct = (items) => {

    }
    return { resourceName, identifier, idGenerator: funct }
}
function getNewNumericId(items, identifier) {
    if (isNullOrEmpty(items)) {
        return 1
    }
    var max = items.reduce(function (a, b) {
        return Math.max(a[identifier], b[identifier]);
    });
}