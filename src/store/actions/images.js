import axios from 'axios'
import { webSocket } from '../../components/ReserveWebsite/ReserveWebsite'

const actionStartImageUpload = () => ({
    type: 'ACTION_START_IMAGE_UPLOAD',
})

const actionSuccessImageUpload = () => ({
    type: 'ACTION_SUCCESS_IMAGE_UPLOAD',
})

const actionFailImageUpload = (error: string) => ({
    type: 'ACTION_FAIL_IMAGE_UPLOAD',
    error,
})

const getSignedRequest = file => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (!mD.currentWebsiteId) return
    let name =
        mD.currentWebsiteId +
        '/' +
        file.name.replace(/([^a-zA-Z0-9\\.\\-])/g, '_')

    let namePrefix = ''
    let k = 0

    const checkName = () =>
        mD.currentWebsiteObject.images.findIndex(
            image => name + namePrefix === image.name
        )
    while (checkName() >= 0) {
        k++
        namePrefix = '_' + k
    }

    const fileDetails = {
        size: file.size,
        name: name + namePrefix,
        label: file.name + namePrefix,
        type: file.type,
        file,
    }

    return axios
        .post('/api/sign-s3', {
            fileName: fileDetails.name,
            fileType: file.type,
            fileSize: fileDetails.size,
            websiteId: mD.currentWebsiteId,
        })
        .then(response => {
            dispatch(
                uploadFile(
                    fileDetails,
                    response.data.signedRequest,
                    response.data.url,
                    mD.currentWebsiteId
                )
            )
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
            if (err.response.status === 400) alert(err.response.data)
        })
}

const uploadFile = (fileDetails, signedRequest, url, websiteId) => (
    dispatch: Object
) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    return axios
        .put(signedRequest, fileDetails.file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            if (webSocket)
                webSocket.send(
                    JSON.stringify({
                        messageCode: 'addImage',
                        _id: websiteId,
                        size: fileDetails.size,
                        name: fileDetails.name,
                        label: fileDetails.label,
                        type: fileDetails.type,
                        url,
                    })
                )
            dispatch(actionSuccessImageUpload())
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
        })
}

export const chooseImage = (image: string) => ({
    type: 'CHOOSE_IMAGE',
    image,
})

export const imageUpload = (
    files: Array<{ type: string, size: number, name: string }>
) => (dispatch: Object) => {
    const file = files[0]

    if (file == null) {
        return alert('No file selected.')
    }
    if (file.type.split('/')[0] !== 'image') {
        return alert('File is not an image.')
    }
    dispatch(actionStartImageUpload())
    dispatch(getSignedRequest(file))
}
