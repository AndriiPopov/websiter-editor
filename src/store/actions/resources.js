import axios from 'axios'
import { isEqual } from 'lodash'

import { actionStart, actionFail, actionSuccess } from './website'

import type {
    initialStateType,
    resourceType,
} from '../../store/reducer/reducer'

// $FlowFixMe
const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
})

export const addResource = (
    websiteId: $PropertyType<initialStateType, 'loadedWebsite'>,
    currentResourceId: $PropertyType<initialStateType, 'currentPage'>,
    resourceType: 'page' | 'plugin',
    duplicate?: boolean,
    resourceData?: resourceType,
    callback?: Function
) => (dispatch: Object) => {
    dispatch(actionStart())
    return axios
        .post(
            '/api/resources',
            JSON.stringify({
                websiteId,
                currentResourceId,
                duplicate,
                type: resourceType,
                resourceData,
            })
        )
        .then(response => {
            dispatch(addResourceSuccess(response.data, resourceType))
            if (callback) callback(response.data)
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

const addResourceSuccess = (data: Object, resourceType: 'page' | 'plugin') => ({
    type: 'ADD_RESOURCE_SUCCESS',
    ...data,
    resourceType,
})

export const deleteResource = (
    currentResourceId: $PropertyType<initialStateType, 'currentPage'>,
    resourceType: 'page' | 'plugin'
) => (dispatch: Object) => {
    if (!currentResourceId) return
    if (
        !window.confirm(`Are you sure you want to delete this ${resourceType}?`)
    )
        return
    dispatch(actionStart())
    return axios
        .delete(`/api/resources/${currentResourceId}`, {
            params: { type: resourceType },
        })
        .then(response => {
            dispatch(deleteResourceSuccess(response.data, resourceType))
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

const deleteResourceSuccess = (
    data: Object,
    resourceType: 'page' | 'plugin'
) => ({
    type: 'DELETE_RESOURCE_SUCCESS',
    ...data,
    resourceType,
})

export const saveResourcesStructure = (
    _id: $PropertyType<initialStateType, 'loadedWebsite'>,
    newStructure: $PropertyType<initialStateType, 'pagesStructure'>,
    oldStructure: $PropertyType<initialStateType, 'pagesStructure'>,
    resourceType: 'page' | 'plugin'
) => (dispatch: Object) => {
    dispatch(actionStart())
    const structurePatch = diffpatcher.diff(oldStructure, newStructure)
    if (!structurePatch) dispatch(actionSuccess())
    else {
        return axios
            .put(
                `/api/websites/structure/${_id}`,
                JSON.stringify({ structurePatch, type: resourceType })
            )
            .then(response => {
                dispatch(
                    saveResourcesStructureSuccess(newStructure, resourceType)
                )
                dispatch(actionSuccess())
            })
            .catch(err => {
                dispatch(actionFail(err.message))
            })
    }
}

const saveResourcesStructureSuccess = (
    structure: $PropertyType<initialStateType, 'pagesStructure'>,
    resourceType: 'page' | 'plugin'
) => ({
    type: 'SAVE_RESOURCES_STRUCTURE_SUCCESS',
    structure,
    resourceType,
})

export const chooseResource = (
    _id: string,
    resourceType: 'plugin' | 'page'
) => ({
    type: 'SET_CURRENT_RESOURCE',
    _id,
    resourceType,
})

export const saveResource = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    structure: $PropertyType<initialStateType, 'pagesStructure'>,
    resourceType: 'page' | 'plugin'
) => (dispatch: Object) => {
    const present = resourcesObjects[currentResource].present
    const draft = resourcesObjects[currentResource].draft
    if (isEqual(present, {})) return
    dispatch(actionStart())
    const resourcePatch = diffpatcher.diff(draft, present)

    return axios
        .put(
            `/api/resources/${currentResource}`,
            JSON.stringify({ resourcePatch, structure, type: resourceType })
        )
        .then(response => {
            dispatch(saveResourceInState(currentResource, present))
            dispatch(saveResourcesStructureSuccess(structure, resourceType))
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

const saveResourceInState = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    draft: resourceType
) => ({
    type: 'SAVE_RESOURCE_IN_STATE',
    currentResource,
    draft,
})

const saveResourceDraftInState = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    draft: resourceType
) => ({
    type: 'SAVE_RESOURCE_DRAFT_IN_STATE',
    currentResource,
    draft,
})

export const publishRevertResource = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    structure: $PropertyType<initialStateType, 'pagesStructure'>,
    resourceType: 'page' | 'plugin',
    revert: ?boolean,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>
) => (dispatch: Object) => {
    dispatch(actionStart())
    return axios
        .put(
            `/api/resources/publish/${currentResource}`,
            JSON.stringify({ structure, type: resourceType, revert })
        )
        .then(response => {
            dispatch(saveResourcesStructureSuccess(structure, resourceType))
            if (response.data.draft) {
                dispatch(
                    saveResourceDraftInState(
                        currentResource,
                        response.data.draft
                    )
                )
                dispatch(
                    addResourceVersion(currentResource, response.data.draft)
                )
                dispatch(removeResourceFromUnsaved(currentResource))
            }
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

export const revertResourceToSaved = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>
) => (dispatch: Object) => {
    dispatch(
        addResourceVersion(
            currentResource,
            resourcesObjects[currentResource].draft
        )
    )
    dispatch(removeResourceFromUnsaved(currentResource))
}

const removeResourceFromUnsaved = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>
) => ({
    type: 'REMOVE_RESOURCE_FROM_UNSAVED',
    currentResource,
})

export const addResourceVersion = (
    currentResource: $PropertyType<initialStateType, 'currentPage'>,
    draft: resourceType,
    isNotForHistory?: boolean
) => ({
    type: 'ADD_RESOURCE_VERSION',
    currentResource,
    draft,
    isNotForHistory,
})

export const undoResourceVersion = () => ({
    type: 'UNDO_RESOURCE_VERSION',
})

export const redoResourceVersion = () => ({
    type: 'REDO_RESOURCE_VERSION',
})

export const chooseBoxInPlugin = (item: string, ctrl?: boolean) => ({
    type: 'CHOOSE_BOX_IN_PLUGIN',
    item,
})

export const addBoxInPlugin = (text: boolean) => ({
    type: 'ADD_BOX_IN_PLUGIN',
    text,
})

export const deleteBoxInPlugin = (withChildren: boolean) => ({
    type: 'DELETE_BOX_IN_PLUGIN',
    withChildren,
})
export const duplicateBoxInPlugin = (withChildren: boolean) => ({
    type: 'DUPLICATE_BOX_IN_PLUGIN',
    withChildren,
})

export const changeBoxPropertyInPlugin = (key: string, value: any) => ({
    type: 'CHANGE_BOX_PROPERTY_IN_PLUGIN',
    key,
    value,
})

export const saveStructureInPlugin = (
    structure: $PropertyType<initialStateType, 'pagesStructure'>
) => ({
    type: 'SAVE_STRUCTURE_IN_PLUGIN',
    structure,
})
