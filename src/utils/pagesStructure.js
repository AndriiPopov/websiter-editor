import { isEqual, omit } from 'lodash'

import type {
    initialStateType,
    resourceType,
    elementType,
} from '../store/reducer/reducer'

export const findDecedants = (
    items: $PropertyType<initialStateType, 'pagesStructure'>,
    id: string
): $PropertyType<initialStateType, 'pagesStructure'> => {
    return items.filter(item =>
        item.path.some(element => element.toString() === id.toString())
    )
}

export const findDirectChildren = (
    items: $PropertyType<initialStateType, 'pagesStructure'>,
    id: string
): $PropertyType<initialStateType, 'pagesStructure'> => {
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
