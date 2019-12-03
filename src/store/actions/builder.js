import * as actionTypes from './actionTypes'
import * as actions from './index'
import type { pageStructureType } from '../../../flowTypes'
import { isEqual, omit, isObject, isEmpty, cloneDeep } from 'lodash'

const findElementIndex = (draft: Object): number => {
    if (draft.currentBox.length < 1) return -1
    return draft.structure.findIndex(item => item.id === draft.currentBox)
}

const findRouteElements = (draft: Object, mode: string) => {
    const result = []
    if (mode === 'plugin') {
        result.push(0)
    } else if (mode === 'page') {
        draft.structure.forEach((item, index) => {
            if (item.path.length < 2) result.push(index)
        })
    }
    return result
}

export const saveElementsStructure = (
    structure: pageStructureType,
    currentResource: string,
    resourceDraft: {}
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft || !structure) return
    const draft = { ...resourceDraft, structure }

    const isNotForHistory = isEqual(
        resourceDraft.structure.map(item => omit(item, ['expanded'])),
        structure.map(item => omit(item, ['expanded']))
    )
    dispatch(
        actions.addResourceVersion(currentResource, draft, isNotForHistory)
    )
}

export const chooseBox = (
    item: string,
    currentResource: string,
    resourceDraft: {}
) => (dispatch: Object) => {
    if (!currentResource || !item || !resourceDraft) return
    const draft = { ...resourceDraft, currentBox: item }
    dispatch(actions.addResourceVersion(currentResource, draft, true))
    dispatch(unhoverBox())
}

export const changeBoxProperty = (
    key: string | Array<{}>,
    value: any,
    currentResource: string,
    resourceDraft: {},
    isNotForHistory?: boolean
) => (dispatch: Object) => {
    if (!currentResource || !key || !resourceDraft) return
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    const changes = isObject(key) ? key : { [key]: value }
    const draft = {
        ...resourceDraft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            {
                ...resourceDraft.structure[elementIndex],
                ...changes,
            },
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
    }
    dispatch(
        actions.addResourceVersion(currentResource, draft, isNotForHistory)
    )
}

export const saveHoveredElementRect = (path: Array<string>, size: Object) => ({
    type: 'SAVE_HOVERED_ELEMENT_RECT',
    path,
    size,
})

const deleteFromHoveredSizes = (currentResource, removedElements) => ({
    type: 'REMOVE_FROM_HOVERED_SIZES',
    currentResource,
    removedElements,
})

const expandAllParents = (
    id: string,
    currentResource: string,
    resourceDraft: {}
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    const box = resourceDraft.structure.find(item => item.id === id)
    if (!box) return

    const draft = cloneDeep(resourceDraft)

    box.path.forEach(item => {
        const element = draft.structure.find(element => element.id === item)
        if (element) element.expanded = true
    })
    dispatch(actions.addResourceVersion(currentResource, draft))
}

export const hoverBox = (id: string, mode: string, fromFrame?: boolean) => ({
    type: 'HOVER_ELEMENT',
    id,
    mode,
    fromFrame,
})

export const unhoverBox = () => ({
    type: 'UNHOVER_ELEMENT',
})

export const toggleFindMode = (value?: string) => ({
    type: 'TOGGLE_FIND_MODE',
    value,
})

export const addBox = (
    currentResource: string,
    resourceDraft: {},
    mode: 'page' | 'plugin',
    text: boolean
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, mode)
    let elementIndex = findElementIndex(resourceDraft)
    if (mode === 'plugin') {
        if (elementIndex < 0) {
            elementIndex = 0
        }
    } else if (mode === 'page') {
        if (elementIndex < 1) {
            elementIndex = routeElements[routeElements.length - 1]
        }
    }
    const newId = `element_${resourceDraft.currentId}`
    const newCurrentId = resourceDraft.currentId + 1

    const draft = {
        ...resourceDraft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex + 1),
            {
                id: newId,
                path:
                    resourceDraft.structure[elementIndex].path.length === 0
                        ? [resourceDraft.structure[elementIndex].id]
                        : [...resourceDraft.structure[elementIndex].path],
                tag: text ? 'text' : 'div',
                text: text,
                textContent: '',
                properties: {},
            },
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
        currentId: newCurrentId,
        currentBox: newId,
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
}

export const deleteBox = (
    currentResource: string,
    resourceDraft: {},
    mode: 'page' | 'plugin',
    withChildren: boolean
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, mode)
    let elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0 || routeElements.includes(elementIndex)) return

    const elementId = resourceDraft.structure[elementIndex].id

    let draft = {}
    const removedElements = [elementId]
    if (withChildren) {
        draft = {
            ...resourceDraft,
            structure: resourceDraft.structure.filter(item => {
                const notRemove =
                    elementId !== item.id && !item.path.includes(elementId)
                if (!notRemove) removedElements.push(item.id)
                return notRemove
            }),
        }
    } else {
        const newPageStructure = resourceDraft.structure.map(item => ({
            ...item,
            path: item.path.filter(pathItem => pathItem !== elementId),
        }))

        draft = {
            ...resourceDraft,
            structure: [
                ...newPageStructure.slice(0, elementIndex),
                ...newPageStructure.slice(elementIndex + 1),
            ],
        }
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
    dispatch(deleteFromHoveredSizes(currentResource, removedElements))
}

export const duplicateBox = (
    currentResource: string,
    resourceDraft: {},
    mode: 'page' | 'plugin',
    withChildren: boolean
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, mode)
    let elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0 || routeElements.includes(elementIndex)) return

    const elementId = resourceDraft.structure[elementIndex].id

    const sourceChildren = resourceDraft.structure.filter(item =>
        item.path.includes(elementId)
    )

    const newId = `element_${resourceDraft.currentId}`
    let draft = { currentId: resourceDraft.currentId + 1 }

    if (withChildren) {
        const idMatch = { [elementId]: newId }

        const newChildren = sourceChildren
            .map(item => {
                let newItemId = `element_${draft.currentId}`
                draft.currentId += 1
                idMatch[item.id] = newItemId
                return {
                    ...item,
                    id: newItemId,
                }
            })
            .map(item => {
                return {
                    ...item,
                    // $FlowFixMe
                    path: item.path.map(pathItem => {
                        if (idMatch[pathItem]) {
                            return idMatch[pathItem]
                        } else {
                            return pathItem
                        }
                    }),
                }
            })

        draft = {
            ...resourceDraft,
            ...draft,
            structure: [
                ...resourceDraft.structure.slice(
                    0,
                    elementIndex + sourceChildren.length
                ),
                {
                    ...resourceDraft.structure[elementIndex],
                    id: newId,
                },
                ...newChildren,
                ...resourceDraft.structure.slice(
                    elementIndex + sourceChildren.length
                ),
            ],
        }
    } else {
        draft = {
            ...resourceDraft,
            ...draft,
            structure: [
                ...resourceDraft.structure.slice(
                    0,
                    elementIndex + sourceChildren.length
                ),
                {
                    ...resourceDraft.structure[elementIndex],
                    id: newId,
                },
                ...resourceDraft.structure.slice(
                    elementIndex + sourceChildren.length
                ),
            ],
        }
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
}

export const splitText = (
    start: Number,
    end: number,
    currentResource: string,
    resourceDraft: {}
) => (dispatch: Object) => {
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    let draft = { currentId: resourceDraft.currentId }

    let newId

    const text = resourceDraft.structure[elementIndex].textContent
    const textContent0 = text.substr(0, start)
    const textContent1 = text.substr(start, end - start)
    const textContent2 = text.substr(end)

    const newElements = [
        {
            ...resourceDraft.structure[elementIndex],
            textContent: textContent0,
        },
    ]
    if (textContent1.length > 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            textContent: textContent1,
            id: newId,
        })
    }

    if (textContent2.length > 0 || textContent1.length === 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            textContent: textContent2,
            id: newId,
        })
    }

    draft = {
        ...resourceDraft,
        ...draft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...newElements,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
}

export const textToSpan = (
    start: Number,
    end: number,
    currentResource: string,
    resourceDraft: {}
) => (dispatch: Object) => {
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    let newId
    let draft = { currentId: resourceDraft.currentId }

    const text = resourceDraft.structure[elementIndex].textContent
    const textContent0 = text.substr(0, start)
    const textContent1 = text.substr(start, end - start)
    const textContent2 = text.substr(end)

    const newElements = [
        {
            ...resourceDraft.structure[elementIndex],
            textContent: textContent0,
        },
    ]

    const spanId = `element_${draft.currentId}`
    draft.currentId = draft.currentId + 1
    newElements.push({
        id: spanId,
        path: [...resourceDraft.structure[elementIndex].path],
        tag: 'span',
        text: false,
        textContent: '',
        style: [],
        styles: [],
    })

    newId = `element_${draft.currentId}`
    draft.currentId = draft.currentId + 1
    newElements.push({
        ...resourceDraft.structure[elementIndex],
        path: [...resourceDraft.structure[elementIndex].path, spanId],
        textContent: textContent1,
        id: newId,
    })

    if (textContent2.length > 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            textContent: textContent2,
            id: newId,
        })
    }

    draft = {
        ...resourceDraft,
        ...draft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...newElements,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
}
// Menu
export const chooseMenuItem = (
    id: string,
    resourceId: string,
    resourcesObjects: {}
) => (dispatch: Object) => {
    const resource = resourceId
        ? resourcesObjects[resourceId]
            ? isEmpty(resourcesObjects[resourceId].present)
                ? resourcesObjects[resourceId].draft
                : resourcesObjects[resourceId].present
            : null
        : null
    if (!resource) return
    dispatch(
        changeBoxProperty('currentMenuItem', id, resourceId, resource, true)
    )
}

export const changeMenuItemProperty = (
    key: string,
    value: string,
    resourceId: string,
    resourcesObjects: {}
) => (dispatch: Object) => {
    const resource = resourceId
        ? resourcesObjects[resourceId]
            ? isEmpty(resourcesObjects[resourceId].present)
                ? resourcesObjects[resourceId].draft
                : resourcesObjects[resourceId].present
            : null
        : null

    if (!resource) return
    const elementIndex = findElementIndex(resource)
    if (elementIndex < 0) return
    if (!resource.structure[elementIndex].menuItems) return
    const newMenuItems = resource.structure[elementIndex].menuItems.map(
        item => {
            if (item.id === resource.structure[elementIndex].currentMenuItem) {
                return { ...item, [key]: value }
            } else {
                return item
            }
        }
    )
    if (!isEqual(newMenuItems, resource.structure[elementIndex].menuItems)) {
        dispatch(
            changeBoxProperty('menuItems', newMenuItems, resourceId, resource)
        )
    }
}
export const markRefreshing = (refreshing: boolean) => ({
    type: actionTypes.MARK_REFRESHING,
    refreshing,
})

export const mergeBoxToPlugin = (
    currentResource: string,
    resourceDraft: {},
    websiteId: string,
    mode: 'page' | 'plugin'
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, mode)
    let elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0 || routeElements.includes(elementIndex)) return

    const elementId = resourceDraft.structure[elementIndex].id
    let currentId = 1
    const newResourcesIds = ['element_0']
    const oldResourcesIds = ['element_0']

    const resourceDataStructure = resourceDraft.structure
        .filter(item => item.id === elementId || item.path.includes(elementId))
        .map(item => {
            oldResourcesIds.push(item.id)
            const newItem = { ...item, id: `element_${currentId}` }
            if (item.id === elementId) {
                newItem.path = ['element_0']
            } else {
                newItem.path = [
                    'element_0',
                    ...newItem.path.slice(newItem.path.indexOf(elementId)),
                ]
            }
            newResourcesIds.push(newItem.id)
            currentId++
            return newItem
        })
        .map(item => ({
            ...item,
            path: item.path.map(
                id => newResourcesIds[oldResourcesIds.indexOf(id)]
            ),
        }))

    const resourceData = {
        structure: [
            {
                id: 'element_0',
                path: [],
                tag: 'Main element',
                properties: {},
            },
            ...resourceDataStructure,
        ],
        currentId,
    }

    dispatch(
        actions.addResource(
            websiteId,
            '',
            'plugin',
            false,
            resourceData,
            data => {
                if (data.newResourceName) {
                    const draft = {
                        ...resourceDraft,
                        structure: [
                            ...resourceDraft.structure.slice(0, elementIndex),
                            {
                                ...resourceDraft.structure[elementIndex],
                                tag: data.newResourceName,
                                text: false,
                                textContent: '',
                                properties: {},
                            },
                            ...resourceDraft.structure.slice(elementIndex + 1),
                        ],
                    }
                    dispatch(actions.addResourceVersion(currentResource, draft))
                }
            }
        )
    )
}

export const dissolvePluginToBox = (
    currentResource: string,
    resourceDraft: {},
    pluginsStructure: Array<{}>,
    resourcesObjects: {}
) => (dispatch: Object) => {
    if (!currentResource || !resourceDraft) return
    let elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    const elementId = resourceDraft.structure[elementIndex].id

    const plugin = pluginsStructure.find(
        item => item.name === resourceDraft.structure[elementIndex].tag
    )
    if (!plugin) return

    const pluginResource = isEmpty(resourcesObjects[plugin.id].present)
        ? resourcesObjects[plugin.id].draft
        : resourcesObjects[plugin.id].present

    let currentId = resourceDraft.currentId
    const newResourcesIds = []
    const oldResourcesIds = []

    const pluginDataStructure = pluginResource.structure
        .filter(item => item.path.length > 0)
        .map(item => {
            oldResourcesIds.push(item.id)
            const newItem = {
                ...item,
                id: `element_${currentId}`,
                path: [...item.path.slice(1)],
            }
            newResourcesIds.push(newItem.id)
            currentId++
            return newItem
        })
        .map(item => ({
            ...item,
            path: [
                ...resourceDraft.structure[elementIndex].path,
                ...item.path.map(
                    id => newResourcesIds[oldResourcesIds.indexOf(id)]
                ),
            ],
        }))

    const draft = {
        ...resourceDraft,
        currentId,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...pluginDataStructure,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
    }
    dispatch(actions.addResourceVersion(currentResource, draft))
}
/////////////////////OLDOLDOLDOLDOLD
// export const changeElementStyleValue = (
//     index: number,
//     key: string,
//     value: any,
//     elementId: string
// ) => ({
//     type: actionTypes.CHANGE_ELEMENT_STYLE_VALUE,
//     index,
//     key,
//     value,
//     elementId,
// })

// export const addElementStyleValue = (index: number, elementId: string) => ({
//     type: actionTypes.ADD_ELEMENT_STYLE_VALUE,
//     index,
//     elementId,
// })

// export const deleteElementStyleValue = (index: number, elementId: string) => ({
//     type: actionTypes.DELETE_ELEMENT_STYLE_VALUE,
//     index,
//     elementId,
// })

// export const changeElementPropertyValue = (
//     value: any,
//     key: string,
//     isSection?: boolean,
//     isNotForHistory?: boolean
// ) => ({
//     type: actionTypes.CHANGE_ELEMENT_PROPERTY_VALUE,
//     value,
//     key,
//     isSection,
//     isNotForHistory,
// })

// export const builderZoomOut = () => ({ type: actionTypes.BUILDER_ZOOM_OUT })
// export const builderZoomIn = () => ({ type: actionTypes.BUILDER_ZOOM_IN })
// export const builderZoomReset = () => ({ type: actionTypes.BUILDER_ZOOM_RESET })

// export const saveToHistory = () => ({ type: actionTypes.SAVE_TO_HISTORY })

// export const loadCurrentPageToBuilder = (
//     _id: ?string,
//     resourcesObjects?: Object,
//     pageObject?: Object
// ) => ({
//     type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER,
//     _id,
//     resourcesObjects,
//     pageObject,
// })
