import omit from 'lodash/omit'

export const buildItems = (children, path, result) => {
    const doBuildItems = (children, path) => {
        children.forEach(element => {
            result.push({
                ...omit(element, [
                    'children',
                    'resourceDraft',
                    'currentResource',
                    'mode',
                    'pluginsStructure',
                ]),
                path,
            })
            if (element.children)
                doBuildItems(element.children, [...path, element.id])
        })
    }
    doBuildItems(children, path)
    return result
}
