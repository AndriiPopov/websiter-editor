import { omit } from 'lodash'
import { initialState } from './reducer'

const findElementIndex = (state: Object): number => {
    if (state.currentPlugin.length < 1) return -1
    const plugin = state.resourcesObjects[state.currentPlugin]
    return plugin.value.structure.findIndex(
        item => item.id === state.currentBoxInPlugin
    )
}

export const savePluginsStructureToStore = (
    state: Object = initialState,
    action: Object
) => ({
    ...state,
    ...omit(action, ['type']),
    urlNotValid: false,
})

export const choosePlugin = (state: Object = initialState, action: Object) => {
    state.currentPlugin = action.id
}

export const deletePluginSuccess = (
    state: Object = initialState,
    action: Object
) => {
    const newresourcesObjects = { ...state.resourcesObjects }
    for (let i in newresourcesObjects) {
        const isDeleted = !action.pluginsStructure.some(
            item => item.id.toString() === i.toString()
        )
        if (isDeleted) {
            delete newresourcesObjects[i]
        }
    }
    return {
        ...state,
        resourcesObjects: newresourcesObjects,
        pluginsStructure: action.pluginsStructure,
        error: null,
        loading: false,
        pagesLoading: false,
        currentPlugin: '',
    }
}

export const addPluginSuccess = (
    state: Object = initialState,
    action: Object
) => ({
    ...state,
    pluginsStructure: action.pluginsStructure,
    resourcesObjects: {
        ...state.resourcesObjects,
        [action.plugin._id]: action.plugin,
    },
    error: null,
    loading: false,
    pagesLoading: false,
    currentPlugin: action.plugin._id,
})

export const savePluginInRedux = (
    state: Object = initialState,
    action: Object
) => {
    if (action.id)
        if (action.value !== state.resourcesObjects[action.id].value) {
            state.resourcesObjects[action.id] = {
                ...state.resourcesObjects[action.id],
                ...omit(action, ['type']),
            }
            state.notSavedPlugins.push(action.id)
        }
}

export const markPluginAsSaved = (
    state: Object = initialState,
    action: Object
) => {
    state.notSavedPlugins = state.notSavedPlugins.filter(
        plugin => plugin !== action.id
    )
}

export const savePluginNameChange = (
    state: Object = initialState,
    action: Object
) => {
    const index = state.pluginsStructure.findIndex(
        item => item.id === action.id
    )
    state.pluginsStructure[index].name = action.value
    state.notSavedPlugins.push(action.id)
}

export const chooseBoxInPlugin = (
    state: Object = initialState,
    action: Object
) => {
    state.currentBoxInPlugin = action.item
}

export const addBoxInPlugin = (
    state: Object = initialState,
    action: Object
) => {
    let elementIndex = findElementIndex(state)
    const plugin = state.resourcesObjects[state.currentPlugin].value
    const newId = `plugin_element_${plugin.currentId}`
    plugin.currentId += 1
    const newElement = {
        id: newId,
        path:
            elementIndex <= 0
                ? [plugin.structure[0].id]
                : [...plugin.structure[elementIndex].path],
        tag: action.text ? 'text' : 'div',
        text: action.text,
        textContent: '',
        style: [],
        styles: [],
    }

    plugin.structure.splice(elementIndex + 1, 0, newElement)
}

export const deleteBoxInPlugin = (
    state: Object = initialState,
    action: Object
) => {
    let elementIndex = findElementIndex(state)
    if (elementIndex < 0) {
        return
    }
    const plugin = state.resourcesObjects[state.currentPlugin].value

    const elementId = plugin.structure[elementIndex].id

    if (action.withChildren) {
        plugin.structure = plugin.structure.filter(
            item => elementId !== item.id && !item.path.includes(elementId)
        )
    } else {
        plugin.structure = plugin.structure.map(item => {
            return {
                ...item,
                path: item.path.filter(pathItem => pathItem !== elementId),
            }
        })
        plugin.structure.splice(elementIndex, 1)
    }
}

export const duplicateBoxInPlugin = (
    state: Object = initialState,
    action: Object
) => {
    let elementIndex = findElementIndex(state)
    if (elementIndex < 0) {
        return { ...state }
    }
    const plugin = state.resourcesObjects[state.currentPlugin].value

    const elementId = plugin.structure[elementIndex].id

    const sourceChildren = plugin.structure.filter(item =>
        item.path.includes(elementId)
    )

    const newId = `plugin_element_${plugin.currentId}`
    plugin.currentId += 1
    let newChildren = []

    if (action.withChildren) {
        const idMatch = { [elementId]: newId }

        newChildren = sourceChildren
            .map(item => {
                let newItemId = `plugin_element_${plugin.currentId}`
                plugin.currentId += 1
                idMatch[item.id] = newItemId
                return {
                    ...item,
                    id: newItemId,
                }
            })
            .map(item => {
                return {
                    ...item,
                    path: item.path.map(pathItem => {
                        if (idMatch[pathItem]) {
                            return idMatch[pathItem]
                        } else {
                            return pathItem
                        }
                    }),
                }
            })
    }
    plugin.structure.splice(
        elementIndex + sourceChildren.length + 1,
        0,
        {
            ...plugin.structure[elementIndex],
            id: newId,
        },
        ...newChildren
    )
}

export const changeBoxPropertyInPlugin = (state: Object, action: Object) => {
    const elementIndex = findElementIndex(state)
    if (elementIndex < 0) return
    state.resourcesObjects[state.currentPlugin].value.structure[elementIndex][
        action.key
    ] = action.value
}

export const saveStructureInPlugin = (state: Object, action: Object) => {
    if (state.resourcesObjects[state.currentPlugin]) {
        state.resourcesObjects[state.currentPlugin].value.structure =
            action.structure
    }
}
