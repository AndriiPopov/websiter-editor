import * as actions from './'
import * as wsActions from '../../websocketActions'
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

    if (mD.globalSettingsPageId !== id && resourceType === 'page') {
        userObject.settings.websites[
            userObject.settings.currentWebsite
        ].currentPageFSBId = id
    }

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
    isNotForHistory?: boolean,
    globalSettings
) => ({
    type: 'ADD_RESOURCE_VERSION',
    mD,
    resourceType,
    draft,
    meta,
    isNotForHistory,
    globalSettings,
})

// export const undoResourceVersion = () => ({
//     type: 'UNDO_RESOURCE_VERSION',
// })

// export const redoResourceVersion = () => ({
//     type: 'REDO_RESOURCE_VERSION',
// })

export const setActiveContainer = container => ({
    type: 'SET_ACTIVE_CONTAINER',
    container,
})

export const unsetActiveContainer = container => ({
    type: 'UNSET_ACTIVE_CONTAINER',
    container,
})

export const removeResourceFromUnsaved = data => ({
    type: 'REMOVE_RESOURCE_FROM_UNSAVED',
    _id: data._id,
})

export const removeResourceFromNewVersions = data => ({
    type: 'REMOVE_RESOURCE_FROM_NEW_VERSIONS',
    _id: data._id,
})
