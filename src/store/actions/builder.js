import * as actions from './index'
import * as wsActions from '../../websocketActions'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import isObject from 'lodash/isObject'
import { current, resourceDraftIndex } from '../../utils/resourceTypeIndex'

import type { resourceType } from '../../store/reducer/reducer'
var htmlparser = require('htmlparser2')

const findElementIndex = (draft: resourceType): number => {
    if (!draft.currentBox) return -1
    if (draft.currentBox.length < 1) return -1
    return draft.structure.findIndex(item => item.id === draft.currentBox)
}

const findRouteElements = (
    draft: resourceType,
    mode: 'plugin' | 'template' | 'page'
): Array<number> => {
    const result = []
    if (mode === 'plugin') {
        result.push(0)
    } else if (mode === 'template') {
        draft.structure.forEach((item, index) => {
            if (item.path.length === 0 || isEqual(item.path, ['element_01']))
                result.push(index)
        })
    }
    return result
}

export const saveElementsStructure = (
    type,
    structure: $PropertyType<resourceType, 'structure'>
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!mD || !type || !resourceDraft || !structure) return

    const newStructure = structure.map(item => {
        const oldItem = resourceDraft.structure.find(
            itemInn => itemInn.id === item.id
        )
        if (oldItem)
            return {
                ...item,
                ...oldItem,
                expanded: item.expanded,
                path: item.path,
            }
        else return item
    })
    const draft = { ...resourceDraft, structure: newStructure }

    const isNotForHistory = isEqual(
        resourceDraft.structure.map(item =>
            omit(item, ['expanded', 'children', 'itemPath'])
        ),
        newStructure.map(item =>
            omit(item, ['expanded', 'children', 'itemPath'])
        )
    )
    dispatch(actions.addResourceVersion(mD, type, draft, {}, isNotForHistory))
}

export const saveElementsStructureFromBuilder = (
    type,
    structure: $PropertyType<resourceType, 'structure'>
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!mD || !type || !resourceDraft || !structure) return

    const pageTemplateDraft = mD.pageTemplateDraft
    const newValues = {}
    const newStructure = structure.map(item => {
        const oldItem = resourceDraft.structure.find(
            itemInn => itemInn.id === item.id
        )
        let newItem = { ...item }
        if (oldItem) newItem = { ...newItem, expanded: oldItem.expanded }

        newValues[item.id] = {
            ...pageTemplateDraft.values[item.id],
            value: '',
            menuItems: [],
            currentMenuItem: '',
            currentMenuId: 0,
            // properties: {},

            ...(resourceDraft.values[item.id] || {}),
        }

        return { ...newItem, path: item.path }
    })
    const draft = {
        ...resourceDraft,
        structure: newStructure,
        values: newValues,
    }

    const isNotForHistory =
        isEqual(
            resourceDraft.structure.map(item =>
                omit(item, ['expanded', 'children', 'itemPath'])
            ),
            newStructure.map(item =>
                omit(item, ['expanded', 'children', 'itemPath'])
            )
        ) && isEqual(resourceDraft.values, draft.values)
    dispatch(actions.addResourceVersion(mD, type, draft, {}, isNotForHistory))
}

export const chooseBox = (type, item: string) => (
    dispatch: Object,
    getState
) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!mD || !type || !item || !resourceDraft) return
    const draft = { ...resourceDraft, currentBox: item }
    dispatch(actions.addResourceVersion(mD, type, draft, {}, true))
    dispatch(unhoverBox())
}

export const changeBoxPropertyInStructure = (
    type,
    key: string | {},
    value: any,
    isNotForHistory?: boolean,
    boxId?: string
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!mD || !type || !key || !resourceDraft) return
    let elementIndex
    if (boxId) {
        elementIndex = resourceDraft.structure.findIndex(
            item => item.id === boxId
        )
    } else {
        elementIndex = findElementIndex(resourceDraft)
    }
    if (elementIndex < 0) return
    if (key === 'tag') {
        dispatch(
            deleteFromHoveredSizes(mD[current[type]], [
                resourceDraft.structure[elementIndex].id,
            ])
        )
    }

    let changes = {}
    if (isObject(key) && !(typeof key === 'string' || key instanceof String))
        changes = key
    else changes[key.toString()] = value
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
        actions.addResourceVersion(
            mD,
            type,
            draft,
            {
                throttle: 100,
            },
            isNotForHistory
        )
    )
}

export const changeBoxPropertyInValues = (
    type,
    key: string | {},
    value: any,
    isNotForHistory?: boolean,
    boxId?: string
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!mD || !type || !key || !resourceDraft) return
    let elementIndex
    if (boxId) {
        elementIndex = resourceDraft.structure.findIndex(
            item => item.id === boxId
        )
    } else {
        elementIndex = findElementIndex(resourceDraft)
    }
    if (elementIndex < 0) return
    if (key === 'tag') {
        dispatch(
            deleteFromHoveredSizes(mD[current[type]], [
                resourceDraft.structure[elementIndex].id,
            ])
        )
    }

    let changes = {}
    if (isObject(key) && !(typeof key === 'string' || key instanceof String))
        changes = key
    else changes[key.toString()] = value
    const draft = {
        ...resourceDraft,
        values: {
            ...resourceDraft.values,
            [resourceDraft.structure[elementIndex].id]: {
                ...resourceDraft.values[
                    resourceDraft.structure[elementIndex].id
                ],
                ...changes,
            },
        },
    }

    dispatch(
        actions.addResourceVersion(
            mD,
            type,
            draft,
            {
                throttle: 1000,
            },
            isNotForHistory
        )
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
    mode: 'plugin' | 'template' | 'page',
    type?: 'children' | 'inside' | 'text' | 'cmsVariable'
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[mode]]
    if (!resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, mode)
    let elementIndex = findElementIndex(resourceDraft)

    let putInside
    if (mode === 'plugin') {
        if (elementIndex <= 0) {
            elementIndex = 0
            putInside = true
        }
    } else if (mode === 'template') {
        if (elementIndex < 0)
            elementIndex = routeElements[routeElements.length - 1]

        if (resourceDraft.structure[elementIndex].id === 'element_01')
            elementIndex = routeElements[routeElements.length - 1]

        if (
            resourceDraft.structure[elementIndex].path.length < 2 &&
            !isEqual(resourceDraft.structure[elementIndex].path, ['element_02'])
        )
            putInside = true
    }

    const element = resourceDraft.structure[elementIndex]
    if (element.isChildren) {
        putInside = false
    } else if (element.childrenTo) {
        putInside = true
    } else {
        if (type === 'inside') putInside = true
    }

    if (type === 'inside') putInside = true

    const newId = `element_${resourceDraft.currentId}`
    const newCurrentId = resourceDraft.currentId + 1

    const isCMSVariable =
        resourceDraft.structure[elementIndex].id === 'element_02' ||
        isEqual(resourceDraft.structure[elementIndex].path, ['element_02'])

    const draft = {
        ...resourceDraft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex + 1),
            {
                id: newId,
                path: putInside
                    ? [
                          ...resourceDraft.structure[elementIndex].path,
                          resourceDraft.structure[elementIndex].id,
                      ]
                    : [...resourceDraft.structure[elementIndex].path],
                tag:
                    type === 'text'
                        ? 'text'
                        : type === 'children'
                        ? 'New children'
                        : isCMSVariable
                        ? 'New CMS variable'
                        : 'div',
                textMode: 'text',
                text: type === 'text',
                isChildren: type === 'children',
                isCMSVariable: isCMSVariable,
                isElementFromCMSVariable: type === 'cmsVariable',
            },
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
        values: {
            ...resourceDraft.values,
            [newId]: {
                textContent: '',
                properties: {},
                propertiesString: '',
                CMSVariableType: 'text',
                CMSVariableSystemName: 'newCmsVariable',
                CMSVariableDescription: 'New CMS variable description',
                CMSVariableDefaultValue: 'New CMS variable default value',
            },
        },
        currentId: newCurrentId,
        currentBox: newId,
    }
    dispatch(actions.addResourceVersion(mD, mode, draft))
}

export const deleteBox = (
    type: 'page' | 'plugin' | 'template',
    withChildren?: boolean
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, type)
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
    for (let item of removedElements) {
        delete draft.values[item.id]
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
    dispatch(deleteFromHoveredSizes(mD[current[type]], removedElements))
}

export const duplicateBox = (
    type: 'page' | 'plugin' | 'template',
    withChildren?: boolean
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, type)
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
        const newValuesElements = { [newId]: resourceDraft.values[elementId] }
        const newChildren = sourceChildren
            .map(item => {
                let newItemId = `element_${draft.currentId}`
                draft.currentId += 1
                idMatch[item.id] = newItemId
                newValuesElements[newItemId] = resourceDraft.values[item.id]
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
            values: {
                ...resourceDraft.values,
                ...newValuesElements,
            },
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
            values: {
                ...resourceDraft.values,
                [newId]: resourceDraft.values[elementId],
            },
        }
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
}

export const splitText = (type, start: number, end: number) => (
    dispatch: Object,
    getState
) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    let draft = { currentId: resourceDraft.currentId }

    let newId

    const text = resourceDraft.structure[elementIndex].textContent
    if (!text) return
    const textContent0 = text.substr(0, start)
    const textContent1 = text.substr(start, end - start)
    const textContent2 = text.substr(end)

    const newElements = [
        {
            ...resourceDraft.structure[elementIndex],
        },
    ]

    const newValues = {
        [elementIndex]: {
            ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
            textContent: textContent0,
        },
    }

    if (textContent1.length > 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            id: newId,
        })
        newValues[newId] = {
            ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
            textContent: textContent1,
        }
    }

    if (textContent2.length > 0 || textContent1.length === 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            id: newId,
        })
        newValues[newId] = {
            ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
            textContent: textContent2,
        }
    }

    draft = {
        ...resourceDraft,
        ...draft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...newElements,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
        values: {
            ...resourceDraft.values,
            ...newValues,
        },
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
}

export const textToSpan = (type, start: number, end: number) => (
    dispatch: Object,
    getState
) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    let newId
    let draft = { currentId: resourceDraft.currentId }

    const text = resourceDraft.structure[elementIndex].textContent
    if (!text) return
    const textContent0 = text.substr(0, start)
    const textContent1 = text.substr(start, end - start)
    const textContent2 = text.substr(end)

    const newElements = [
        {
            ...resourceDraft.structure[elementIndex],
        },
    ]

    const newValues = {
        [elementIndex]: {
            ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
            textContent: textContent0,
        },
    }

    const spanId = `element_${draft.currentId}`
    draft.currentId = draft.currentId + 1
    newElements.push({
        id: spanId,
        path: [...resourceDraft.structure[elementIndex].path],
        tag: 'span',
        text: false,
    })

    newValues[spanId] = {
        textContent: '',
        style: '',
        properties: {},
    }

    newId = `element_${draft.currentId}`
    draft.currentId = draft.currentId + 1
    newElements.push({
        ...resourceDraft.structure[elementIndex],
        path: [...resourceDraft.structure[elementIndex].path, spanId],
        textContent: textContent1,
        id: newId,
    })

    newValues[newId] = {
        ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
        textContent: textContent1,
    }

    if (textContent2.length > 0) {
        newId = `element_${draft.currentId}`
        draft.currentId = draft.currentId + 1
        newElements.push({
            ...resourceDraft.structure[elementIndex],
            textContent: textContent2,
            id: newId,
        })
        newValues[newId] = {
            ...resourceDraft.values[resourceDraft.structure[elementIndex].id],
            textContent: textContent2,
        }
    }

    draft = {
        ...resourceDraft,
        ...draft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...newElements,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
        values: {
            ...resourceDraft.values,
            ...newValues,
        },
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
}
//Menu

export const changeMenuItemProperty = (
    type,
    key: string,
    value: string,
    itemId?: string
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resource = mD[resourceDraftIndex[type]]

    if (!resource) return

    const elementIndex = findElementIndex(resource)
    if (elementIndex < 0) return
    const elementId = resource.structure[elementIndex].id

    if (!resource.values[elementId].menuItems) return
    const newMenuItems = resource.values[elementId].menuItems.map(item => {
        if (
            item.id ===
            (itemId ? itemId : resource.values[elementId].currentMenuItem)
        ) {
            return { ...item, [key]: value }
        } else {
            return item
        }
    })
    if (!isEqual(newMenuItems, resource.values[elementId].menuItems)) {
        dispatch(changeBoxPropertyInValues(type, 'menuItems', newMenuItems))
    }
}
export const markRefreshing = (refreshing: boolean) => ({
    type: 'MARK_REFRESHING',
    refreshing,
})

export const markShouldRefreshing = (value?: boolean) => ({
    type: 'MARK_SHOULD_REFRESHING',
    value,
})

export const mergeBoxToPlugin = (
    type: 'page' | 'plugin' | 'template',
    onlyChildren?: boolean
) => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]

    if (!resourceDraft) return
    const routeElements = findRouteElements(resourceDraft, type)
    let elementIndex = findElementIndex(resourceDraft)
    if (
        elementIndex <= 0 ||
        (!onlyChildren && routeElements.includes(elementIndex))
    )
        return

    const elementId = resourceDraft.structure[elementIndex].id
    let currentId = 1
    const newResourcesIds = ['element_0']
    const oldResourcesIds = ['element_0']
    const resourceDataValues = {}

    const resourceDataStructure = resourceDraft.structure
        .filter(
            item =>
                (!onlyChildren && item.id === elementId) ||
                item.path.includes(elementId)
        )
        .map(item => {
            oldResourcesIds.push(item.id)
            const newItem = { ...item, id: `element_${currentId}` }
            resourceDataValues[newItem.id] = {
                ...resourceDraft.values[item.id],
            }
            if (item.id === elementId) {
                newItem.path = ['element_0']
            } else {
                newItem.path = [
                    'element_0',
                    ...newItem.path.slice(
                        newItem.path.indexOf(elementId) + (onlyChildren ? 1 : 0)
                    ),
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
    if (resourceDataStructure.length === 0) return
    const resourceData = {
        structure: [
            {
                id: 'element_0',
                path: [],
                tag: 'Main element',
                textMode: '',
            },
            ...resourceDataStructure,
        ],
        values: {
            ...resourceDataValues,
            element_0: {
                properties: {},
                propertiesString: '',
                textContent: '',
            },
        },
        currentId,
    }

    const newPluginName =
        prompt('Name the new plugin', 'New plugin') || 'New plugin'

    dispatch(
        wsActions.addResource('plugin', false, newPluginName, resourceData)
    )

    const draft = {
        ...resourceDraft,
        structure: [
            ...resourceDraft.structure.slice(
                0,
                elementIndex + (onlyChildren ? 1 : 0)
            ),
            {
                ...resourceDraft.structure[elementIndex],
                path: [
                    ...resourceDraft.structure[elementIndex].path,
                    ...(onlyChildren
                        ? [resourceDraft.structure[elementIndex].id]
                        : []),
                ],
                tag: newPluginName,
                text: false,
                id: oldResourcesIds[1],
            },
            ...resourceDraft.structure.slice(
                elementIndex +
                    (onlyChildren ? 1 : 0) +
                    resourceDataStructure.length
            ),
        ],
        values: {
            ...resourceDraft.values,
            [oldResourcesIds[1]]: {
                textContent: '',
                propertiesString: '',
                properties: {},
            },
        },
    }
    for (let i = 2; i < oldResourcesIds.length; i++) {
        delete draft.values[oldResourcesIds[i]]
    }
    dispatch(actions.addResourceVersion(mD, type, draft, { throttle: 1000 }))
}

export const dissolvePluginToBox = type => (dispatch: Object, getState) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    let elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return

    // const elementId = resourceDraft.structure[elementIndex].id

    const plugin = mD.pluginsStructure.find(
        item => item.name === resourceDraft.structure[elementIndex].tag
    )
    if (!plugin) return
    if (!mD.resourcesObjects[plugin.id]) return

    const pluginResource = !mD.resourcesObjects[plugin.id].present.structure
        ? mD.resourcesObjects[plugin.id].draft
        : mD.resourcesObjects[plugin.id].present

    let currentId = resourceDraft.currentId
    const newResourcesIds = []
    const oldResourcesIds = []
    const pluginDataValues = {}

    const pluginDataStructure = pluginResource.structure
        .filter(item => item.path.length > 0)
        .map(item => {
            oldResourcesIds.push(item.id)
            const newItem = {
                ...item,
                id: `element_${currentId}`,
                path: [...item.path.slice(1)],
            }
            pluginDataValues[newItem.id] = resourceDraft.values[item.id]

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
        values: {
            ...resourceDraft.values,
            ...pluginDataValues,
        },
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
}

export const setCurrentSiteBuilderMode = (mode: string) => ({
    type: 'SET_CURRENT_SITEBUILDER_MODE',
    mode,
})

export const parseHTML = (type, value: string) => (
    dispatch: Object,
    getState
) => {
    const { mD } = getState()
    const resourceDraft = mD[resourceDraftIndex[type]]
    if (!resourceDraft) return
    const elementIndex = findElementIndex(resourceDraft)
    if (elementIndex < 0) return
    let draft = { currentId: resourceDraft.currentId }

    const htmlArray = htmlparser.parseDOM(value)
    const newElements = []
    const newElementsValues = {}
    const parseToWebsiter = (curArray, path) => {
        curArray.forEach(item => {
            if (!(item.type === 'text' && item.data.trim() === '')) {
                if (item.type === 'text' || item.type === 'tag') {
                    const newId = `element_${draft.currentId}`
                    draft.currentId = draft.currentId + 1
                    const properties = item.attribs
                        ? omit(item.attribs, 'style')
                        : {}
                    const newElement = {
                        id: newId,
                        path,
                        tag: item.name || 'div',
                        text: false,
                    }
                    const newElementValues = {
                        textContent: '',
                        style: item.attribs ? item.attribs.style || '' : '',
                        properties,
                        propertiesString: JSON.stringify(properties),
                    }
                    if (item.type === 'text') {
                        newElement.tag = 'text'
                        newElement.text = true
                        newElementValues.textMode = 'text'
                        newElementValues.textContent = item.data
                    }
                    newElements.push(newElement)
                    newElementsValues[newId] = newElementValues
                    if (item.children)
                        parseToWebsiter(item.children, [...path, newId])
                }
            }
        })
    }
    parseToWebsiter(htmlArray, resourceDraft.structure[elementIndex].path)
    draft = {
        ...resourceDraft,
        ...draft,
        structure: [
            ...resourceDraft.structure.slice(0, elementIndex),
            ...newElements,
            ...resourceDraft.structure.slice(elementIndex + 1),
        ],
        values: {
            ...resourceDraft.values,
            ...newElementsValues,
        },
    }
    dispatch(actions.addResourceVersion(mD, type, draft))
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
