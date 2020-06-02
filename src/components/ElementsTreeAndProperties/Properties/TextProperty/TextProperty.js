import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../../store/actions/index'
import * as classes from './TextProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import Editor from '../../../Editor/Editor'
import Select from 'antd/es/select'
import StarOutlined from '@ant-design/icons/StarOutlined'
import SplitCellsOutlined from '@ant-design/icons/SplitCellsOutlined'
import ForkOutlined from '@ant-design/icons/ForkOutlined'
import ControlPanel from '../../../UI/ControlPanel'
import Divider from 'antd/es/divider'

// import type { elementType } from '../../../../store/reducer/reducer'

// type Props = {
//     element,
//     changeProperty: (key: string | {}, value: string) => {},
//     splitText: typeof actions.splitText,
//     textToSpan: typeof actions.textToSpan,
//     requiredRights: Array<string>,
// }

const TextProperty = props => {
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

    const handleTextChangeCss = value => {
        value = value.replace(/\r\n|\r|\n/g, ' ')
        props.changeProperty('textContent', value)
    }

    const handleTextChangeText = e => {
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
            <ControlPanel>
                <Select
                    onSelect={value => {
                        props.changeProperty('textMode', value)
                    }}
                    dropdownMatchSelectWidth={false}
                    size="small"
                    style={{ border: '1px solid #ccc' }}
                    value={props.elementValues.textMode}
                    placeholder="Choose one option"
                >
                    {[
                        { value: 'text', label: 'text' },
                        { value: 'css', label: 'css' },
                        { value: 'javascript', label: 'javascript' },
                    ].map(option => (
                        <Select.Option
                            key={'select' + option.value}
                            value={option.value}
                        >
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>

                {props.elementValues.textMode === 'text' ? (
                    <>
                        <SmallButton
                            title="Split"
                            tooltip="Split the text into separate text elements"
                            buttonClicked={() => {
                                props.splitText(
                                    props.type,
                                    state.selectionStart,
                                    state.selectionEnd
                                )
                            }}
                            icon={<ForkOutlined />}
                            requiredRights={props.requiredRights}
                        />
                        <Divider type="vertical" />
                        <SmallButton
                            title="To span"
                            tooltip="Put the highlighted text into a sparate span element"
                            buttonClicked={() => {
                                props.textToSpan(
                                    props.type,
                                    state.selectionStart,
                                    state.selectionEnd
                                )
                            }}
                            icon={<SplitCellsOutlined />}
                            requiredRights={props.requiredRights}
                        />
                    </>
                ) : (
                    <SmallButton
                        buttonClicked={() => {
                            editor.current.makeCodePrettier()
                        }}
                        title="Beautify"
                        icon={<StarOutlined />}
                        tooltip="Beautify the code"
                        requiredRights={props.requiredRights}
                    />
                )}
            </ControlPanel>
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
    }
}

export default connect(
    null,
    mapDispatchToProps
)(TextProperty)
