import { webSocket } from '../components/ReserveWebsite/ReserveWebsite'
import { current, resourceObjectIndex } from '../utils/resourceTypeIndex'
import * as actions from '../store/actions'

export const addResource = (
    type: 'page' | 'plugin' | 'template',
    duplicate?: boolean,
    newResourceName?: string,
    resourceData?: {}
) => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'addResource',
                type,
                websiteId: mD.currentWebsiteId,
                duplicate,
                _id: mD[current[type]],
                name: newResourceName,
                resourceData,
            })
        )
    }
}

export const deleteResource = (type: 'page' | 'plugin' | 'template') => (
    dispatch: Object,
    getState
) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'deleteResource',
                type,
                _id: mD[current[type]],
            })
        )
    }
}

export const publishResource = (type: 'page' | 'plugin' | 'template') => (
    dispatch: Object,
    getState
) => {
    const { mD } = getState()
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'publishResource',
                type,
                _id: mD[current[type]],
            })
        )
    }
}

export const revertResource = (type, to) => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (to === 'draft') {
        dispatch(
            actions.revertResource({
                _id: mD[current[type]],
                draft: mD[resourceObjectIndex[type]].draft,
                to,
            })
        )
    } else {
        if (webSocket && webSocket.readyState !== 3) {
            webSocket.send(
                JSON.stringify({
                    messageCode: 'revertResource',
                    type,
                    _id: mD[current[type]],
                    to,
                })
            )
        }
    }
}
