import React from 'react'
//import { connect } from 'react-redux';
import type { Node } from 'react'

//import * as actions from '../../../store/actions/index';
import classes from './Checkbox.module.css'
//import SmallButton from '../Buttons/SmallButton/SmallButton';

type Props = {
    checked?: boolean,
    title?: string,
    onChange: Function,
    datatestid?: string,
    radio?: boolean,
    children?: Node,
    inline?: boolean,
}

const Checkbox = (props: Props) => {
    return (
        <div
            className={
                props.inline
                    ? [classes.Div, classes.Inline].join(' ')
                    : classes.Div
            }
        >
            <label>
                <input
                    data-testid={props.datatestid}
                    type={props.radio ? 'radio' : 'checkbox'}
                    className={classes.Input}
                    checked={props.checked || false}
                    onChange={e => props.onChange(e.target.checked)}
                />
                {props.title}
                {props.children}
            </label>
        </div>
    )
}

export default Checkbox
