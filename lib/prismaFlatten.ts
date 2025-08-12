/**
 * @param {{[String]: any} | {[String]: any}[]} queryResult
 * @param {{[String]: any}} include
 * @param {String?} parentKey
 */
export const flattenPrismaIncludeResult = (queryResult, includeObj, parentKey = null) => {
    if (!queryResult) return queryResult
    const qrIsArray = Array.isArray(queryResult)
    const includeObjKeys = Object.keys(includeObj)
    if (!qrIsArray) {
        // handle everything as an array, then transform at the end
        queryResult = [queryResult]
    }

    const newResultSet = []
    for (let qri of queryResult) {
        for (const incKey of includeObjKeys) {
            const typeofIncValue = typeof includeObj[incKey]
            const typeofQriValue = typeof qri[incKey]
            if (typeofIncValue === "object") {
                // DFS
                if (incKey === "include") {
                    let res = { ...qri, ...flattenPrismaIncludeResult(qri, includeObj[incKey], parentKey) }
                    if (res.__deleteKey) {
                        delete res[res.__deleteKey]
                        delete res.__deleteKey
                    }
                    newResultSet.push(res)
                } else {
                    qri[incKey] = flattenPrismaIncludeResult(qri[incKey], includeObj[incKey], incKey)
                    if (typeofQriValue === "object" && !Array.isArray(qri[incKey]) && !!parentKey) {
                        qri = { ...qri, ...qri[incKey], __deleteKey: incKey }
                        delete qri[incKey]
                    }
                    newResultSet.push(qri)
                }
            } else if (typeofIncValue === "boolean" && qri.hasOwnProperty(incKey) && parentKey !== null) {
                const tmpObj = { ...qri, ...qri[incKey], __deleteKey: incKey }
                delete tmpObj[incKey]
                newResultSet.push(tmpObj)
            } else {
                // TODO - confirm that we don't need to handle this case
                newResultSet.push(qri)
            }
        }
    }

    const result = qrIsArray ? newResultSet : newResultSet[0]
    return result
}