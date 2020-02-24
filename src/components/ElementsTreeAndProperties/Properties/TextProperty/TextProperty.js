import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../../store/actions/index'
import * as classes from './TextProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import Editor from '../../../Editor/Editor'
import Select from '../../../UI/Select/Select'
import checkUserRights from '../../../../utils/checkUserRights'
import type { elementType } from '../../../../store/reducer/reducer'

type Props = {
    element: elementType,
    changeProperty: (key: string | {}, value: string) => {},
    splitText: typeof actions.splitText,
    textToSpan: typeof actions.textToSpan,
    requiredRights: Array<string>,
}

const TextProperty = (props: Props) => {
    const [state, setState] = useState({
        selectionStart: 0,
        selectionEnd: 0,
        value: '',
    })

    const editor = useRef(null)

    useEffect(() => {
        if (props.elementValues.textContent !== state.value) {
            setState({
                selectionStart: 0,
                selectionEnd: 0,
                value: props.elementValues.textContent,
            })
        }
    }, [props.elementValues.textContent])

    const setCssMode = item => {
        props.changeProperty('textMode', item.value)
    }

    const handleTextChangeCss = value => {
        if (!props.checkUserRights(props.requiredRights)) {
            return
        }
        value = value.replace(/\r\n|\r|\n/g, ' ')
        props.changeProperty('textContent', value)
    }

    const handleTextChangeText = e => {
        if (!props.checkUserRights(props.requiredRights)) {
            return
        }
        const value = e.target.value.replace(/\r\n|\r|\n/g, ' ')
        if (props.elementValues.textMode === 'text')
            setState({
                selectionStart: e.target.selectionStart,
                selectionEnd: e.target.selectionEnd,
                value,
            })
        props.changeProperty('textContent', value)
    }

    const handleSelectionChange = e => {
        setState({
            ...state,
            selectionStart: e.target.selectionStart,
            selectionEnd: e.target.selectionEnd,
        })
    }

    return props.elementValues ? (
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
                            props.elementValues.textMode === 'text'
                                ? 0
                                : props.elementValues.textMode === 'css'
                                ? 1
                                : 2
                        }
                        onChange={setCssMode}
                        isClearable={false}
                        requiredRights={props.requiredRights}
                    />
                </div>

                {props.elementValues.textMode === 'text' ? (
                    <>
                        <SmallButton
                            title="Split"
                            buttonClicked={() => {
                                props.splitText(
                                    props.type,
                                    state.selectionStart,
                                    state.selectionEnd
                                )
                            }}
                            icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                            inline
                            requiredRights={props.requiredRights}
                        />

                        <SmallButton
                            title="To span"
                            buttonClicked={() => {
                                props.textToSpan(
                                    props.type,
                                    state.selectionStart,
                                    state.selectionEnd
                                )
                            }}
                            icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                            inline
                            requiredRights={props.requiredRights}
                        />
                    </>
                ) : (
                    <SmallButton
                        buttonClicked={() => {
                            //$FlowFixMe
                            editor.current.makeCodePrettier()
                        }}
                        icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                        inline
                        tooltip="Beautify the code"
                        requiredRights={props.requiredRights}
                    />
                )}
            </div>
            <div className={classes.Editors}>
                {props.elementValues.textMode === 'text' ? (
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
                        elementValue={props.elementValues.textContent || ''}
                        // elementCurrentCursor={element.cursorPosition}
                        editorMode={props.elementValues.textMode}
                        handleChange={handleTextChangeCss}
                        name="editorText"
                        requiredRights={props.requiredRights}
                    />
                )}
            </div>
        </>
    ) : null
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        splitText: (type, start, end) =>
            dispatch(actions.splitText(type, start, end)),
        textToSpan: (type, start, end) =>
            dispatch(actions.textToSpan(type, start, end)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(TextProperty)
