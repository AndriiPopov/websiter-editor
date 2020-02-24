import {
    structure,
    current,
    resourceObjectIndex,
} from '../../utils/resourceTypeIndex'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { checkIfCapital } from '../../utils/basic'
import resourcesAreEqual from '../../utils/resourcesAreEqual'

// $FlowFixMe
const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
    propertyFilter: (name, context) => name !== '__patch__',
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
    state.resourcesObjects[action.mD.currentWebsiteId][
        current[action.resourceType]
    ] = action._id
    if (action.resourceType === 'page') {
        state.hoveredElementSize = {}
    }
}

export const saveResourcesStructureSuccess = (
    state: Object,
    action: Object
) => {
    state[structure[action.resourceType]] = action.structure
}

export const removeResourceFromUnsaved = (state: Object, action: Object) => {
    state.notSavedResources = state.notSavedResources.filter(
        item => item !== action._id
    )
}

export const addResourceToUnsaved = (state: Object, action: Object) => {
    if (!state.notSavedResources.includes(action._id))
        state.notSavedResources.push(action._id)
}

export const removeResourceFromNewVersions = (
    state: Object,
    action: Object
) => {
    state.newVersionResources = state.newVersionResources.filter(
        item => item !== action._id
    )
}

export const addResourceToNewVersions = (state: Object, action: Object) => {
    if (!state.newVersionResources.includes(action._id))
        state.newVersionResources.push(action._id)
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
    const resource = cloneDeep(
        action.mD[resourceObjectIndex[action.resourceType]]
    )
    if (!isEqual(resource.present, action.draft)) {
        if (action.isNotForHistory) {
            resource.present = action.draft
            state.resourcesObjects[resource._id] = resource
        } else {
            const newDraft = { ...action.draft }
            if (
                action.draft.structure &&
                ['template', 'plugin'].includes(action.resourceType)
            ) {
                const connectedResources = []
                action.draft.structure.forEach(item => {
                    if (item.tag.length > 0 && item.path.length > 0) {
                        if (
                            checkIfCapital(item.tag.charAt(0)) &&
                            !item.childrenTo &&
                            !item.isChildren &&
                            !item.isElementFromCMSVariable
                        ) {
                            connectedResources.push({
                                name: item.tag,
                                type: 'plugin',
                            })
                        }
                    }
                })
                newDraft.connectedResources = connectedResources

                // let resource =
                //     state.resourcesObjects[
                //         state.resourcesObjects[state.userId].loadedWebsite
                //     ].templatesStructure.find(
                //         item => item.id === action.currentResource
                //     ) ||
                //     state.pluginsStructure.find(
                //         item => item.id === action.currentResource
                //     )
                // if (resource) {
                //     resource.connectedResources = connectedResources
                // }
            }
            const currentResourceId = action.mD[current[action.resourceType]]
            if (
                !resourcesAreEqual(
                    resource.present.structure
                        ? resource.present
                        : resource.draft,
                    newDraft
                )
            ) {
                console.log(
                    resource.present.structure
                        ? resource.present
                        : resource.draft
                )
                console.log(newDraft)
                if (!state.notSavedResources.includes(currentResourceId))
                    state.notSavedResources.push(currentResourceId)
            }
            if (resource.past.length > 100) resource.past.shift()
            resource.past.push(diffpatcher.diff(resource.present, newDraft))
            resource.present = newDraft
            resource.future = []
            state.resourcesObjects[resource._id] = resource
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
