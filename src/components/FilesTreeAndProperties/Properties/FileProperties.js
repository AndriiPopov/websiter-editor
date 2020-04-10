import React, { useEffect, useState, forwardRef } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as classes from './FileProperties.module.css'
import Editor from '../../Editor/Editor'
import Select from '../../UI/Select/Select'
import Svg from '../../Svg/Svg'
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.min.css'
import ImageEditor from '@toast-ui/react-image-editor'
import ValueInput from '../../UI/ValueInput/ValueInput'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import {
    resizeImageFromSrcToSpecificSize,
    urltoFile,
} from '../../../store/actions/files'
import bytes from 'bytes'
import TimeAgo from 'react-timeago'
import { getFileUrl } from '../../../utils/getFileUrl'

const FileProperties = forwardRef((props, ref) => {
    useEffect(() => {
        props.setLoaded(false)
    }, [props.currentFileId])

    const [resolution, setResolution] = useState(
        props.currentFileItem.resolution
    )
    const [fileSize, setFileSize] = useState(props.currentFileItem.size)
    const [sourceDataUrl, setSourceDataUrl] = useState()

    if (!props.currentFileItem) return null

    const loadFile = () => {
        axios.get(props.currentFileItem.url).then(response => {
            props.setValue(response.data)
            props.setEditorMode(props.currentFileItem.editorMode || 'css')
            props.setLoaded(true)
        })
    }

    const handleChangeResolution = (value, type) => {
        if (type === 'width') {
            setResolution({
                width: value,
                height:
                    value *
                    (props.currentFileItem.resolution.height /
                        props.currentFileItem.resolution.width),
            })
        } else {
            setResolution({
                width:
                    value *
                    (props.currentFileItem.resolution.width /
                        props.currentFileItem.resolution.height),
                height: value,
            })
        }
    }

    const handleApplyResolutionChange = () => {
        resizeImageFromSrcToSpecificSize(
            sourceDataUrl,
            resolution,
            async data => {
                props.setValue(data)
                const file = await urltoFile(
                    data,
                    props.currentFileItem.name + ' (copy)'
                )
                setFileSize(file.size)
            }
        )
        props.setValue()
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest()
        xhr.open('get', url)
        xhr.responseType = 'blob'
        xhr.onload = function() {
            var fr = new FileReader()

            fr.onload = function() {
                callback(this.result)
            }

            fr.readAsDataURL(xhr.response) // async call
        }

        xhr.send()
    }
    const loadFileToDataUrl = () => {
        const reqUrl = getFileUrl(
            props.structure,
            props.currentFileItem.id,
            false,
            false,
            props.currentWebsiteObject.domain
        )
        toDataURL(reqUrl, dataUrl => {
            setSourceDataUrl(dataUrl)
            props.setValue(dataUrl)
        })
    }

    if (props.currentFileItem.type.indexOf('image') >= 0) {
        const myTheme = {
            // Theme object to extends default dark theme.
        }

        return props.loaded ? (
            props.loaded === 'resize' ? (
                <div>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Current size</td>
                                    <td>
                                        {bytes(fileSize, {
                                            decimalPlaces: 1,
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Current resolution</td>
                                    <td>
                                        {props.currentFileItem.resolution.width}{' '}
                                        X{' '}
                                        {
                                            props.currentFileItem.resolution
                                                .height
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Set new resolution</td>
                                    <td>
                                        <ValueInput
                                            min={0}
                                            changed={value =>
                                                handleChangeResolution(
                                                    value,
                                                    'width'
                                                )
                                            }
                                            value={parseInt(resolution.width)}
                                            inline={true}
                                        />{' '}
                                        X{' '}
                                        <ValueInput
                                            min={0}
                                            changed={value =>
                                                handleChangeResolution(
                                                    value,
                                                    'height'
                                                )
                                            }
                                            value={parseInt(resolution.height)}
                                            inline={true}
                                        />
                                        <SmallButton
                                            title="Apply"
                                            inline={true}
                                            buttonClicked={
                                                handleApplyResolutionChange
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <img alt="Is loading" src={props.value} />
                </div>
            ) : (
                <ImageEditor
                    ref={ref}
                    includeUI={{
                        loadImage: {
                            //path: props.currentFileItem.url,
                            path: getFileUrl(
                                props.structure,
                                props.currentFileItem.id,
                                false,
                                false,
                                props.currentWebsiteObject.domain
                            ),
                            name: 'SampleImage',
                        },
                        theme: myTheme,
                        menu: [
                            'crop',
                            'flip',
                            'rotate',
                            'draw',
                            'shape',
                            'icon',
                            'text',
                            'mask',
                            'filter',
                        ],
                        initMenu: 'filter',
                        uiSize: {
                            width: '1000px',
                            height: '700px',
                        },
                        menuBarPosition: 'right',
                    }}
                    cssMaxHeight={500}
                    cssMaxWidth={700}
                    selectionStyle={{
                        cornerSize: 20,
                        rotatingPointOffset: 70,
                    }}
                    usageStatistics={false}
                />
            )
        ) : (
            <div style={{ margin: '30px auto' }}>
                <button onClick={() => props.setLoaded(true)}>Edit</button>
                <button
                    onClick={() => {
                        props.setLoaded('resize')
                        loadFileToDataUrl()
                    }}
                >
                    Resize
                </button>
                <img
                    src={getFileUrl(
                        props.structure,
                        props.currentFileItem.id,
                        false,
                        true,
                        props.currentWebsiteObject.domain
                    )}
                    style={{
                        maxHeight: '120',
                        maxWidth: '120',
                        display: 'block',
                    }}
                    alt="websiter"
                />
                {props.currentFileItem ? (
                    <table>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{props.currentFileItem.name}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>
                                    {bytes(props.currentFileItem.size, {
                                        decimalPlaces: 1,
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{props.currentFileItem.type}</td>
                            </tr>
                            <tr>
                                <td>Date created</td>
                                <td>
                                    <TimeAgo
                                        date={props.currentFileItem.createdDate}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Date modified</td>
                                <td>
                                    <TimeAgo
                                        date={
                                            props.currentFileItem.modifiedDate
                                        }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : null}
            </div>
        )
    } else if (props.currentFileItem.type.indexOf('text') >= 0) {
        const editorModeOptions = [
            { value: 'text', label: 'text' },
            { value: 'css', label: 'css' },
            { value: 'javascript', label: 'javascript' },
            { value: 'json', label: 'json' },
            { value: 'html', label: 'html' },
        ]
        return props.loaded ? (
            <>
                <Select
                    options={editorModeOptions}
                    default={editorModeOptions.findIndex(
                        item => item.label === props.editorMode
                    )}
                    onChange={item => props.setEditorMode(item.value)}
                    isClearable={false}
                    requiredRights={['developer', 'content']}
                />
                <Editor
                    currentElement={props.currentFileId}
                    elementValue={props.value}
                    editorMode={props.editorMode}
                    handleChange={value => props.setValue(value)}
                    name="editorProperties"
                    requiredRights={['developer']}
                    currentResource="0"
                />
            </>
        ) : (
            <div style={{ margin: '30px auto' }}>
                <button onClick={loadFile}>Edit</button>
                <Svg icon='<svg width="100" height="100" viewBox="0 0 24 24"><path fill="#555" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>' />
            </div>
        )
    }
    return (
        <div style={{ margin: '30px auto' }}>
            <Svg icon='<svg width="100" height="100" viewBox="0 0 24 24"><path fill="#555" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>' />
        </div>
    )
})

const mapStateToProps = state => {
    return {
        currentFileItem: state.mD.currentFileItem,
        currentFileId: state.mD.currentFileId,
        structure: state.mD.filesStructure,
        currentWebsiteObject: state.mD.currentWebsiteObject,
    }
}

export default connect(
    mapStateToProps,
    null,
    null,
    { forwardRef: true }
)(FileProperties)
