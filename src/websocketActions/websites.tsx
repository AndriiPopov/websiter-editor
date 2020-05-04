import { webSocket } from '../components/ReserveWebsite/ReserveWebsite'
import { sendUpdate } from './sendUpdate'
import cloneDeep from 'lodash/cloneDeep'

export const changeWebsiteProperty = (key, value, id) => (
    dispatch,
    getState
) => {
    const { mD } = getState()
    if (!mD.currentWebsiteObject || !mD.currentWebsiteId) return
    const newResource = cloneDeep(
        id ? mD.resourcesObjects[id] : mD.currentWebsiteObject
    )
    if (!newResource) return
    newResource[key] = value
    dispatch(sendUpdate('website', newResource, mD.currentWebsiteId))
}

export const addWebsite = (duplicate?: boolean) => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'addWebsite',
                _id: mD.currentWebsiteId,
                duplicate,
            })
        )
    }
}

export const deleteWebsite = () => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (!window.confirm('Are you sure you want to delete this website?')) return
    const { mD } = getState()
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'deleteWebsite',
                _id: mD.currentWebsiteId,
            })
        )
    }
}

export const verifyCustomDomain = () => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (webSocket && webSocket.readyState !== 3) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'verifyCustomDomain',
                _id: mD.currentWebsiteId,
            })
        )
    }
}

export const sharingRightsChange = (userId, right, value) => (
    dispatch,
    getState
) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (mD.currentWebsiteObject) {
        const newSharing = cloneDeep(mD.currentWebsiteObject.sharing)
        const account = newSharing.find(item => item.userId === userId)
        if (account) {
            let newRights = []
            if (value) {
                newRights = [...account.rights, right]
            } else {
                newRights = account.rights.filter(item => item !== right)
            }
            // const updatedSharing = mD.currentWebsiteObject.sharing.filter(
            //     item => item.userId !== userId
            // )
            // updatedSharing.push({
            //     ...account,
            //     rights: newRights,
            // })
            account.rights = newRights
            dispatch(
                changeWebsiteProperty(
                    'sharing',
                    newSharing,
                    mD.currentWebsiteId
                )
            )
        }
    }
}

export const addUserInWebsiteSharing = () => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (mD.currentWebsiteObject) {
        const id = window.prompt('Paste the user id to share the website.')
        if (!id) return
        webSocket.send(
            JSON.stringify({
                messageCode: 'addUserInSharing',
                _id: mD.currentWebsiteId,
                userId: id,
                type: 'add',
            })
        )
    }
}

export const deleteUserInWebsiteSharing = userId => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (
        !window.confirm(
            'Are you sure you want to delete this user from sharing?'
        )
    )
        return
    const { mD } = getState()
    if (userId && userId !== mD.userId) {
        if (
            !window.confirm(
                'Are you sure you want to remove this user from sharing?'
            )
        )
            return
    }

    webSocket.send(
        JSON.stringify({
            messageCode: 'addUserInSharing',
            _id: mD.currentWebsiteId,
            userId,
            type: 'delete',
        })
    )
}

export const transferWebsite = () => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (mD.currentWebsiteObject) {
        const userTo = window.prompt(
            'Enter the user id to whom you would like to transfer the website. It can be found in the user account menu tab.'
        )
        if (
            !userTo ||
            !window.confirm(
                'Are you sure you want to transfer this website to user - ' +
                    userTo +
                    '?'
            )
        )
            return

        webSocket.send(
            JSON.stringify({
                messageCode: 'transferWebsite',
                _id: mD.currentWebsiteId,
                userTo,
            })
        )
    }
}

export const saveDomainName = (name, type) => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (mD.currentWebsiteObject) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'saveDomainName',
                _id: mD.currentWebsiteId,
                name,
                type,
            })
        )
    }
}
