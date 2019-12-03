import axios from 'axios'

import { actionStart, actionFail, actionSuccess } from './website'
import * as actionTypes from './actionTypes'
import { isEqual } from 'lodash'

// $FlowFixMe
const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
})

export const addResource = (
    websiteId: string,
    currentResourceId: string,
    resourceType: string,
    duplicate?: boolean,
    resourceData?: Object,
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

const addResourceSuccess = (data: Object, resourceType: string) => ({
    type: 'ADD_RESOURCE_SUCCESS',
    ...data,
    resourceType,
})

export const deleteResource = (
    currentResourceId: string,
    resourceType: string
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

const deleteResourceSuccess = (data: Object, resourceType: string) => ({
    type: 'DELETE_RESOURCE_SUCCESS',
    ...data,
    resourceType,
})

export const saveResourcesStructure = (
    _id: string,
    newStructure: Array<{}>,
    oldStructure: Array<{}>,
    resourceType: string
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
    structure: Array<{}>,
    resourceType: string
) => ({
    type: 'SAVE_RESOURCES_STRUCTURE_SUCCESS',
    structure,
    resourceType,
})

export const chooseResource = (_id: string, resourceType: boolean) => ({
    type: 'SET_CURRENT_RESOURCE',
    _id,
    resourceType,
})

export const saveResource = (
    currentResource: string,
    resourcesObjects: {},
    structure: Array<{}>,
    resourceType: string
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

const saveResourceInState = (currentResource: string, draft: Object) => ({
    type: 'SAVE_RESOURCE_IN_STATE',
    currentResource,
    draft,
})

const saveResourceDraftInState = (currentResource: string, draft: Object) => ({
    type: 'SAVE_RESOURCE_DRAFT_IN_STATE',
    currentResource,
    draft,
})

export const publishRevertResource = (
    currentResource: string,
    structure: Array<{}>,
    resourceType: string,
    revert: boolean,
    resourcesObjects: Object
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
    currentResource: string,
    resourcesObjects: Object
) => (dispatch: Object) => {
    dispatch(
        addResourceVersion(
            currentResource,
            resourcesObjects[currentResource].draft
        )
    )
    dispatch(removeResourceFromUnsaved(currentResource))
}

const removeResourceFromUnsaved = (currentResource: string) => ({
    type: 'REMOVE_RESOURCE_FROM_UNSAVED',
    currentResource,
})

export const addResourceVersion = (
    currentResource: string,
    draft: {},
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
    type: actionTypes.CHOOSE_BOX_IN_PLUGIN,
    item,
})

export const addBoxInPlugin = (text: boolean) => ({
    type: actionTypes.ADD_BOX_IN_PLUGIN,
    text,
})

export const deleteBoxInPlugin = (withChildren: boolean) => ({
    type: actionTypes.DELETE_BOX_IN_PLUGIN,
    withChildren,
})
export const duplicateBoxInPlugin = (withChildren: boolean) => ({
    type: actionTypes.DUPLICATE_BOX_IN_PLUGIN,
    withChildren,
})

export const changeBoxPropertyInPlugin = (key: string, value: any) => ({
    type: actionTypes.CHANGE_BOX_PROPERTY_IN_PLUGIN,
    key,
    value,
})

export const saveStructureInPlugin = (structure: Array<{}>) => ({
    type: actionTypes.SAVE_STRUCTURE_IN_PLUGIN,
    structure,
})
