export const getFileUrl = (
    structure,
    id,
    noVersion,
    thumbnail,
    domain,
    addProtocolAndLiveDomain
) => {
    const file = structure.find(item => item.id === id || item.relUrl === id)
    if (!file) return ''
    const protocol = addProtocolAndLiveDomain
        ? process.env.NODE_ENV === 'development'
            ? 'http://live.websiter.test:5000/'
            : 'https://live.websiter.dev/'
        : ''
    const domainString = domain ? domain + '/' : ''
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
    return protocol + domainString + file.relUrl + (query ? '?' + query : '')
}
