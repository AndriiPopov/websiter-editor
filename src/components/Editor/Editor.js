import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Controlled as CodeMirror } from 'react-codemirror2'
import * as actions from '../../store/actions/index'
import AceEditor from 'react-ace'

import ace from 'ace-builds'
// import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import beautify from 'ace-builds/src-min-noconflict/ext-beautify'
ace.config.set('basePath', '/ace-builds/src-noconflict')
ace.config.set('modePath', '/ace-builds/src-noconflict')
ace.config.set('themePath', '/ace-builds/src-noconflict')
ace.config.set('workerPath', '/ace-builds/src-noconflict')

// var editor = ace.edit('editor') // get reference to editor

// $FlowFixMe
// require('codemirror/mode/htmlmixed/htmlmixed')

type Props = {
    currentElement: string,
    elementValue: string,
    elementCurrentCursor: {},
    editorMode: string,
    handleChange: Function,
}

type State = {
    value: string,
    updateValue: boolean,
    isBeatifying: boolean,
}

class Editor extends Component<Props, State> {
    onChange(value) {
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

    componentDidUpdate(prevProps, prevState) {
        const { props } = this
        if (
            prevState.updateValue === false &&
            this.state.updateValue === true
        ) {
        } else {
            if (
                props.currentElement !== prevProps.currentElement ||
                this.state.updateValue
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
                    setTimeout(() => {
                        this.editor.moveCursorToPosition(
                            props.elementCurrentCursor || {
                                column: 0,
                                row: 0,
                            }
                        )
                        if (!this.state.updateValue) {
                            this.setState({ isBeatifying: true })
                            beautify.beautify(this.editor.session)
                            this.setState({ isBeatifying: false })
                        }
                    }, 10)
                }
            }
        }
    }
    editor
    // $FlowFixMe
    componentDidMount() {
        this.editor = this.refs.aceEditor.editor
        this.setState({
            value: this.props.elementValue,
            updateValue: false,
        })
        setTimeout(() => {
            this.editor.moveCursorToPosition(
                this.props.elementCurrentCursor || {
                    column: 0,
                    row: 0,
                }
            )
            if (!this.state.updateValue) {
                this.setState({ isBeatifying: true })
                beautify.beautify(this.editor.session)
                this.setState({ isBeatifying: false })
            }
        }, 10)
    }
    constructor(props) {
        super(props)
        this.state = { value: '', updateValue: false, isBeatifying: false }
        this.onChange = this.onChange.bind(this)
    }

    render() {
        return (
            <AceEditor
                ref="aceEditor"
                value={this.state.value}
                mode={this.props.editorMode}
                theme="github"
                onChange={this.onChange}
                name={this.props.name}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                width="100%"
                height="100%"
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                    useWorker: false,
                }}
                commands={[
                    {
                        name: 'undo',
                        bindKey: { win: 'Ctrl-z', mac: 'Command-z' },
                        exec: () => {
                            this.setState({
                                updateValue: true,
                            })
                            this.props.undoResourceVersion()
                        },
                    },
                    {
                        name: 'redo',
                        bindKey: {
                            win: 'Ctrl-Shift-z',
                            mac: 'Command-Shift-z',
                        },
                        exec: () => {
                            this.setState({
                                updateValue: true,
                            })
                            this.props.redoResourceVersion()
                        },
                    },
                ]}
            />
        )
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        undoResourceVersion: () => dispatch(actions.undoResourceVersion()),
        redoResourceVersion: () => dispatch(actions.redoResourceVersion()),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Editor)
// <ControlledEditor
//     width="100%"
//     height="100%"
//     language="css"
//     theme="vs-dark"
//     value={state.value}
//     // options={options}
//     onChange={handleChange}
//     // editorDidMount={::this.editorDidMount}
// />
// <CodeMirror
//     value={state.value}
//     options={{
//         mode: 'css',
//         theme: 'material',
//         lineNumbers: true,
//         autocorrect: true,
//         extraKeys: {
//             'Ctrl-Z': () => {},
//             'Shift-Ctrl-Z': () => {},
//         },
//     }}
//     onChange={(editor, data, value) => {
//         if (data.origin) {
//             //setState({ ...state, value })
//             props.addResourceVersion(props.currentFile, {
//                 value: editor.getValue(),
//             })
//         }
//     }}
//     onBeforeChange={(editor, data, value) => {
//         setState({ ...state, value })
//     }}
// />
