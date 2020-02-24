import { webSocket } from '../components/ReserveWebsite/ReserveWebsite'

export const deleteImage = (url: string) => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (
        window.confirm(
            'Are you sure you want to delete this image? The image will be unavailable after the deletion and will not be visible in all elements and on all pages of your websites.'
        )
    ) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'deleteImage',
                url,
                _id: mD.currentWebsiteId,
            })
        )
    }
}

export const renameImage = (url: string) => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    const label = window.prompt('Type a new name for the image.')
    if (label !== null) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'renameImage',
                url,
                _id: mD.currentWebsiteId,
                label,
            })
        )
    }
}
