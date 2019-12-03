import { isEqual, omit } from 'lodash'

import type { pagesStructureType } from '../../flowTypes'

export const findDecedants = (
    items: pagesStructureType,
    id: string
): pagesStructureType => {
    return items.filter(item =>
        item.path.some(element => element.toString() === id.toString())
    )
}

export const findDirectChildren = (
    items: pagesStructureType,
    id: string
): pagesStructureType => {
    const elements = items.filter(item => item.id === id)
    if (elements.length !== 1) {
        return []
    } else {
        return items.filter(item =>
            isEqual(item.path, [...elements[0].path, id])
        )
    }
}
type child = {
    children: Array<child>,
    id: string,
}

export const buildItems = (
    children: Array<child>,
    path: Array<string>,
    result: Array<{}>
) => {
    const doBuildItems = (children: Array<child>, path: Array<string>) => {
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
            doBuildItems(element.children, [...path, element.id])
        })
    }
    doBuildItems(children, path)
    return result
}
