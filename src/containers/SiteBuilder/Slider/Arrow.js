import React from 'react'


const Arrow = ({ direction, handleClick, customClass }) => {
    let activeClass = direction === 'right'
        ? 'websiterDevSlider__arrow websiterDevSlider__right'
        : 'websiterDevSlider__arrow websiterDevSlider__left'
    const arrowClassName = !!customClass
        ? `${activeClass} ${customClass}`
        : activeClass

    return (
        <div className={arrowClassName} onClick={handleClick}/>
    )
}

export default Arrow

