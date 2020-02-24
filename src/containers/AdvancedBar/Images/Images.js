import React from 'react'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'

import * as actions from '../../../store/actions/index'
import * as wsActions from '../../../websocketActions'
import * as classes from './Images.module.css'
// import * as barClasses from '../AdvancedBar.module.css'
import Svg from '../../../components/Svg/Svg'
import { bucket, CloudFrontUrl } from '../../../awsConfig'
import SmallButton from '../../../components/UI/Buttons/SmallButton/SmallButton'
import checkUserRights from '../../../utils/checkUserRights'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    imageUpload: typeof actions.imageUpload,
    chooseImage: typeof actions.chooseImage,
    currentImage: $PropertyType<initialStateType, 'currentImage'>,
}

const copyToClipboard = str => {
    const el = document.createElement('textarea') // Create a <textarea> element
    el.value = str // Set its value to the string that you want copied
    el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
    el.style.position = 'absolute'
    el.style.left = '-9999px' // Move outside the screen to make it invisible
    // $FlowFixMe
    document.body.appendChild(el) // Append the <textarea> element to the HTML document
    const selected =
        // $FlowFixMe
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ? // $FlowFixMe
              document.getSelection().getRangeAt(0) // Store selection if found
            : false // Mark as false to know no selection existed before
    el.select() // Select the <textarea> content
    document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
    // $FlowFixMe
    document.body.removeChild(el) // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        // $FlowFixMe
        document.getSelection().removeAllRanges() // Unselect everything on the HTML document
        // $FlowFixMe
        document.getSelection().addRange(selected) // Restore the original selection
    }
}

const Images = (props: Props) =>
    props.currentWebsiteObject ? (
        <div style={{ height: '100%' }}>
            <div className={classes.Buttons}>
                <SmallButton
                    inline
                    icon='<svg height="20" viewBox="0 0 24 24" width="20"><path d="M5 4v3h5.5v12h3V7H19V4z" ></path></svg>'
                    buttonClicked={() => props.renameImage(props.currentImage)}
                    tooltip="Rename media file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg height="20" viewBox="0 0 24 24" width="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" ></path></svg>'
                    buttonClicked={() => props.deleteImage(props.currentImage)}
                    tooltip="Delete media file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                    buttonClicked={() => {
                        const filteredImage = props.currentWebsiteObject.images.find(
                            image => image.name === props.currentImage
                        )
                        if (filteredImage) {
                            copyToClipboard(filteredImage.url)
                        }
                        // copyToClipboard('websiter/' + props.currentImage)
                    }}
                    tooltip="Copy path to the media file to clipboard.<br>You can paste it where needed."
                    requiredRights={['developer', 'content']}
                />
            </div>
            <div className={classes.Images}>
                <label className={classes.ImageContainer}>
                    <input
                        className={classes.ImageInput}
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            if (props.checkUserRights(['developer', 'content']))
                                props.imageUpload(e.target.files)
                        }}
                    />
                    <Svg icon='<svg height="150" viewBox="0 0 24 24" width="150"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>' />
                    <p className={classes.ImageName}>Upload image</p>
                </label>
                {props.currentWebsiteObject.images.map(image => {
                    const edits = {
                        resize: {
                            width: 150,
                            height: 150,
                            fit: 'contain',
                            background: { r: 0, g: 0, b: 0, alpha: 0 },
                        },
                    }
                    if (image.type !== 'image/png') edits.toFormat = 'png'
                    const imageRequest = JSON.stringify({
                        bucket: bucket,
                        key: image.name,
                        edits,
                    })
                    const url = `${CloudFrontUrl}/${btoa(imageRequest)}`

                    let imageClass = classes.ImageContainer

                    if (image.name === props.currentImage) {
                        imageClass = [
                            classes.ImageContainer,
                            classes.ImageContainerChosen,
                        ].join(' ')
                    }

                    return (
                        <div
                            className={imageClass}
                            key={image.name}
                            onClick={() => props.chooseImage(image.name)}
                        >
                            <LazyLoad height={150}>
                                <img
                                    src={url}
                                    height="150"
                                    width="150"
                                    alt="websiter"
                                />
                                <p className={classes.ImageName}>
                                    {image.label}
                                </p>
                            </LazyLoad>
                        </div>
                    )
                })}
            </div>
        </div>
    ) : null

const mapStateToProps = state => {
    return {
        currentImage: state.currentImage,
        currentWebsiteObject: state.mD.currentWebsiteObject,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        imageUpload: files => dispatch(actions.imageUpload(files)),
        renameImage: image => dispatch(wsActions.renameImage(image)),
        deleteImage: image => dispatch(wsActions.deleteImage(image)),
        chooseImage: image => dispatch(actions.chooseImage(image)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Images)
