import React, { useState } from 'react'
import Tabs from 'antd/es/tabs'
import * as classes from '../Properties.module.css'
import Select from 'antd/es/select'
import { getCurrentResourceValue } from '../../../../utils/basic'
import Editor from '../../../Editor/Editor'
import MenuItems from '../MenuItems/MenuItems'
import FileItems from '../FileItems/FileItems'
import HTMLEditor from '../../../HTMLEditor/HTMLEditor'
import { SketchPicker, CirclePicker } from 'react-color'
import InputNumber from 'antd/es/input-number'
import Slider from 'antd/es/slider'

const CMSPannel = props => {
    const {
        pannelClass,
        tabClass,
        elementValues,
        currentBox,
        currentResource,
        element,
        propertiesSuggestedList,
        handlePropertiesChange,
        changeProperty,
        mode,
    } = props
    const variableOptions = [
        {
            label: 'Plain text',
            value: 'text',
        },
        {
            label: 'HTML',
            value: 'html',
        },
        {
            label: 'Number',
            value: 'number',
        },
        {
            label: 'Range',
            value: 'range',
        },
        {
            label: 'Select',
            value: 'select',
        },
        {
            label: 'File',
            value: 'file',
        },
        {
            label: 'Color',
            value: 'color',
        },
        {
            label: 'Color select',
            value: 'colorSelect',
        },
        {
            label: 'Menu tems',
            value: 'menuItems',
        },
        {
            label: 'Array',
            value: 'array',
        },
        {
            label: 'Folder for variables',
            value: 'folder',
        },
        ...props.propagatingPlugins,
    ]

    const [rangeValue, setRangeValue] = useState()
    return (
        <Tabs defaultActiveKey="type" animated={false} size="small">
            <Tabs.TabPane tab="Type" key="type">
                <Select
                    onSelect={value => {
                        changeProperty('CMSVariableType', value)
                    }}
                    dropdownMatchSelectWidth={false}
                    size="small"
                    style={{ border: '1px solid #ccc', margin: '10px' }}
                    value={elementValues.CMSVariableType}
                    showSearch={true}
                    placeholder="Choose one option"
                >
                    {variableOptions.map(option => (
                        <Select.Option
                            key={'select' + option.value}
                            value={option.value}
                        >
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Tabs.TabPane>
            {elementValues.CMSVariableType !== 'folder' && (
                <Tabs.TabPane tab="System name" key="sysName">
                    <Editor
                        currentElement={currentBox}
                        elementValue={elementValues.CMSVariableSystemName}
                        elementCurrentCursor={elementValues.cursorPosition}
                        editorMode="text"
                        handleChange={value =>
                            changeProperty('CMSVariableSystemName', value)
                        }
                        name="editorCMSName"
                        requiredRights={['developer']}
                        currentResource={currentResource}
                    />
                </Tabs.TabPane>
            )}
            {elementValues.CMSVariableType !== 'folder' && (
                <Tabs.TabPane tab="Properties" key="props">
                    <Editor
                        suggestOptions={[
                            ...(element.tag !== 'menu'
                                ? propertiesSuggestedList.baseHtmlProps
                                : []),
                            ...(propertiesSuggestedList[element.tag]
                                ? propertiesSuggestedList[element.tag]
                                : []),
                        ]}
                        currentElement={currentBox}
                        elementValue={elementValues.propertiesString || '{}'}
                        elementCurrentCursor={elementValues.cursorPosition}
                        editorMode="json"
                        handleChange={handlePropertiesChange}
                        name="editorProperties"
                        requiredRights={['developer']}
                        currentResource={currentResource}
                    />
                </Tabs.TabPane>
            )}
            <Tabs.TabPane tab="Desription" key="desr">
                <Editor
                    currentElement={currentBox}
                    elementValue={elementValues.CMSVariableDescription}
                    elementCurrentCursor={elementValues.cursorPosition}
                    editorMode="text"
                    handleChange={value =>
                        changeProperty('CMSVariableDescription', value)
                    }
                    name="editorCMSDescription"
                    requiredRights={['developer']}
                    currentResource={currentResource}
                />
            </Tabs.TabPane>
            {elementValues.CMSVariableType === 'html' && (
                <Tabs.TabPane tab="Default value" key="default">
                    {elementValues.CMSVariableType === 'html' ? (
                        <HTMLEditor
                            value={elementValues.CMSVariableDefaultValue}
                            handleChange={(e, editor, box) => {
                                changeProperty(
                                    'CMSVariableDefaultValue',
                                    editor.getContent(),
                                    box
                                )
                            }}
                            requiredRights={['developer']}
                            currentBox={currentBox}
                        />
                    ) : elementValues.CMSVariableType === 'menuItems' ? (
                        <MenuItems
                            elementValues={elementValues}
                            element={element}
                            changeProperty={changeProperty}
                            mode={mode}
                            attrName="defaultMenuItems"
                        />
                    ) : elementValues.CMSVariableType === 'text' ? (
                        <Editor
                            currentElement={currentBox}
                            elementValue={elementValues.CMSVariableDefaultValue}
                            elementCurrentCursor={elementValues.cursorPosition}
                            editorMode="text"
                            handleChange={value =>
                                changeProperty('CMSVariableDefaultValue', value)
                            }
                            name="editorCMSDefaultValue"
                            requiredRights={['developer']}
                            currentResource={currentResource}
                        />
                    ) : elementValues.CMSVariableType === 'number' ||
                      elementValues.CMSVariableType === 'range' ? (
                        <>
                            {elementValues.CMSVariableType === 'range' && (
                                <Slider
                                    style={{ margin: '10px' }}
                                    defaultValue={
                                        elementValues.CMSVariableDefaultValue
                                    }
                                    value={rangeValue}
                                    onChange={value => {
                                        setRangeValue(value)

                                        changeProperty(
                                            'CMSVariableDefaultValue',
                                            value
                                        )
                                    }}
                                    max={
                                        elementValues.properties &&
                                        elementValues.properties.max
                                    }
                                    min={
                                        elementValues.properties &&
                                        elementValues.properties.min
                                    }
                                    step={
                                        elementValues.properties &&
                                        elementValues.properties.step
                                    }
                                />
                            )}
                            <InputNumber
                                style={{ margin: '10px' }}
                                defaultValue={
                                    elementValues.CMSVariableDefaultValue
                                }
                                value={rangeValue}
                                onChange={value => {
                                    setRangeValue(value)

                                    changeProperty(
                                        'CMSVariableDefaultValue',
                                        value
                                    )
                                }}
                                max={
                                    elementValues.properties &&
                                    elementValues.properties.max
                                }
                                min={
                                    elementValues.properties &&
                                    elementValues.properties.min
                                }
                                step={
                                    elementValues.properties &&
                                    elementValues.properties.step
                                }
                            />
                        </>
                    ) : elementValues.CMSVariableType === 'select' ? (
                        <Select
                            onSelect={value => {
                                changeProperty('CMSVariableDefaultValue', value)
                            }}
                            dropdownMatchSelectWidth={false}
                            size="small"
                            style={{ border: '1px solid #ccc', margin: '10px' }}
                            value={elementValues.CMSVariableDefaultValue.toString()}
                            showSearch={true}
                            placeholder="Choose one option"
                            requiredRights={['developer']}
                        >
                            {(elementValues.properties
                                ? elementValues.properties.options || []
                                : []
                            ).map(option => (
                                <Select.Option
                                    key={'select' + option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : elementValues.CMSVariableType === 'colorSelect' ? (
                        <div style={{ padding: '10px' }}>
                            <CirclePicker
                                colors={
                                    elementValues.properties
                                        ? elementValues.properties.colors
                                        : undefined
                                }
                                color={elementValues.defaultColor}
                                onChangeComplete={value => {
                                    changeProperty('defaultColor', value.rgb)
                                }}
                            />
                        </div>
                    ) : elementValues.CMSVariableType === 'file' ? (
                        <FileItems
                            elementValues={elementValues}
                            element={element}
                            changeProperty={changeProperty}
                            mode={mode}
                            attrName="defaultFileUrl"
                        />
                    ) : elementValues.CMSVariableType === 'color' ? (
                        <SketchPicker
                            presetColors={
                                elementValues.properties
                                    ? elementValues.properties.colors
                                    : undefined
                            }
                            color={elementValues.defaultColor}
                            onChangeComplete={value => {
                                changeProperty('defaultColor', value.rgb)
                            }}
                            disableAlpha={
                                elementValues.properties
                                    ? elementValues.properties.disableAlpha
                                    : undefined
                            }
                        />
                    ) : (
                        <div>
                            Default value for array and propagating plugin
                            variable cannot be set.
                        </div>
                    )}
                </Tabs.TabPane>
            )}
        </Tabs>
    )
}

export default CMSPannel
