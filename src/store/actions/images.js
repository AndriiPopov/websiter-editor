import axios from 'axios'

import * as actionTypes from './actionTypes'

const actionStartImageUpload = () => ({
    type: actionTypes.ACTION_START_IMAGE_UPLOAD,
})

const actionSuccessImageUpload = () => ({
    type: actionTypes.ACTION_SUCCESS_IMAGE_UPLOAD,
})

const actionFailImageUpload = (error: string) => ({
    type: actionTypes.ACTION_FAIL_IMAGE_UPLOAD,
    error,
})

const getSignedRequest = (file, images, storage, userId) => (
    dispatch: Object
) => {
    let name = userId + '/' + file.name.replace(/([^a-zA-Z0-9\\.\\-])/g, '_')

    let namePrefix = ''
    let k = 0

    const checkName = () =>
        images.findIndex(image => name + namePrefix === image.name)
    while (checkName() >= 0) {
        k++
        namePrefix = '_' + k
    }

    const fileDetails = {
        file,
        name: name + namePrefix,
        label: file.name + namePrefix,
        storage,
        images,
    }

    return axios
        .get(
            `/api/sign-s3?file-name=${name}${namePrefix}&file-type=${
                file.type
            }&file-size=${file.size}`
        )
        .then(response => {
            dispatch(
                uploadFile(
                    fileDetails,
                    response.data.signedRequest,
                    response.data.url
                )
            )
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
            if (err.response.status === 400) alert(err.response.data)
        })
}

const uploadFile = (fileDetails, signedRequest, url) => (dispatch: Object) => {
    return axios
        .put(signedRequest, fileDetails.file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            dispatch(saveImageUrlAndSize(fileDetails, url))
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
        })
}

const saveImageUrlAndSize = (fileDetails, url) => (dispatch: Object) => {
    const fileSize = parseFloat(fileDetails.file.size)
    const newStorage = fileDetails.storage + fileSize
    const newImages = [
        {
            url,
            name: fileDetails.name,
            size: fileSize,
            label: fileDetails.label,
        },
        ...fileDetails.images,
    ]

    return axios
        .put('/api/users', { storage: newStorage, images: newImages })
        .then(response => {
            dispatch(saveImageUrlAndSizeInRedux(newStorage, newImages))
            dispatch(actionSuccessImageUpload())
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
            //delete from aws?
        })
}

const saveImageUrlAndSizeInRedux = (storage, images) => ({
    type: actionTypes.SAVE_IMAGE_AND_SIZE_IN_REDUX,
    storage,
    images,
})

export const deleteImage = (url: string) => (dispatch: Object) => {
    if (
        window.confirm(
            'Are you sure you want to delete this image? The image will be unavailable after the deletion and will not be visible in all elements and on all pages of your websites.'
        )
    ) {
        dispatch(actionStartImageUpload())
        return axios
            .post(
                `/api/awsImage/deleteimage`,
                JSON.stringify({
                    url,
                })
            )
            .then(response => {
                dispatch(
                    saveImageUrlAndSizeInRedux(
                        response.data.storage,
                        response.data.images
                    )
                )
                dispatch(actionSuccessImageUpload())
            })
            .catch(err => {
                dispatch(actionFailImageUpload(err.message))
            })
    } else {
        return
    }
}

export const renameImage = (url: string) => (dispatch: Object) => {
    const label = window.prompt('Type a new name for the image.')
    if (label !== null) {
        dispatch(actionStartImageUpload())

        return axios
            .post(
                `/api/awsImage/renameimage`,
                JSON.stringify({
                    url,
                    label,
                })
            )
            .then(response => {
                dispatch(
                    saveImageUrlAndSizeInRedux(false, response.data.images)
                )
                dispatch(actionSuccessImageUpload())
            })
            .catch(err => {
                dispatch(actionFailImageUpload(err.message))
            })
    } else {
        return
    }
}

export const chooseImage = (image: string) => ({
    type: actionTypes.CHOOSE_IMAGE,
    image,
})

export const imageUpload = (
    files: Array<{ type: string, size: number, name: string }>,
    images: Array<{ url: string, name: string, size: number }>,
    storage: number,
    userId: string
) => (dispatch: Object) => {
    const file = files[0]
    if (file == null) {
        return alert('No file selected.')
    }
    if (file.type.split('/')[0] !== 'image') {
        return alert('File is not an image.')
    }
    dispatch(actionStartImageUpload())
    dispatch(getSignedRequest(file, images, storage, userId))
}
