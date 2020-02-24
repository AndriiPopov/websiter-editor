import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'

const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
    propertyFilter: (name, context) => name !== '__patch__',
})

export const addResource = (data: Object) => (dispatch, getState) => {
    dispatch(addResourceDo(data))
}

export const addResourceDo = (data: Object) => ({
    type: 'ADD_RESOURCE',
    data,
})

export const deleteResource = (data: Object) => ({
    type: 'DELETE_RESOURCE',
    data,
})

export const revertResource = (data: Object) => ({
    type: 'REVERT_RESOURCE',
    data,
})

export const updateUser = (data: Object, webSocket) => (dispatch, getState) => {
    if (data) {
        const { mD } = getState()
        const currentUser = omit(
            cloneDeep(mD.resourcesObjects[data.resourceId]),
            ['settings']
        )
        if (currentUser) {
            if (currentUser.__v === data.resource.__v - 1) {
                currentUser.websites = diffpatcher.patch(
                    currentUser.websites,
                    data.resource.__patch__
                )
                currentUser.__v = data.resource.__v
                dispatch(addResource(currentUser, mD))
                return
            }
        }
        requestResource(data.resource._id, data.type, webSocket)
    }
}

export const updateWebsite = (data: Object, webSocket) => (
    dispatch,
    getState
) => {
    if (data) {
        const { mD } = getState()
        const currentWebsite = cloneDeep(mD.resourcesObjects[data.resourceId])
        if (currentWebsite) {
            if (currentWebsite.__v === data.resource.__v - 1) {
                const newWebsite = diffpatcher.patch(
                    currentWebsite,
                    data.resource.__patch__
                )
                newWebsite.__v = data.resource.__v
                dispatch(addResource(newWebsite, mD))
                return
            }
        }
        requestResource(data.resource._id, data.type, webSocket)
    }
}

export const updateResource = (data: Object, webSocket) => (
    dispatch,
    getState
) => {
    if (data) {
        const { mD } = getState()
        const currentResource = cloneDeep(mD.resourcesObjects[data.resourceId])
        if (currentResource) {
            if (currentResource.__v === data.resource.__v - 1) {
                if (!isEmpty(data.resource.__patch__)) {
                    currentResource.draft = diffpatcher.patch(
                        currentResource.draft,
                        data.resource.__patch__
                    )
                }
                currentResource.__v = data.resource.__v
                dispatch(addResource(currentResource, mD))
                return
            }
        }
        requestResource(data.resource._id, data.type, webSocket)
    }
}

const requestResource = (id, type, webSocket) => {
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'requestResource',
                id,
                type,
            })
        )
    }
}
