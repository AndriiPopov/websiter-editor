export default (structure, page) =>
    structure.map(item => ({
        ...item,
        relUrl:
            item.path.reduce((totalPath, itemId) => {
                const el = structure.find(itemInn => itemInn.id === itemId)
                if (el && (!el.hidden || el.folderPage))
                    return totalPath + el[page ? 'url' : 'name'] + '/'
                else {
                    return totalPath
                }
            }, '') + item[page ? 'url' : 'name'],
    }))
