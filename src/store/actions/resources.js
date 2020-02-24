import * as actions from './'
import { current } from '../../utils/resourceTypeIndex'
import cloneDeep from 'lodash/cloneDeep'

export const chooseResource = (
    id: string,
    resourceType: 'plugin' | 'page' | 'template'
) => (dispatch, getState) => {
    const { mD } = getState()
    const userObject = cloneDeep(mD.userObject)
    if (!userObject.settings.websites[userObject.settings.currentWebsite])
        userObject.settings.websites[userObject.settings.currentWebsite] = {}
    userObject.settings.websites[userObject.settings.currentWebsite][
        current[resourceType]
    ] = id
    dispatch(actions.saveObject(userObject))
}

export const addResourceVersion = (
    mD,
    resourceType,
    draft,
    meta,
    isNotForHistory?: boolean
) => ({
    type: 'ADD_RESOURCE_VERSION',
    mD,
    resourceType,
    draft,
    meta,
    isNotForHistory,
})

export const undoResourceVersion = () => ({
    type: 'UNDO_RESOURCE_VERSION',
})

export const redoResourceVersion = () => ({
    type: 'REDO_RESOURCE_VERSION',
})

export const removeResourceFromUnsaved = data => ({
    type: 'REMOVE_RESOURCE_FROM_UNSAVED',
    _id: data._id,
})
