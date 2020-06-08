import React, { useState, useEffect, useRef } from 'react'
import SliderContent from './SliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import Dots from './Dots'


const Slider = props => {

    if (!Array.isArray(props.slides)) {
        return null
    }

    const settings = {
        getWidth: props.refinedProperties.width || 500,
        getHeight: props.refinedProperties.height || '100vh',
        autoPlay: props.refinedProperties.autoplaySpeed || null,
        slideBackgroundSize: props.refinedProperties.backgroundSize || 'cover',
        getTransition: props.refinedProperties.transition || 'transform .9s',
        wrapperClassName: props.refinedProperties.wrapperClassName,
        dotsClassName: props.refinedProperties.dotsClassName,
        dotClassName: props.refinedProperties.dotClassName,
        arrowClassName: props.refinedProperties.arrowClassName,
        slideClassName: props.refinedProperties.slideClassName,
        slidesTextClassName: props.refinedProperties.slidesTextClassName,
    }

    const [state, setState] = useState({
        activeIndex: 0,
        translate: 0,
    })

    const { translate, activeIndex } = state
    const autoPlayRef = useRef()


    useEffect(() => {
        autoPlayRef.current = nextSlide
    })

    useEffect(() => {
        const play = () => {
            autoPlayRef.current()
        }

        if (settings.autoPlay !== null) {
            const interval = setInterval(play, settings.autoPlay * 1000)
            return () => clearInterval(interval)
        }
    }, [props.autoPlay])

    const nextSlide = () => {
        if (activeIndex === props.slides.length - 1) {
            return setState({
                ...state,
                translate: 0,
                activeIndex: 0,
            })
        }

        setState({
            ...state,
            activeIndex: activeIndex + 1,
            translate: (activeIndex + 1) * settings.getWidth,
        })
    }

    const prevSlide = () => {
        if (activeIndex === 0) {
            return setState({
                ...state,
                translate: (props.slides.length - 1) * settings.getWidth,
                activeIndex: props.slides.length - 1,
            })
        }

        setState({
            ...state,
            activeIndex: activeIndex - 1,
            translate: (activeIndex - 1) * settings.getWidth,
        })
    }

    const onChangeFromDot = idx => {
        setState({
            ...state,
            activeIndex: idx,
            translate: idx * settings.getWidth,
        })
    }

    return (
        <>
            <Arrow direction='left' handleClick={prevSlide} customClass={settings.arrowClassName}/>
            <div
                className={
                    !!settings.wrapperClassName
                        ? `websiterDevSlider__slider__wrapper ${settings.wrapperClassName}`
                        : 'websiterDevSlider__slider__wrapper'
                }
                style={{
                    width: `${settings.getWidth}px`,
                    height: settings.getHeight,
                }}
            >
                <SliderContent
                    translate={translate}
                    transition={settings.getTransition}
                    width={settings.getWidth * props.slides.length}

                >

                    {
                        props.slides.map((slide, i) => (
                            <Slide customClass={settings.slideClassName}
                                   key={slide.image + i}
                                   content={slide}
                                   bckgSize={settings.slideBackgroundSize}/>
                        ))
                    }

                </SliderContent>
                <div className={
                    !!settings.slidesTextClassName
                        ? `websiterDevSlider__slidesText ${settings.slidesTextClassName}`
                        : 'websiterDevSlider__slidesText'
                }
                >
                    {
                        !!props.slides[activeIndex]
                        && props.slides[activeIndex].text
                        && <p>{props.slides[activeIndex].text}</p>
                    }
                </div>
                <Dots slides={props.slides}
                      activeIndex={activeIndex}
                      onChangeFromDot={onChangeFromDot}
                      customClassDots={settings.dotsClassName}
                      customClassDot={settings.dotClassName}
                />
            </div>
            <Arrow direction='right' handleClick={nextSlide} customClass={settings.arrowClassName}/>
        </>
    )

}

Slider.defaultProps = {
    slides: [],
}

export default Slider
