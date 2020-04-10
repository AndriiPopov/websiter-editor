import React, { useState, forwardRef, useEffect, useRef } from 'react'
import Autocomplete from 'react-autocomplete'

import classes from './InspectorValue.module.css'

type Props = {
    value?: string,
    changed: Function,
    datatestid?: string,
    blur?: Function,
    focus?: Function,
    allowEmpty?: boolean,
    withState?: boolean,
    maxLength?: number,
    maxWidth?: string,
}

// $FlowFixMe
export const InspectorValue = forwardRef((props: Props, parentRef) => {
    const input = useRef(null)
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
    const parentPropsValue = props.value
    const parentPropsWithState = props.withState

    return (
        <div className={classes.InspectorDiv}>
            {props.readonly ? (
                <span
                    {...(props.value && props.maxLength
                        ? props.value.length > props.maxLength
                            ? { title: props.value }
                            : {}
                        : {})}
                >
                    {props.maxLength
                        ? props.value
                            ? props.value.substr(0, props.maxLength) +
                              (props.value.length > props.maxLength
                                  ? '...'
                                  : '')
                            : ''
                        : props.value}
                </span>
            ) : (
                <Autocomplete
                    ref={input}
                    items={props.items || []}
                    value={props.withState ? state.value : props.value}
                    onChange={(e, value) => {
                        setState({ ...state, value: value })
                        if (props.changed) {
                            props.changed(value)
                        }
                    }}
                    onSelect={value => {
                        setState({ ...state, value: value, active: false })
                        setTimeout(() => {
                            if (input.current) input.current.blur()
                        }, 50)
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
                                    zIndex: 1000,
                                    position: 'absolute',
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    color: '#333',
                                    maxHeight: '100px',
                                    overflow: 'auto',
                                }}
                                children={items}
                            />
                        )
                    }}
                    renderInput={(props, inputEl) => {
                        const maxLength = parentPropsMaxLength

                        const maxWidth = parentPropsMaxWidth
                        const withState = parentPropsWithState
                        const value = withState ? state.value : parentPropsValue

                        return (
                            <>
                                <span
                                    ref={parentRef}
                                    className={classes.Span}
                                    style={maxWidth ? { maxWidth } : {}}
                                    onClick={() =>
                                        setState({ ...state, active: true })
                                    }
                                    onFocus={() =>
                                        setState({ ...state, active: true })
                                    }
                                >
                                    {state.active
                                        ? value
                                        : maxLength
                                        ? value
                                            ? value.substr(0, maxLength) +
                                              (value.length > maxLength
                                                  ? '...'
                                                  : '')
                                            : ''
                                        : value}
                                </span>
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
                                            : [
                                                  classes.Input,
                                                  classes.InputHidden,
                                              ].join(' ')
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
                                    onKeyDown={e => {
                                        if (
                                            (e.ctrlKey && e.key === 'z') ||
                                            (e.ctrlKey && e.key === 'Z')
                                        )
                                            e.preventDefault()
                                    }}
                                />
                            </>
                        )
                    }}
                />
            )}
        </div>
    )
})

export default InspectorValue
