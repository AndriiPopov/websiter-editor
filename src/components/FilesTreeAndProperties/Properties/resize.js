import React, { useState } from 'react'
import bytes from 'bytes'
import InputNumber from 'antd/es/input-number'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import {
    resizeImageFromSrcToSpecificSize,
    urltoFile,
} from '../../../store/actions/files'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import * as classes from './FileProperties.module.css'

const Resize = props => {
    const [resolution, setResolution] = useState(
        props.currentFileItem.resolution
    )

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
            props.sourceDataUrl,
            resolution,
            async data => {
                props.setValue(data)
                const file = await urltoFile(
                    data,
                    props.currentFileItem.name + ' (copy)'
                )
                props.setFileSize(file.size)
            }
        )
        props.setValue()
    }
    return (
        <div className={classes.Container}>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Current size</td>
                            <td>
                                {bytes(props.fileSize, {
                                    decimalPlaces: 1,
                                })}
                            </td>
                        </tr>
                        <tr>
                            <td>Current resolution</td>
                            <td>
                                {props.currentFileItem.resolution.width} X{' '}
                                {props.currentFileItem.resolution.height}
                            </td>
                        </tr>
                        <tr>
                            <td>Set new resolution</td>
                            <td>
                                <InputNumber
                                    min={0}
                                    onChange={value =>
                                        handleChangeResolution(value, 'width')
                                    }
                                    value={parseInt(resolution.width)}
                                    inline={true}
                                />{' '}
                                X{' '}
                                <InputNumber
                                    min={0}
                                    onChange={value =>
                                        handleChangeResolution(value, 'height')
                                    }
                                    value={parseInt(resolution.height)}
                                    inline={true}
                                />
                                <SmallButton
                                    title="Apply"
                                    inline={true}
                                    buttonClicked={handleApplyResolutionChange}
                                    icon={<CheckOutlined />}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <img alt="Is loading" src={props.value} />
        </div>
    )
}
export default Resize
