export const getFileUrl = (structure, id, noVersion, thumbnail, domain) => {
    const prod = process.env.NODE_ENV !== 'development'
    const file = structure.find(item => item.id === id || item.relUrl === id)
    if (!file) return ''

    const domainString = domain
        ? `http${prod ? 's' : ''}://${domain}.live.websiter.${
              prod ? 'dev' : 'test:5000'
          }/`
        : ''
    // const path = file.path.reduce(
    //     (totalPath, fileId) =>
    //         totalPath +
    //         structure.find(fileInn => fileInn.id === fileId).name +
    //         '/',
    //     ''
    // )
    let query = noVersion ? '' : 'v=' + (file.v || '0')
    query =
        (query.length > 0 ? query + '&' : '') + (thumbnail ? 'thumbnail=1' : '')
    return domainString + file.relUrl + (query ? '?' + query : '')
}
