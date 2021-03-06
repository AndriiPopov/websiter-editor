import React, { Component } from 'react'
import { connect } from 'react-redux'
// import * as actions from '../../store/actions/index'
import AceEditor from 'react-ace'

import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'

// import beautify from 'ace-builds/src-min-noconflict/ext-beautify'
import beautify_js, { css as beautify_css } from 'js-beautify'
import Select from 'antd/es/select'
import ControlPanel from '../UI/ControlPanel'

// import type { elementType } from '../../../../store/reducer/reducer'

ace.config.set('basePath', '/ace-builds/src-noconflict')
ace.config.set('modePath', '/ace-builds/src-noconflict')
ace.config.set('themePath', '/ace-builds/src-noconflict')
ace.config.set('workerPath', '/ace-builds/src-noconflict')

// var editor = ace.edit('editor') // get reference to editor

type Props = {
    // currentElement: $PropertyType<elementType, 'id'>,
    // elementValue: $PropertyType<elementType, 'propertiesString'>,
    // elementCurrentCursor: $PropertyType<elementType, 'cursorPosition'>,
    // editorMode: 'json' | 'css',
    // handleChange: (value: string, cursorPosition: {}) => {},
    // readOnly?: boolean,
}

type State = {
    value: string
    updateValue: boolean
    isBeatifying: boolean
}

class Editor extends Component<Props, State> {
    onChange = (value: string) => {
        this.setState({
            value,
            updateValue: false,
        })
        if (this.state.isBeatifying) return
        setTimeout(
            () =>
                this.props.handleChange(
                    value,
                    this.editor.getSelection().getCursor()
                ),
            10
        )
    }

    handleSelectProperty = value => {
        if (!value) return
        let obj
        try {
            obj = JSON.parse(this.state.value)
        } catch (e) {
            obj = null
        }
        if (obj) {
            const selectedOption = this.props.suggestOptions.find(
                option => option.label === value
            )
            obj[selectedOption.label] = selectedOption.val
            const resultString = JSON.stringify(obj)
            this.onChange(resultString)
        }
        this.makeCodePrettier()
    }

    makeCodePrettier = () => {
        setTimeout(() => {
            this.editor.moveCursorToPosition(
                this.props.elementCurrentCursor || {
                    column: 0,
                    row: 0,
                }
            )
            if (!this.state.updateValue) {
                this.setState({ isBeatifying: true })
                if (this.props.editorMode === 'json') {
                    let obj
                    try {
                        obj = JSON.parse(this.state.value)
                    } catch (e) {
                        obj = null
                    }
                    if (obj) {
                        this.setState({
                            value: JSON.stringify(obj, null, '\t'),
                            updateValue: false,
                        })
                    }
                } else {
                    // beautify.beautify(this.editor.session)
                    if (this.props.editorMode === 'css') {
                        const newValue = beautify_css(this.state.value)
                        this.setState({ value: newValue })
                    } else if (this.props.editorMode === 'javascript') {
                        const newValue = beautify_js(this.state.value)
                        this.setState({ value: newValue })
                    }
                }
                this.setState({ isBeatifying: false })
            }
        }, 10)
    }

    componentDidUpdate(prevProps, prevState) {
        const { props } = this
        if (
            prevState.updateValue === false &&
            this.state.updateValue === true
        ) {
        } else {
            if (
                props.currentElement !== prevProps.currentElement ||
                props.currentResource !== prevProps.currentResource ||
                this.state.updateValue ||
                props.editorMode !== prevProps.editorMode
            ) {
                if (!props.currentElement) {
                    this.setState({
                        value: '',
                        updateValue: false,
                    })
                } else {
                    this.setState({
                        value: props.elementValue,
                        updateValue: false,
                    })
                    this.makeCodePrettier()
                }
            }
        }
    }
    editor: any
    componentDidMount() {
        this.editor = this.refs.aceEditor.editor
        setInterval(() => {
            this.editor.resize()
        }, 1000)
        this.setState({
            value: this.props.elementValue,
            updateValue: false,
        })
        this.makeCodePrettier()
    }
    constructor(props) {
        super(props)
        this.state = { value: '', updateValue: false, isBeatifying: false }
        this.onChange = this.onChange.bind(this)
    }

    render() {
        return (
            <>
                {this.props.suggestOptions ? (
                    <ControlPanel>
                        <Select
                            onSelect={this.handleSelectProperty}
                            dropdownMatchSelectWidth={false}
                            //requiredRights={['content']}
                            size="small"
                            style={{ width: '100%' }}
                            placeholder="Suggested properties and attributes"
                        >
                            {this.props.suggestOptions.map(option => (
                                <Select.Option
                                    key={'select_' + option.label}
                                    value={option.label}
                                >
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </ControlPanel>
                ) : null}
                <AceEditor
                    ref="aceEditor"
                    value={this.state.value}
                    mode={this.props.editorMode}
                    readOnly={this.props.readOnly}
                    theme="github"
                    onChange={this.onChange}
                    name={this.props.name}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    style={{ flex: '1', width: 'auto', height: 'auto' }}
                    placeholder="Put your code here"
                    setOptions={{
                        enableBasicAutocompletion:
                            this.props.editorMode !== 'text',
                        enableLiveAutocompletion:
                            this.props.editorMode !== 'text',
                        enableSnippets: this.props.editorMode !== 'text',
                        showLineNumbers: this.props.editorMode !== 'text',
                        tabSize: 2,
                        useWorker: false,
                        // setAutoScrollEditorIntoView: true,
                    }}
                    // commands={[
                    //     {
                    //         name: 'undo',
                    //         bindKey: { win: 'Ctrl-z', mac: 'Command-z' },
                    //         exec: () => {
                    //             this.setState({
                    //                 updateValue: true,
                    //             })
                    //             this.props.undoResourceVersion()
                    //         },
                    //     },
                    //     {
                    //         name: 'redo',
                    //         bindKey: {
                    //             win: 'Ctrl-Shift-z',
                    //             mac: 'Command-Shift-z',
                    //         },
                    //         exec: () => {
                    //             this.setState({
                    //                 updateValue: true,
                    //             })
                    //             this.props.redoResourceVersion()
                    //         },
                    //     },
                    // ]}
                />
            </>
        )
    }
}

// const mapDispatchToProps = (dispatch, props) => {
//     return {
//         // undoResourceVersion: () => dispatch(actions.undoResourceVersion()),
//         // redoResourceVersion: () => dispatch(actions.redoResourceVersion()),
//     }
// }

export default connect(
    null,
    null,
    null,
    { forwardRef: true }
)(Editor)
