import React, { useState, forwardRef, useEffect } from 'react'
import Autocomplete from 'react-autocomplete'

import classes from './InspectorValue.module.css'

type Props = {
    value?: string,
    changed: Function,
    datatestid?: string,
    blur?: Function,
    focus?: Function,
}

// $FlowFixMe
export const InspectorValue = forwardRef((props: Props, parentRef) => {
    const [state, setState] = useState({ active: false, value: props.value })
    useEffect(() => {
        setState({ ...state, value: props.value })
    }, [props.value])

    const matchStateToTerm = (items, value) => {
        return (
            items.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            items.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        )
    }

    const parentPropsBlur = props.blur
    const parentPropsFocus = props.focus

    return (
        <div className={classes.InspectorDiv}>
            <Autocomplete
                items={props.items || []}
                value={props.withState ? state.value : props.value}
                onChange={(e, value) => {
                    setState({ ...state, value: value })
                    if (props.changed) props.changed(value)
                }}
                onSelect={value => {
                    setState({ ...state, value: value })
                    if (props.changed) props.changed(value)
                }}
                shouldItemRender={matchStateToTerm}
                getItemValue={item => item.name}
                renderItem={(item, isHighlighted) => (
                    <div
                        className={
                            isHighlighted ? classes.ItemHighlighted : null
                        }
                        key={item.abbr}
                    >
                        {item.name}
                    </div>
                )}
                renderMenu={(items, value, styles) => {
                    return (
                        <div
                            style={{
                                ...styles,
                                zIndex: 1000,
                                position: 'fixed',
                                background: 'white',
                                border: '1px solid #ccc',
                                color: '#333',
                            }}
                            children={items}
                        />
                    )
                }}
                renderInput={props => {
                    return (
                        <>
                            <input
                                {...props}
                                onBlur={e => {
                                    props.onBlur(e)

                                    setState({ ...state, active: false })
                                    if (parentPropsBlur)
                                        parentPropsBlur(e.target.value)
                                }}
                                onFocus={e => {
                                    props.onBlur(e)
                                    setState({ ...state, active: true })
                                    if (parentPropsFocus) parentPropsFocus()
                                }}
                                className={
                                    state.active
                                        ? classes.Input
                                        : [
                                              classes.Input,
                                              classes.InputHidden,
                                          ].join(' ')
                                }
                            />
                            <span
                                ref={parentRef}
                                className={classes.Span}
                                onClick={() =>
                                    setState({ ...state, active: true })
                                }
                                onFocus={() =>
                                    setState({ ...state, active: true })
                                }
                            >
                                {props.withState ? state.value : props.value}
                            </span>
                        </>
                    )
                }}
            />
        </div>
    )
})

export default InspectorValue
