import React, { useState, useEffect } from 'react'
//$FlowFixMe
import { Editor } from '@tinymce/tinymce-react'
import { connect } from 'react-redux'
import checkUserRights from '../../utils/checkUserRights'

import type { elementType, initialStateType } from '../../store/reducer/reducer'
type Props = {
    elementValue: $PropertyType<elementType, 'propertiesString'>,
    elementCurrentCursor: $PropertyType<elementType, 'cursorPosition'>,
    editorMode: 'json' | 'css',
    handleChange: (value: string, cursorPosition: {}) => {},
    readOnly?: boolean,
    sizeIsChanging: $PropertyType<initialStateType, 'sizeIsChanging'>,
    requiredRights: Array<string>,
    value: string,
}

const HTMLEditor = (props: Props) => {
    const [state, setState] = useState(false)
    const [value, setValue] = useState(props.value)
    const [box, setBox] = useState(props.currentBox)

    useEffect(() => {
        setValue(props.value)
        setBox(props.currentBox)
        setState(true)
    }, [props.currentBox])

    const handleChange = (e, editor) => {
        if (!props.checkUserRights(props.requiredRights)) {
            return
        }
        props.handleChange(e, editor, box)
    }

    return (
        <div
            style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
            }}
        >
            {!state ? (
                <Editor
                    apiKey="cgz3v5s8p6m4ivfow51e7pin01evzej1lqy90qmi5z75ly57"
                    value={value}
                    init={{
                        // skin_url: `../../../skins/`,
                        readonly: props.readOnly ? 1 : 0,
                        // height: 500,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table contextmenu paste',
                        ],
                        toolbar:
                            'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        menu: {
                            file: {
                                title: 'File',
                                items: ' print ',
                            },
                            edit: {
                                title: 'Edit',
                                items:
                                    'undo redo | cut copy paste | selectall | searchreplace',
                            },
                            view: {
                                title: 'View',
                                items:
                                    'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
                            },
                            insert: {
                                title: 'Insert',
                                items:
                                    'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
                            },
                            format: {
                                title: 'Format',
                                items:
                                    'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat',
                            },
                            tools: {
                                title: 'Tools',
                                items:
                                    'spellchecker spellcheckerlanguage | code wordcount',
                            },
                            table: {
                                title: 'Table',
                                items:
                                    'inserttable | cell row column | tableprops deletetable',
                            },
                            help: { title: 'Help', items: 'help' },
                        },
                        menubar: true,
                        image_advtab: true,
                        // plugins: [
                        //     'advlist autolink lists link image charmap print preview anchor',
                        //     'searchreplace visualblocks code fullscreen',
                        //     'insertdatetime media table paste code help wordcount',
                        // ],
                        // toolbar:
                        //     'insertfile undo redo | formatselect | bold italic backcolor | \
                        //  alignleft aligncenter alignright alignjustify | \
                        //  bullist numlist outdent indent | removeformat | help | table | ',
                    }}
                    onChange={handleChange}
                    onKeyUp={handleChange}
                    onMouseUp={handleChange}
                />
            ) : (
                <Refresh setState={setState} />
            )}
            {props.sizeIsChanging ? (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: '0',
                        position: 'absolute',
                    }}
                />
            ) : null}
        </div>
    )
}

const Refresh = props => {
    useEffect(() => {
        props.setState(false)
    })
    return null
}

const mapStateToProps = state => {
    return {
        sizeIsChanging: state.sizeIsChanging,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HTMLEditor)

// import React, { useEffect, useState } from 'react'

// // Initialize the app

// import SunEditor, { buttonList } from 'suneditor-react'
// import 'suneditor/dist/css/suneditor.min.css'
// import type { elementType } from '../../../../store/reducer/reducer'

// type Props = {
//     currentElement: $PropertyType<elementType, 'id'>,
//     elementValue: $PropertyType<elementType, 'propertiesString'>,
//     elementCurrentCursor: $PropertyType<elementType, 'cursorPosition'>,
//     editorMode: 'json' | 'css',
//     handleChange: (value: string, cursorPosition: {}) => {},
//     readOnly?: boolean,
// }

// const HTMLEditor = props => {
//     const [state, setState] = useState(props.value)
//     useEffect(() => {
//         setState(props.value)
//     }, [props.currentElement, props.currentResource])
//     return (
//         <SunEditor
//             setContents={state}
//             onChange={props.handleChange}
//             setOptions={{ buttonList: buttonList.complex }}
//         />
//     )
// }

// export default HTMLEditor
