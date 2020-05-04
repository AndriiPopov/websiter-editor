import React, { useState, useEffect } from 'react'
import Autocomplete from 'react-autocomplete'

import classes from './InspectorValue.module.css'

// type Props = {
//     value?: string,
//     changed: Function,
//     datatestid?: string,
//     blur?: Function,
//     focus?: Function,
//     allowEmpty?: boolean,
//     withState?: boolean,
//     maxLength?: number,
//     maxWidth?: string,
// }

export const InspectorValue = props => {
    const [state, setState] = useState({
        active: false,
        value: props.value,
        startValue: props.value,
    })
    useEffect(() => {
        setState({ ...state, value: props.value, startValue: props.value })
    }, [props.value])

    const matchStateToTerm = (items, value) => {
        return (
            items.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            items.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        )
    }

    const parentPropsBlur = props.blur
    const parentPropsFocus = props.focus
    const parentPropsMaxLength = props.maxLength
    const parentPropsMaxWidth = props.maxWidth

    const value = state.value
    return (
        <div
            className={classes.InspectorDiv}
            onKeyDown={e => e.stopPropagation()}
        >
            <span
                className={classes.Span}
                {...(props.value && props.maxLength
                    ? props.value.length > props.maxLength
                        ? { title: props.value }
                        : {}
                    : {})}
            >
                {props.maxLength
                    ? value
                        ? value.substr(0, props.maxLength) +
                          (value.length > props.maxLength ? '...' : '')
                        : ''
                    : value}
            </span>

            <Autocomplete
                items={props.items || []}
                value={state.value}
                onChange={(e, value) => {
                    setState({ ...state, value: value })
                    if (props.changed) {
                        props.changed(value)
                    }
                }}
                onSelect={value => {
                    setState({ ...state, value: value, active: false })
                }}
                shouldItemRender={matchStateToTerm}
                getItemValue={item => item.name}
                renderItem={(item, isHighlighted) => (
                    <div
                        className={
                            isHighlighted ? classes.ItemHighlighted : null
                        }
                        key={item.abbr}
                        style={{ padding: '2px 5px' }}
                    >
                        {item.name}
                    </div>
                )}
                renderMenu={(items, value, styles) => {
                    return (
                        <div
                            style={{
                                zIndex: 1000,
                                position: 'absolute',
                                left: '0px',
                                top: '20px',
                                background: 'white',
                                border: '1px solid #ccc',
                                color: '#333',
                                maxHeight: '100px',
                                overflow: 'auto',
                                paddingBottom: '5px',
                            }}
                            children={items}
                        />
                    )
                }}
                renderInput={(props, inputEl) => {
                    const maxLength = parentPropsMaxLength

                    const maxWidth = parentPropsMaxWidth
                    const value = state.value

                    return (
                        <input
                            {...(value && maxLength
                                ? value.length > maxLength
                                    ? { title: value }
                                    : {}
                                : {})}
                            {...props}
                            onBlur={e => {
                                props.onBlur(e)

                                if (parentPropsBlur) {
                                    parentPropsBlur(e.target.value)
                                }
                                setState({
                                    ...state,
                                    active: false,
                                })
                            }}
                            onFocus={e => {
                                props.onBlur(e)
                                setState({ ...state, active: true })
                                if (parentPropsFocus) parentPropsFocus()
                            }}
                            onMouseDown={e => {
                                setState({ ...state, active: true })
                                if (parentPropsFocus) parentPropsFocus()
                            }}
                            className={
                                state.active
                                    ? classes.Input
                                    : [classes.Input, classes.InputHidden].join(
                                          ' '
                                      )
                            }
                            style={maxWidth ? { maxWidth } : {}}
                            value={
                                state.active
                                    ? value
                                    : maxLength
                                    ? value
                                        ? value.substr(0, maxLength) +
                                          (value.length > maxLength
                                              ? '...'
                                              : '')
                                        : ''
                                    : value
                            }
                        />
                    )
                }}
            />
        </div>
    )
}

export default InspectorValue
