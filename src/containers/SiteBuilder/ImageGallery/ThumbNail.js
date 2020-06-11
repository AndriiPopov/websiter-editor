import React from 'react'

export const Thumbnail = ({ imagesProps, backgroundSize }) => {
    return (
        <div
        style={{
            height: '100%',
            width: '100%',
            backgroundImage: `url("${imagesProps.item.src}")`,
            backgroundSize: backgroundSize,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }}
        />
    )
}