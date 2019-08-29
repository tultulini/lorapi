export function isNullOrEmptyString(value) {
    return value === null || value === undefined || value.length === 0
}
export function isNullOrWhiteSpace(value) {
    return isNullOrEmptyString(value) || value.trim().length === 0
}
