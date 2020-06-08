import React from 'react'


const Dot = ({ active, onChangeFromDot, index, customClass }) => {
    let activeClass = active === true ? 'websiterDevSlider__dot websiterDevSlider__active'
        : 'websiterDevSlider__dot websiterDevSlider__non_active'
    const dotClassName = !!customClass ? `${activeClass} ${customClass}` : activeClass

    return (
        <span
            className={dotClassName}
            onClick={() => onChangeFromDot(index)}
        />
    )
}

const Dots = ({ slides, activeIndex, onChangeFromDot, customClassDots, customClassDot }) => {
    let dotsClassName = !!customClassDots
        ? `websiterDevSlider__dots ${customClassDots}`
        : 'websiterDevSlider__dots'
    return (
        <div
            className={dotsClassName}
        >
            {
                slides.map((slide, i) => (
                    <Dot key={slide.image}
                         active={activeIndex === i}
                         index={i}
                         onChangeFromDot={onChangeFromDot}
                         customClass={customClassDot}
                    />
                ))
            }
        </div>
    )
}

export default Dots
