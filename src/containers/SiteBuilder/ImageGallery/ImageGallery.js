import React from 'react'
import Gallery from 'react-grid-gallery'

const ImageGallery = props => {
    if (!Array.isArray(props.images)) {
        return null
    }

    let {
        margin,
        showLightboxThumbnails,
        backdropClosesModal,
        rowHeight,
    } = props.refinedProperties

    rowHeight = rowHeight ? rowHeight : 180
    showLightboxThumbnails = showLightboxThumbnails === 'true'
    backdropClosesModal = backdropClosesModal === 'true'

console.log('showLightboxThumbnails: ' + showLightboxThumbnails)

    console.log('backdropClosesModal: ' + backdropClosesModal)

    const finishedImages = props.images.map(image => {
        let ratio = image.ratio
        let proportions = ratio && ratio.split(':')
        let width = +proportions[0]
        let height = +proportions[1]
        let thumbnailWidth = !isNaN(width && height)
            ? rowHeight * (width / height)
            : 320

        return {
            ...image,
            thumbnailWidth: thumbnailWidth,
            thumbnailHeight: rowHeight,
            enableImageSelection: false,
        }
    })

    return (
        <Gallery
            images={finishedImages}
            backdropClosesModal={backdropClosesModal}
            showLightboxThumbnails={showLightboxThumbnails}
            enableImageSelection={false}
            margin={margin}
            rowHeight={rowHeight}
        />
    )
}

export default ImageGallery