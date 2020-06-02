import React, { useState } from 'react'
import Tabs from 'antd/es/tabs'

import { connect } from 'react-redux'

import * as classes from '../Properties/Properties.module.css'
import MenuItems from '../Properties/MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import HTMLEditor from '../../HTMLEditor/HTMLEditor'
import { resourceDraftIndex } from '../../../utils/resourceTypeIndex'
import { SketchPicker, CirclePicker } from 'react-color'

import { getCurrentResourceValue } from '../../../utils/basic'
import Select from 'antd/es/select'
import InputNumber from 'antd/es/input-number'
import Slider from 'antd/es/slider'

// import type { initialStateType } from '../../../store/reducer/reducer'
import FileItems from '../Properties/FileItems/FileItems'

// type Props = {
//     changeProperty: (key: string | {}, value: string) => ?{},
//     mode: 'page' | 'plugin' | 'template',
//     currentResource:
//         | $PropertyType<initialStateType, 'currentPlugin'>
//         | $PropertyType<initialStateType, 'currentPage'>
//         | $PropertyType<initialStateType, 'currentTemplate'>,
// }

const Properties = props => {
    const [rangeValue, setRangeValue] = useState()
    return props.element && props.templateCMSElementValues ? (
        <Tabs defaultActiveKey="value" animated={false} size="small">
            <Tabs.TabPane tab="Value" key="value">
                {props.templateCMSElementValues.CMSVariableType === 'html' ? (
                    <HTMLEditor
                        value={props.elementValues.value}
                        handleChange={(e, editor, box) => {
                            props.changeProperty(
                                'value',
                                editor.getContent(),
                                box
                            )
                        }}
                        requiredRights={['content']}
                        currentBox={props.currentBox}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'menuItems' ? (
                    <MenuItems
                        elementValues={props.elementValues}
                        element={props.element}
                        changeProperty={props.changeProperty}
                        mode={props.mode}
                        attrName={'menuItems'}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'text' ? (
                    <Editor
                        currentElement={props.currentBox}
                        elementValue={props.elementValues.value}
                        elementCurrentCursor={
                            props.elementValues.cursorPosition
                        }
                        editorMode="text"
                        handleChange={value =>
                            props.changeProperty('value', value)
                        }
                        name="editorPageValue"
                        requiredRights={['content']}
                        currentResource={props.currentResource}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                      'number' ||
                  props.templateCMSElementValues.CMSVariableType === 'range' ? (
                    <>
                        {props.templateCMSElementValues.CMSVariableType ===
                            'range' && (
                            <Slider
                                style={{ margin: '10px' }}
                                defaultValue={props.elementValues.value}
                                value={rangeValue}
                                onChange={value => {
                                    setRangeValue(value)

                                    props.changeProperty('value', value)
                                }}
                                max={
                                    props.templateCMSElementValues.properties
                                        ? props.templateCMSElementValues
                                              .properties.max
                                        : undefined
                                }
                                min={
                                    props.templateCMSElementValues.properties
                                        ? props.templateCMSElementValues
                                              .properties.min
                                        : undefined
                                }
                                step={
                                    props.templateCMSElementValues.properties
                                        ? props.templateCMSElementValues
                                              .properties.step
                                        : undefined
                                }
                            />
                        )}
                        <InputNumber
                            style={{ margin: '10px' }}
                            defaultValue={props.elementValues.value}
                            value={rangeValue}
                            onChange={value => {
                                setRangeValue(value)
                                props.changeProperty('value', value)
                            }}
                            max={
                                props.templateCMSElementValues.properties
                                    ? props.templateCMSElementValues.properties
                                          .max
                                    : undefined
                            }
                            min={
                                props.templateCMSElementValues.properties
                                    ? props.templateCMSElementValues.properties
                                          .min
                                    : undefined
                            }
                            step={
                                props.templateCMSElementValues.properties
                                    ? props.templateCMSElementValues.properties
                                          .step
                                    : undefined
                            }
                        />
                    </>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'select' ? (
                    <Select
                        onSelect={value => {
                            props.changeProperty('value', value)
                        }}
                        dropdownMatchSelectWidth={false}
                        size="small"
                        style={{ border: '1px solid #ccc', margin: '10px' }}
                        value={props.elementValues.value.toString()}
                        showSearch={true}
                        placeholder="Choose one option"
                    >
                        {(props.templateCMSElementValues.properties
                            ? props.templateCMSElementValues.properties
                                  .options || []
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
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'colorSelect' ? (
                    <div style={{ padding: '10px' }}>
                        <CirclePicker
                            colors={
                                props.templateCMSElementValues.properties
                                    ? props.templateCMSElementValues.properties
                                          .colors
                                    : undefined
                            }
                            color={props.elementValues.color}
                            onChangeComplete={value => {
                                props.changeProperty('color', value.rgb)
                            }}
                        />
                    </div>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'color' ? (
                    <SketchPicker
                        presetColors={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .colors
                                : undefined
                        }
                        color={props.elementValues.color}
                        onChangeComplete={value => {
                            props.changeProperty('color', value.rgb)
                        }}
                        disableAlpha={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .disableAlpha
                                : undefined
                        }
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'file' ? (
                    <FileItems
                        elementValues={props.elementValues}
                        element={props.element}
                        changeProperty={props.changeProperty}
                        mode={props.mode}
                        attrName="fileUrl"
                        attrThumb="fileThumbnail"
                    />
                ) : (
                    <div>
                        Value for propagating plugin variable cannot be set.
                    </div>
                )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Description" key="desc">
                <Editor
                    currentElement={props.currentBox}
                    elementValue={
                        props.templateCMSElementValues.CMSVariableDescription
                    }
                    elementCurrentCursor={
                        props.templateCMSElementValues.cursorPosition
                    }
                    editorMode="text"
                    handleChange={() => {}}
                    readOnly
                    name="editorPageCMSDescription"
                    requiredRights={['content']}
                    currentResource={props.currentResource}
                />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Default value" key="default">
                {props.templateCMSElementValues.CMSVariableType === 'html' ? (
                    <HTMLEditor
                        value={
                            props.templateCMSElementValues
                                .CMSVariableDefaultValue
                        }
                        handleChange={() => {}}
                        readOnly={true}
                        currentBox={props.currentBox}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'menuItems' ? (
                    <MenuItems
                        elementValues={props.templateCMSElementValues}
                        element={props.element}
                        changeProperty={() => {}}
                        mode={props.mode}
                        attrName={'defaultMenuItems'}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'text' ? (
                    <Editor
                        currentElement={props.currentBox}
                        elementValue={
                            props.templateCMSElementValues
                                .CMSVariableDefaultValue
                        }
                        elementCurrentCursor={
                            props.templateCMSElementValues.cursorPosition
                        }
                        editorMode="text"
                        handleChange={() => {}}
                        readOnly
                        name="editorPageCMSDefaultValue"
                        requiredRights={['content']}
                        currentResource={props.currentResource}
                    />
                ) : props.templateCMSElementValues.CMSVariableType ===
                      'number' ||
                  props.templateCMSElementValues.CMSVariableType === 'range' ? (
                    <>
                        {props.templateCMSElementValues.CMSVariableType ===
                            'range' && (
                            <Slider
                                style={{ margin: '10px' }}
                                defaultValue={
                                    props.templateCMSElementValues
                                        .CMSVariableDefaultValue
                                }
                                readOnly
                            />
                        )}
                        <InputNumber
                            style={{ margin: '10px' }}
                            value={
                                props.templateCMSElementValues
                                    .CMSVariableDefaultValue
                            }
                            readOnly
                        />
                    </>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'select' ? (
                    <Select
                        onSelect={value => {}}
                        dropdownMatchSelectWidth={false}
                        size="small"
                        style={{ border: '1px solid #ccc', margin: '10px' }}
                        value={props.templateCMSElementValues.CMSVariableDefaultValue.toString()}
                        showSearch={true}
                        placeholder="Choose one option"
                    >
                        {(props.templateCMSElementValues.properties
                            ? props.templateCMSElementValues.properties
                                  .options || []
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
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'colorSelect' ? (
                    <div style={{ padding: '10px' }}>
                        <CirclePicker
                            colors={
                                props.templateCMSElementValues.properties
                                    ? props.templateCMSElementValues.properties
                                          .colors
                                    : undefined
                            }
                            color={props.templateCMSElementValues.defaultColor}
                        />
                    </div>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'color' ? (
                    <SketchPicker
                        presetColors={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .colors
                                : undefined
                        }
                        color={props.templateCMSElementValues.defaultColor}
                        disableAlpha={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .disableAlpha
                                : undefined
                        }
                    />
                ) : (
                    <div>
                        There is no default value for propagating plugin
                        variable.
                    </div>
                )}
            </Tabs.TabPane>
        </Tabs>
    ) : null
}

const mapStateToProps = (state, props) => {
    const resourceDraft = state.mD[resourceDraftIndex[props.mode]]
    let element = null,
        elementValues = null,
        templateCMSElementValues = null
    if (resourceDraft) {
        if (resourceDraft.structure) {
            element = resourceDraft.structure.find(
                item => resourceDraft.currentBox === item.id
            )
            if (element && state.mD.pageTemplateDraft) {
                elementValues = resourceDraft.values[element.id]
                if (element.forPropagatingPlugin) {
                    const { pluginId, variable } = element.forPropagatingPlugin
                    const templateDraft = getCurrentResourceValue(
                        pluginId,
                        state.mD.resourcesObjects
                    )
                    if (templateDraft)
                        templateCMSElementValues =
                            templateDraft.values[variable]
                } else {
                    templateCMSElementValues =
                        state.mD.pageTemplateDraft.values[element.id]
                }
            }
        }
    }

    return {
        element,
        elementValues,
        templateCMSElementValues,
        currentBox: resourceDraft.currentBox,
        currentResource: state.mD.currentPageId,
    }
}

export default connect(mapStateToProps)(Properties)
