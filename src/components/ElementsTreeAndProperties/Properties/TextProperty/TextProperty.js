import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './TextProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'

const TextProperty = props => {
    const [state, setState] = useState({
        selectionStart: 0,
        selectionEnd: 0,
        value: '',
    })

    useEffect(() => {
        if (props.element.textContent !== state.value) {
            setState({
                selectionStart: 0,
                selectionEnd: 0,
                value: props.element.textContent,
            })
        }
    })

    const handleTextChange = e => {
        const value = e.target.value.replace(/\r\n|\r|\n/g, ' ')
        props.changeProperty('textContent', value)
        setState({
            selectionStart: e.target.selectionStart,
            selectionEnd: e.target.selectionEnd,
            value,
        })
    }

    const handleSelectionChange = e => {
        setState({
            ...state,
            selectionStart: e.target.selectionStart,
            selectionEnd: e.target.selectionEnd,
        })
    }

    return props.element ? (
        <>
            <SmallButton
                title="Split"
                buttonClicked={() => {
                    props.splitText(state.selectionStart, state.selectionEnd)
                }}
                icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                inline
            />

            <SmallButton
                title="To span"
                buttonClicked={() => {
                    props.textToSpan(state.selectionStart, state.selectionEnd)
                }}
                icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                inline
            />

            <textarea
                className={classes.Textarea}
                onChange={handleTextChange}
                value={state.value}
                onKeyUp={handleSelectionChange}
                onMouseUp={handleSelectionChange}
            />
        </>
    ) : null
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        splitText: (start, end) =>
            dispatch(
                actions.splitText(
                    start,
                    end,
                    props.currentResource,
                    props.resourceDraft
                )
            ),
        textToSpan: (start, end) =>
            dispatch(
                actions.textToSpan(
                    start,
                    end,
                    props.currentResource,
                    props.resourceDraft
                )
            ),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(TextProperty)
