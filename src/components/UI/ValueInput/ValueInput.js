import React from 'react'

import classes from './ValueInput.module.css'
//import SmallButton from '../Buttons/SmallButton/SmallButton';

type Props = {
    min?: number,
    max?: number,
    title?: string,
    changed: Function,
    value?: number,
    datatestid?: string,
    inline?: boolean,
}

const ValueInput = (props: Props) => {
    const handleChange = e => {
        let value = parseInt(e.target.value) || 0
        if (props.min !== undefined && value < props.min) {
            value = props.min
        }
        if (props.max !== undefined && value > props.max) {
            value = props.max
        }
        props.changed(value)
    }

    return (
        <div
            className={
                props.inline
                    ? [classes.Div, classes.Inline].join(' ')
                    : classes.Div
            }
        >
            {props.title}
            <input
                data-testid={props.datatestid || 'input'}
                type="number"
                className={classes.Input}
                value={props.value || 0}
                onChange={handleChange}
            />
        </div>
    )
}

export default ValueInput
