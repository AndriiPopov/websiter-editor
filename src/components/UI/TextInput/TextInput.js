import React, { useState, useEffect } from 'react'

import classes from './TextInput.module.css'
// import SmallButton from '../Buttons/SmallButton/SmallButton';

// type Props = {
//     title?: string,
//     changed?: Function,
//     blur?: Function,
//     value?: string | number,
//     datatestid?: string,
//     wrong?: boolean,
//     inline?: boolean,
//     right?: boolean,
//     minWidth?: number,
//     unControlled?: boolean,
//     uniqueId?: string,
// }

export const TextInput = props => {
    const [state, setState] = useState(props.value)
    useEffect(() => {
        setState(props.value || '')
    }, [props.uniqueId])

    const handleChange = e => {
        if (props.unControlled) {
            setState(e.target.value)
        }
        if (props.changed) props.changed(e.target.value)
    }
    return (
        <div
            className={[classes.Div, props.inline ? classes.Inline : ''].join(
                ' '
            )}
        >
            {props.title}
            <input
                data-testid={props.datatestid || 'MyInput'}
                type="text"
                className={[
                    classes.Input,
                    props.wrong ? classes.Wrong : '',
                    props.right ? classes.Right : '',
                ].join(' ')}
                style={{
                    minWidth: props.minWidth ? props.minWidth + 'px' : 'auto',
                }}
                onChange={handleChange}
                onBlur={e => (props.blur ? props.blur(e.target.value) : {})}
                value={props.unControlled ? state : props.value || ''}
            />
        </div>
    )
}

export default TextInput
