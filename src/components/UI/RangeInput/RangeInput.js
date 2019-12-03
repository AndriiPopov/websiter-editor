import React from 'react'

import classes from './RangeInput.module.css'

type Props = {
    min?: number,
    max?: number,
    step?: number,
    changed: Function,
    saveToHistory?: Function,
    title?: string,
    value?: number,
    datatestid?: string,
}

const RangeInput = (props: Props) => {
    const handleChange = e => {
        let value = parseFloat(e.target.value) || 0

        if (props.min !== undefined && value < props.min) {
            value = props.min
        }
        if (props.max !== undefined && value > props.max) {
            value = props.max
        }
        props.changed(value)
        hasBeenChanged = true
    }

    let hasBeenChanged = false
    const handleMouseDown = () => {
        hasBeenChanged = false

        const dragStart = callbackStop => {
            const dragMouseUp = () => {
                window.removeEventListener('mouseup', dragMouseUp)
                callbackStop()
            }
            window.addEventListener('mouseup', dragMouseUp)
        }

        dragStart(() => {
            if (hasBeenChanged) {
                if (props.saveToHistory) {
                    props.saveToHistory()
                }
            }
        })
    }

    return (
        <div className={classes.Div}>
            {props.title}
            <input
                data-testid={props.datatestid || 'input'}
                type="range"
                className={classes.Input}
                value={props.value || 0}
                onChange={handleChange}
                step={props.step || 1}
                min={props.min || 0}
                max={props.max || 100}
                onMouseDown={handleMouseDown}
            />
        </div>
    )
}

export default RangeInput
