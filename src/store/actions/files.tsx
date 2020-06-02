import axios from 'axios'
import { webSocket } from '../../components/ReserveWebsite/ReserveWebsite'
import * as wsActions from '../../websocketActions'
import buildRelUrls from '../../utils/buildRelUrls'
import FileType from 'file-type'

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

const getSignedRequest = (files, replace, editorMode) => (
    dispatch: Object,
    getState
) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    // const { file, thumbnail } = files
    const file = files.file
    const thumbnail = files.thumbnail
    const resolution = files.resolution || {
        width: 'unknown',
        height: 'unknown',
    }

    const { mD } = getState()
    if (!mD.currentWebsiteId) return
    const cleanName = file.name.replace(/([^a-zA-Z0-9\\.\\-])/g, '_')
    let name = mD.currentWebsiteId + '/' + cleanName

    let namePrefix = ''
    let k = 0

    const checkName = () =>
        mD.filesStructure.findIndex(
            file => name + namePrefix === file.serverName
        )
    if (!replace) {
        while (checkName() >= 0) {
            k++
            namePrefix = '_' + k
        }
    }

    const fileDetails = {
        size: file.size,
        name: replace ? replace.name : cleanName,
        serverName: replace ? replace.serverName : name + namePrefix,
        type: replace ? replace.type : files.type,
        editorMode,
        file,
        v: replace ? replace.v + 1 : 1,
        resolution,
    }

    const thumbnailDetails = thumbnail
        ? {
              size: thumbnail.size,
              name: fileDetails.name + thumbnail.name,
              serverName: fileDetails.serverName + thumbnail.name,
              type: thumbnail.type,
              editorMode,
              file: thumbnail,
          }
        : {}
    return axios
        .post('/api/sign-s3', {
            ...{
                fileName: fileDetails.serverName,
                fileType: fileDetails.type,
                fileSize: fileDetails.size,
                websiteId: mD.currentWebsiteId,
            },
            ...(thumbnail
                ? {
                      thumbnailName: thumbnailDetails.serverName,
                      thumbnailType: thumbnailDetails.type,
                      thumbnailSize: thumbnailDetails.size,
                  }
                : {}),
        })
        .then(response => {
            dispatch(
                doUploadFile(
                    fileDetails,
                    thumbnailDetails,
                    response.data,
                    mD.currentWebsiteId,
                    replace
                )
            )
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
            if (err.response.status === 400) alert(err.response.data)
        })
}

const doUploadFile = (
    fileDetails,
    thumbnailDetails,
    data,
    websiteId,
    replace
) => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (data.signedRequestThumbnail && thumbnailDetails.file)
        axios
            .put(data.signedRequestThumbnail, thumbnailDetails.file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {})
            .catch(err => {
                dispatch(actionFailImageUpload(err.message))
                return
            })
    return axios
        .put(data.signedRequest, fileDetails.file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            if (webSocket) {
                const { mD } = getState()
                let result
                const newFileItem = {
                    id: replace ? replace.id : 'file_' + mD.nextFileId,
                    path: replace ? replace.path : [],
                    size: fileDetails.size + (thumbnailDetails.size || 0),
                    name: fileDetails.name,
                    serverName: fileDetails.serverName,
                    type: fileDetails.type,
                    editorMode: fileDetails.editorMode,
                    url: data.url,
                    v: fileDetails.v,
                    resolution: fileDetails.resolution,
                    modifiedDate: Date.now(),
                }

                if (mD.currentFileItem && mD.currentFileId) {
                    if (!replace)
                        result = [
                            ...mD.filesStructure.slice(
                                0,
                                mD.filesStructure.findIndex(
                                    item => item.id === mD.currentFileId
                                ) + 1
                            ),
                            {
                                ...newFileItem,
                                path: mD.currentFileItem.path,
                                createdDate: Date.now(),
                            },
                            ...mD.filesStructure.slice(
                                mD.filesStructure.findIndex(
                                    item => item.id === mD.currentFileId
                                ) + 1
                            ),
                        ]
                    else
                        result = [
                            ...mD.filesStructure.slice(
                                0,
                                mD.filesStructure.findIndex(
                                    item => item.id === replace.id
                                )
                            ),
                            {
                                ...newFileItem,
                                createdDate: replace.createdDate,
                            },
                            ...mD.filesStructure.slice(
                                mD.filesStructure.findIndex(
                                    item => item.id === replace.id
                                ) + 1
                            ),
                        ]
                } else {
                    result = [
                        ...mD.filesStructure,
                        {
                            ...newFileItem,
                            createdDate: replace
                                ? replace.createdDate
                                : Date.now(),
                        },
                    ]
                }

                result = buildRelUrls(result)
                dispatch(
                    wsActions.sendUpdate(
                        'website',
                        {
                            nextFileId: replace
                                ? mD.nextFileId
                                : mD.nextFileId + 1,
                            filesStructure: result,
                            storage: data.newStorage,
                        },
                        websiteId
                    )
                )
            }
            dispatch(actionSuccessImageUpload())
        })
        .catch(err => {
            dispatch(actionFailImageUpload(err.message))
        })
}

export const uploadFile = (
    files: Array<{ type: string; size: number; name: string }>,
    replace: boolean,
    editorMode: string,
    isCreated?: boolean,
    fileType?: string
) => (dispatch: Object) => {
    const file = files[0]

    if (file == null) {
        return alert('No file selected.')
    }
    dispatch(actionStartImageUpload())
    const reader = new FileReader()
    reader.onload = async event => {
        let type = await FileType.fromBuffer(event.target.result)
        type = type ? type.mime : isCreated ? 'text/css' : fileType || ''

        if (type && type.indexOf('image') >= 0) {
            resizeImageToSpecificSize(
                file,
                { width: 220, height: 220 },
                data => {
                    urltoFile(data, '/120').then(function(thumbnail) {
                        getResolution(file, resolution => {
                            dispatch(
                                getSignedRequest(
                                    { file, type, thumbnail, resolution },
                                    replace,
                                    editorMode
                                )
                            )
                        })
                    })
                }
            )
        } else {
            dispatch(getSignedRequest({ file, type }, replace, editorMode))
        }
    }

    reader.readAsArrayBuffer(file)
}

export const urltoFile = (url, filename, mimeType) => {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1]
    return fetch(url)
        .then(function(res) {
            return res.arrayBuffer()
        })
        .then(function(buf) {
            return new File([buf], filename, { type: mimeType })
        })
}

export const resizeImageToSpecificSize = (file, size, cb) => {
    if (file) {
        var reader = new FileReader()
        reader.onload = function(event) {
            resizeImageFromSrcToSpecificSize(event.target.result, size, cb)
        }
        reader.readAsDataURL(file)
    }
}

export const resizeImageFromSrcToSpecificSize = (src, size, cb) => {
    var data
    var img = new Image()
    img.onload = function() {
        const widthCoef = img.width / size.width
        const heightCoef = img.height / size.height
        var oc = document.createElement('canvas'),
            octx = oc.getContext('2d')
        oc.width = img.width
        oc.height = img.height
        octx.drawImage(img, 0, 0)
        if (widthCoef > 1 || heightCoef > 1) {
            if (img.width > img.height) {
                oc.height = (img.height / img.width) * size.width
                oc.width = size.width
            } else {
                oc.width = (img.width / img.height) * size.width
                oc.height = size.width
            }
        }
        octx.drawImage(oc, 0, 0, oc.width, oc.height)
        octx.drawImage(img, 0, 0, oc.width, oc.height)
        data = oc.toDataURL()
        cb(data)
    }
    img.src = src
}

const getResolution = (file, cb) => {
    var _URL = window.URL || window.webkitURL
    var img
    if (file) {
        img = new Image()
        var objectUrl = _URL.createObjectURL(file)
        img.onload = function() {
            cb({ width: this.width, height: this.height })
            _URL.revokeObjectURL(objectUrl)
        }
        img.src = objectUrl
    }
}

export const deleteFile = fileId => (dispatch: Object, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    if (
        window.confirm(
            'Are you sure you want to delete this file? The file will be unavailable after the deletion and will not be visible in all elements and on all pages of your websites.'
        )
    ) {
        webSocket.send(
            JSON.stringify({
                messageCode: 'deleteImage',
                fileId,
                _id: mD.currentWebsiteId,
            })
        )
    }
}
