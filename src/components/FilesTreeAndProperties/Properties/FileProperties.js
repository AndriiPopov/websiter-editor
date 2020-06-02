import React, { useEffect, useState, forwardRef } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Editor from '../../Editor/Editor'
import Select from 'antd/es/select'

import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.min.css'
import ImageEditor from '@toast-ui/react-image-editor'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import { getFileUrl } from '../../../utils/getFileUrl'

import bytes from 'bytes'
import TimeAgo from 'react-timeago'
import Resize from './resize'
import ControlPanel from '../../UI/ControlPanel'
import CompressOutlined from '@ant-design/icons/CompressOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined'
import Menu from 'antd/es/menu'

import EditOutlined from '@ant-design/icons/EditOutlined'
import Divider from 'antd/es/divider'
import * as classes from './FileProperties.module.css'

const FileProperties = forwardRef((props, ref) => {
    useEffect(() => {
        props.setLoaded(false)
    }, [props.currentFileId])

    const [fileSize, setFileSize] = useState(props.currentFileItem.size)
    const [sourceDataUrl, setSourceDataUrl] = useState()

    const type =
        props.currentFileItem.type.indexOf('image') >= 0
            ? 'image'
            : props.currentFileItem.type.indexOf('text') >= 0
            ? 'text'
            : 'other'
    if (!props.currentFileItem) return null

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

    const loadFile = () => {
        axios.get(props.currentFileItem.url).then(response => {
            props.setValue(response.data)
            props.setEditorMode(props.currentFileItem.editorMode || 'css')
            props.setLoaded(true)
        })
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

    const handleButtonMenuClick = e => {
        switch (e.key) {
            case 'saveNew':
                props.saveFile(
                    props.currentFileItem.id,
                    undefined,
                    props.currentFileItem.type
                )
                break

            default:
                break
        }
    }

    const fIleInfoScreen = (
        <div className={classes.Container}>
            {type === 'image' && (
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
            )}
            {props.currentFileItem && (
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
                        {type === 'image' && (
                            <tr>
                                <td>Resolution</td>
                                <td>
                                    {props.currentFileItem.resolution.width} X{' '}
                                    {props.currentFileItem.resolution.height}
                                </td>
                            </tr>
                        )}
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
                                    date={props.currentFileItem.modifiedDate}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )

    const editImageScreen = (
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
                theme: {},
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

    const resizeImageScreen = (
        <Resize
            fileSize={fileSize}
            currentFileItem={props.currentFileItem}
            setFileSize={setFileSize}
            sourceDataUrl={sourceDataUrl}
            value={props.value}
            setValue={props.setValue}
        />
    )

    const editorModeOptions = [
        { value: 'text', label: 'text' },
        { value: 'css', label: 'css' },
        { value: 'javascript', label: 'javascript' },
        { value: 'json', label: 'json' },
        { value: 'html', label: 'html' },
        { value: 'xml', label: 'xml' },
    ]
    const textScreen = (
        <>
            <Select
                onSelect={value => {
                    props.setEditorMode(value)
                }}
                dropdownMatchSelectWidth={false}
                size="small"
                style={{ border: '1px solid #ccc', margin: '10px' }}
                value={props.editorMode}
            >
                {editorModeOptions.map(option => (
                    <Select.Option
                        key={'select' + option.value}
                        value={option.value}
                    >
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
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
    )

    return (
        <>
            <ControlPanel>
                {props.loaded && (
                    <>
                        <SmallButton
                            title="Save"
                            icon={<SaveOutlined />}
                            buttonClicked={() =>
                                props.saveFile(props.currentFileItem.id, true)
                            }
                            tooltip="Save file (Ctrl + S)"
                            requiredRights={['developer', 'content']}
                            overlay={
                                <Menu onClick={handleButtonMenuClick}>
                                    {props.currentFileItem.id && (
                                        <Menu.Item key="saveNew">
                                            Save as new
                                        </Menu.Item>
                                    )}
                                </Menu>
                            }
                        />
                        <Divider type="vertical" />
                    </>
                )}
                {!props.loaded && (type === 'image' || type === 'text') && (
                    <>
                        <SmallButton
                            buttonClicked={() => {
                                if (type === 'image') props.setLoaded(true)
                                else loadFile()
                            }}
                            title="Edit"
                            icon={<EditOutlined />}
                        />
                        <Divider type="vertical" />
                    </>
                )}
                {!props.loaded && type === 'image' && (
                    <SmallButton
                        buttonClicked={() => {
                            props.setLoaded('resize')
                            loadFileToDataUrl()
                        }}
                        icon={<CompressOutlined />}
                        title="Resize"
                    />
                )}
                {props.loaded && (
                    <SmallButton
                        buttonClicked={() => {
                            props.setLoaded()
                        }}
                        icon={<ArrowLeftOutlined />}
                        title="Back"
                    />
                )}
            </ControlPanel>
            {!props.loaded
                ? fIleInfoScreen
                : type === 'image'
                ? props.loaded === 'resize'
                    ? resizeImageScreen
                    : editImageScreen
                : type === 'text'
                ? textScreen
                : fIleInfoScreen}
        </>
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
