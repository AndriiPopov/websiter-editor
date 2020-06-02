import React, { useState, useEffect } from 'react'
import Autosuggest from 'react-autosuggest'

import classes from './InspectorValue.module.css'

// type Props = {
//     value?: string,
//     changed: Function,
//     datatestid?: string,
//     blur?: Function,
//     allowEmpty?: boolean,
//     withState?: boolean,
//     maxLength?: number,
//     maxWidth?: string,
// }

export const InspectorValue = props => {
    const [state, setState] = useState(props.value || '')
    const [suggestions, setSuggestions] = useState(props.items || [])
    const [active, setActive] = useState()
    useEffect(() => {
        setState(props.value)
        setSuggestions(props.items)
    }, [props.value])

    const onChange = (event, { newValue }) => {
        setState(newValue)
    }

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value))
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }

    const inputProps = {
        placeholder: 'Type...',
        value: active
            ? state
            : props.maxLength
            ? state
                ? state.substr(0, props.maxLength) +
                  (state.length > props.maxLength ? '...' : '')
                : ''
            : state,
        onChange,
        onFocus: () => setActive(true),
        onBlur: (e, { highlightedSuggestion }) => {
            setActive()
            if (props.blur) {
                if (e.target) props.blur(e.target.value)
                else if (highlightedSuggestion)
                    props.blur(highlightedSuggestion.name)
                else props.blur(state)
            }
        },
        onKeyUp: e => {
            if (e.which === 13 || e.keyCode === 13) {
                e.currentTarget.blur()
            } else if (e.which === 27 || e.keyCode === 27) {
                e.currentTarget.blur()
            }
        },
        className: active
            ? classes.Input
            : [classes.Input, classes.InputHidden].join(' '),
        style: props.maxWidth ? { maxWidth: props.maxWidth } : {},
    }

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0
            ? []
            : props.items.filter(
                  item => item.name.toLowerCase().indexOf(inputValue) >= 0
              )
    }

    const getSuggestionValue = suggestion => suggestion.name

    const renderSuggestion = suggestion => <div>{suggestion.name}</div>

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
                    ? state
                        ? state.substr(0, props.maxLength) +
                          (state.length > props.maxLength ? '...' : '')
                        : ''
                    : state}
            </span>
            <Autosuggest
                suggestions={suggestions || []}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                focusInputOnSuggestionClick={false}
                theme={{
                    container: classes.reactautosuggestcontainer,
                    containerOpen: classes.reactautosuggestcontaineropen,
                    input: classes.reactautosuggestinput,
                    inputOpen: classes.reactautosuggestinputopen,
                    inputFocused: classes.reactautosuggestinputfocused,
                    suggestionsContainer:
                        classes.reactautosuggestsuggestionscontainer,
                    suggestionsContainerOpen:
                        classes.reactautosuggestsuggestionscontaineropen,
                    suggestionsList: classes.reactautosuggestsuggestionslist,
                    suggestion: classes.reactautosuggestsuggestion,
                    suggestionFirst: classes.reactautosuggestsuggestionfirst,
                    suggestionHighlighted:
                        classes.reactautosuggestsuggestionhighlighted,
                    sectionContainer: classes.reactautosuggestsectioncontainer,
                    sectionContainerFirst:
                        classes.reactautosuggestsectioncontainerfirst,
                    sectionTitle: classes.reactautosuggestsectiontitle,
                }}
            />
        </div>
    )
}

export default InspectorValue
