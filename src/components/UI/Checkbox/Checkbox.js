import React from 'react'
//import { connect } from 'react-redux';
import type { Node } from 'react'

//import * as actions from '../../../store/actions/index';
import classes from './Checkbox.module.css'
import Svg from '../../Svg/Svg'
//import SmallButton from '../Buttons/SmallButton/SmallButton';

type Props = {
    checked?: boolean,
    title?: string,
    onChange: Function,
    datatestid?: string,
    radio?: boolean,
    children?: Node,
    inline?: boolean,
    style?: Object,
    icon?: string,
}

const Checkbox = (props: Props) => {
    return (
        <div
            className={
                props.inline
                    ? [classes.Div, classes.Inline].join(' ')
                    : classes.Div
            }
            style={props.style}
        >
            <label>
                <input
                    data-testid={props.datatestid}
                    type={props.radio ? 'radio' : 'checkbox'}
                    className={classes.Input}
                    checked={props.checked || false}
                    onChange={e => props.onChange(e.target.checked)}
                />
                {props.icon ? (
                    <Svg icon={props.icon} className={classes.Svg} />
                ) : null}
                {props.title}
                {props.children}
            </label>
        </div>
    )
}

export default Checkbox
