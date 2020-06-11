import React from 'react'
import Gallery from 'react-grid-gallery'
import { Thumbnail } from './ThumbNail'

const ImageGallery = props => {

    if (!Array.isArray(props.images)) {
        return null
    }

    let {
        margin,
        showLightboxThumbnails,
        backdropClosesModal,
        rowHeight,
        thumbnailWidth,
        backgroundSize,
    } = props.refinedProperties

    rowHeight = rowHeight ? rowHeight : '220px'
    thumbnailWidth = thumbnailWidth? thumbnailWidth : '220px'
    showLightboxThumbnails = showLightboxThumbnails === 'true'
    backdropClosesModal = backdropClosesModal === 'true'


    const finishedImages = props.images.map(image => {

        return {
            ...image,
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
            tileViewportStyle={() => {
                return {
                    backgroundColor: 'white',
                    height: rowHeight,
                    width: thumbnailWidth
                }
            }}
            thumbnailImageComponent={imagesProps => {
                return <Thumbnail imagesProps={imagesProps}
                                  backgroundSize={backgroundSize ? backgroundSize : 'cover'}/>
            }}
        />
    )
}


export default ImageGallery