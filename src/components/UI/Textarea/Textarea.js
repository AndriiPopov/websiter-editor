import React from 'react'

import classes from './Textarea.module.css'
// import SmallButton from '../Buttons/SmallButton/SmallButton';

type Props = {
    changedStyleValues?: Array<{}>,
    title?: string,
    changed: Function,
    isWrong?: boolean,
    startValue?: string | number,
    datatestid?: string,
}

export const Textarea = (props: Props) => {
    const handleChange = e => {
        let value = e.target.value || ''
        props.changed(value)
    }
    return (
        <div className={classes.Div}>
            {props.title}
            <textarea
                data-testid={props.datatestid || 'Input'}
                className={props.isWrong ? classes.Wrong : null}
                value={props.startValue || ''}
                onChange={handleChange}
            />
        </div>
    )
}

export default Textarea
