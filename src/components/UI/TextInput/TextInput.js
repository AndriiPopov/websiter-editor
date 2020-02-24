import React from 'react'

import classes from './TextInput.module.css'
// import SmallButton from '../Buttons/SmallButton/SmallButton';

type Props = {
    title?: string,
    changed?: Function,
    blur?: Function,
    value?: string | number,
    datatestid?: string,
    wrong?: boolean,
    inline?: boolean,
    right?: boolean,
    minWidth?: number,
}

export const TextInput = (props: Props) => {
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
                value={props.value || ''}
                onChange={e =>
                    props.changed ? props.changed(e.target.value) : {}
                }
                onBlur={e => (props.blur ? props.blur(e.target.value) : {})}
            />
        </div>
    )
}

export default TextInput
