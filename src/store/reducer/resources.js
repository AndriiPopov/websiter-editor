import { structure, current } from '../../utils/resourceTypeIndex'
import { isEqual } from 'lodash'
import { checkIfCapital } from '../../utils/basic'

// $FlowFixMe
const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
})

const patchStructure = (state: Object, action: Object) => {
    return diffpatcher.patch(
        state[structure[action.resourceType]],
        action.structurePatch
    )
}

export const addResourceSuccess = (state: Object, action: Object) => {
    state[structure[action.resourceType]] = patchStructure(state, action)
    state.resourcesObjects[action._id] = action.resource
}

export const deleteResourceSuccess = (state: Object, action: Object) => {
    action.deletedResources.forEach(id => delete state.resourcesObjects[id])
    state[structure[action.resourceType]] = patchStructure(state, action)
    state[current[action.resourceType]] = action.current || ''
}

export const setCurrentResource = (state: Object, action: Object) => {
    state[current[action.resourceType]] = action._id
    if (action.resourceType === 'page') state.hoveredElementSize = {}
}

export const saveResourcesStructureSuccess = (
    state: Object,
    action: Object
) => {
    state[structure[action.resourceType]] = action.structure
}

export const removeResourceFromUnsaved = (state: Object, action: Object) => {
    state.notSavedResources = state.notSavedResources.filter(
        item => item !== action.currentResource
    )
}

export const savePageInState = (state: Object, action: Object) => ({
    ...state,
    resourcesObjects: {
        ...state.resourcesObjects,
        [state.currentPage]: {
            ...state.resourcesObjects[state.currentPage],
            content: action.value,
        },
    },
})

export const saveResourceDraftInState = (state: Object, action: Object) => {
    state.resourcesObjects[action.currentResource].draft = action.draft
}

export const saveResourceInState = (state: Object, action: Object) => {
    state.resourcesObjects[action.currentResource].draft = action.draft
    state.resourcesObjects[action.currentResource].present = action.draft
    state.notSavedResources = state.notSavedResources.filter(
        item => item !== action.currentResource
    )
}

export const addResourceVersion = (state: Object, action: Object) => {
    const resource = state.resourcesObjects[action.currentResource]
    if (!isEqual(resource.present, action.draft)) {
        if (action.isNotForHistory) {
            resource.present = action.draft
        } else {
            if (action.draft.structure) {
                const connectedResources = []
                action.draft.structure.forEach(item => {
                    if (item.tag.length > 0) {
                        if (checkIfCapital(item.tag.charAt(0))) {
                            connectedResources.push({
                                name: item.tag,
                                type: 'plugin',
                            })
                        }
                    }
                })
                let resource =
                    state.pagesStructure.find(
                        item => item.id === action.currentResource
                    ) ||
                    state.pluginsStructure.find(
                        item => item.id === action.currentResource
                    )
                if (resource) {
                    resource.connectedResources = connectedResources
                }
            }
            if (!state.notSavedResources.includes(action.currentResource))
                state.notSavedResources.push(action.currentResource)
            if (resource.past.length > 100) resource.past.shift()
            resource.past.push(diffpatcher.diff(resource.present, action.draft))
            resource.present = action.draft
            resource.future = []
        }
    }
}

export const undoResourceVersion = (state: Object, action: Object) => {
    const currentResource = state[current[state.currentTopTab]]
    const resource = state.resourcesObjects[currentResource]
    if (resource) {
        if (resource.past.length > 0) {
            if (
                !isEqual(
                    resource.present,
                    resource.past[resource.past.length - 1]
                )
            ) {
                if (!state.notSavedResources.includes(action.currentResource))
                    state.notSavedResources.push(action.currentResource)
            } else {
                state.notSavedResources = state.notSavedResources.filter(
                    item => item !== action.currentResource
                )
            }

            const delta = resource.past.pop()
            resource.future.unshift(delta)
            resource.present = diffpatcher.unpatch(resource.present, delta)
        }
    }
}

export const redoResourceVersion = (state: Object, action: Object) => {
    const currentResource = state[current[state.currentTopTab]]
    const resource = state.resourcesObjects[currentResource]
    if (resource) {
        if (resource.future.length > 0) {
            if (!isEqual(resource.present, resource.future[0])) {
                if (!state.notSavedResources.includes(action.currentResource))
                    state.notSavedResources.push(action.currentResource)
            } else {
                state.notSavedResources = state.notSavedResources.filter(
                    item => item !== action.currentResource
                )
            }

            const delta = resource.future.shift()
            resource.past.push(delta)
            resource.present = diffpatcher.patch(resource.present, delta)
        }
    }
}
