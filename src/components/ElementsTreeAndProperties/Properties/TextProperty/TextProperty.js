import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './TextProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import Editor from '../../../Editor/Editor'
import Checkbox from '../../../UI/Checkbox/Checkbox'
import Select from '../../../UI/Select/Select'

import type {
    resourceType,
    elementType,
    initialStateType,
} from '../../../../store/reducer/reducer'

type Props = {
    element: elementType,
    resourceDraft: resourceType,
    changeProperty: (key: string | {}, value: string) => {},
    currentResource:
        | $PropertyType<initialStateType, 'currentPlugin'>
        | $PropertyType<initialStateType, 'currentPage'>,
    splitText: typeof actions.splitText,
    textToSpan: typeof actions.textToSpan,
}

const TextProperty = (props: Props) => {
    const [state, setState] = useState({
        selectionStart: 0,
        selectionEnd: 0,
        value: '',
    })

    const editor = useRef(null)

    useEffect(() => {
        if (props.element.textContent !== state.value) {
            setState({
                selectionStart: 0,
                selectionEnd: 0,
                value: props.element.textContent,
            })
        }
    })

    const setCssMode = item => props.changeProperty('textMode', item.value)

    const handleTextChangeCss = value => {
        value = value.replace(/\r\n|\r|\n/g, ' ')
        props.changeProperty('textContent', value)
    }

    const handleTextChangeText = e => {
        const value = e.target.value.replace(/\r\n|\r|\n/g, ' ')
        props.changeProperty('textContent', value)
        if (props.element.textMode === 'text')
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
            <div>
                <div className={classes.SelectContainer}>
                    <Select
                        options={[
                            { value: 'text', label: 'text' },
                            { value: 'css', label: 'css' },
                            { value: 'javascript', label: 'javascript' },
                        ]}
                        default={
                            props.element.textMode === 'text'
                                ? 0
                                : props.element.textMode === 'css'
                                ? 1
                                : 2
                        }
                        onChange={setCssMode}
                        isClearable={false}
                    />
                </div>

                {props.element.textMode === 'text' ? (
                    <>
                        <SmallButton
                            title="Split"
                            buttonClicked={() => {
                                props.splitText(
                                    state.selectionStart,
                                    state.selectionEnd,
                                    props.currentResource,
                                    props.resourceDraft
                                )
                            }}
                            icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                            inline
                        />

                        <SmallButton
                            title="To span"
                            buttonClicked={() => {
                                props.textToSpan(
                                    state.selectionStart,
                                    state.selectionEnd,
                                    props.currentResource,
                                    props.resourceDraft
                                )
                            }}
                            icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                            inline
                        />
                    </>
                ) : (
                    <SmallButton
                        buttonClicked={() => {
                            editor.current.makeCodePrettier()
                        }}
                        icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                        inline
                        tooltip="Beatify the code"
                    />
                )}
            </div>
            <div className={classes.Editors}>
                {props.element.textMode === 'text' ? (
                    <textarea
                        className={classes.Textarea}
                        onChange={handleTextChangeText}
                        value={state.value}
                        onKeyUp={handleSelectionChange}
                        onMouseUp={handleSelectionChange}
                    />
                ) : (
                    <Editor
                        ref={editor}
                        currentElement={props.element.id}
                        elementValue={props.element.textContent || ''}
                        // elementCurrentCursor={element.cursorPosition}
                        editorMode={props.element.textMode}
                        handleChange={handleTextChangeCss}
                        name="editorText"
                    />
                )}
            </div>
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
