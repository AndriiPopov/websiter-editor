export const getFileUrl = (structure, id, noVersion, thumbnail, domain) => {
    const file = structure.find(item => item.id === id)
    if (!file) return ''
    let query = noVersion ? '' : 'v=' + (file.v || '0')
    query = (query.length > 0 ? '&' : '') + (thumbnail ? 'thumbnail=1' : '')
    const domainString = domain ? domain + '/' : ''
    const path = file.path.reduce(
        (totalPath, fileId) =>
            totalPath +
            '/' +
            structure.find(fileInn => fileInn.id === fileId).name,
        ''
    )
    const pathString = path.length > 0 ? path + '/' : ''

    const res =
        domainString + pathString + file.name + (query ? '?' + query : '')
    return res
}
