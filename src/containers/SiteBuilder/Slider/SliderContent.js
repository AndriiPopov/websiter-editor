import React from 'react'

const SliderContent = props =>  (
        <div style={{
            transform: `translateX(-${props.translate}px)`,
            transition: `${props.transition}`,
            width: `${props.width}px`,
            height: '100%',
            display: 'flex',
            position: 'absolute'
        }}
        >
            {props.children}
        </div>
    )

export default SliderContent