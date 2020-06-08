import React from 'react'

const Slide = ({ content, bckgSize, customClass }) => {
    return (
        <div
            className={customClass}
            style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url("${content.image}")`,
                backgroundSize: bckgSize,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        />
    )
}

export default Slide