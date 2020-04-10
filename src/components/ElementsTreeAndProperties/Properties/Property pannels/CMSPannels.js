import React, { useRef } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as classes from '../Properties.module.css'
import Select from '../../../UI/Select/Select'
import { getCurrentResourceValue } from '../../../../utils/basic'
import Editor from '../../../Editor/Editor'
import MenuItems from '../MenuItems/MenuItems'
import FileItems from '../FileItems/FileItems'
import HTMLEditor from '../../../HTMLEditor/HTMLEditor'
import { SketchPicker, CirclePicker } from 'react-color'
import checkUserRights from '../../../../utils/checkUserRights'
import { connect } from 'react-redux'

const CMSPannel = props => {
    const rangeInput = useRef(null)
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
        ...props.propagatingPlugins,
    ]

    return (
        <Tabs
            className={['react-tabs', classes.reactTabs].join(' ')}
            selectedTabPanelClassName={pannelClass}
        >
            <TabList>
                <Tab className={tabClass}>Type</Tab>
                <Tab className={tabClass}>System name</Tab>
                <Tab className={tabClass}>Properties</Tab>
                <Tab className={tabClass}>Desription</Tab>
                <Tab className={tabClass}>Default value</Tab>
            </TabList>
            <TabPanel>
                <Select
                    onChange={option =>
                        changeProperty('CMSVariableType', option.value)
                    }
                    options={variableOptions}
                    default={variableOptions.findIndex(
                        item => item.value === elementValues.CMSVariableType
                    )}
                    requiredRights={['developer']}
                />
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
                {elementValues.CMSVariableType === 'html' ? (
                    <HTMLEditor
                        value={elementValues.CMSVariableDefaultValue}
                        handleChange={(e, editor) => {
                            changeProperty(
                                'CMSVariableDefaultValue',
                                editor.getContent()
                            )
                        }}
                        requiredRights={['developer']}
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
                        <input
                            type={elementValues.CMSVariableType}
                            style={{ margin: '5px' }}
                            defaultValue={elementValues.CMSVariableDefaultValue}
                            onChange={e => {
                                if (!props.checkUserRights(['developer']))
                                    return
                                if (rangeInput.current) {
                                    rangeInput.current.value = e.target.value
                                }
                                changeProperty(
                                    'CMSVariableDefaultValue',
                                    e.target.value
                                )
                            }}
                            max={
                                elementValues.properties
                                    ? elementValues.properties.max
                                    : undefined
                            }
                            min={
                                elementValues.properties
                                    ? elementValues.properties.min
                                    : undefined
                            }
                            step={
                                elementValues.properties
                                    ? elementValues.properties.step
                                    : undefined
                            }
                        />
                        {elementValues.CMSVariableType === 'range' ? (
                            <input
                                type="number"
                                ref={rangeInput}
                                defaultValue={
                                    elementValues.CMSVariableDefaultValue
                                }
                                readOnly
                            />
                        ) : null}
                    </>
                ) : elementValues.CMSVariableType === 'select' ? (
                    <Select
                        options={
                            elementValues.properties
                                ? elementValues.properties.options || []
                                : []
                        }
                        default={(elementValues.properties
                            ? elementValues.properties.options || []
                            : []
                        ).findIndex(
                            el =>
                                el.value.toString() ===
                                elementValues.CMSVariableDefaultValue.toString()
                        )}
                        onChange={option => {
                            if (!props.checkUserRights(['developer'])) return
                            changeProperty(
                                'CMSVariableDefaultValue',
                                option.value
                            )
                        }}
                    />
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
                                if (!props.checkUserRights(['developer']))
                                    return
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
                            if (!props.checkUserRights(['developer'])) return
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
                        Default value for array and propagating plugin variable
                        cannot be set.
                    </div>
                )}
            </TabPanel>
        </Tabs>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(CMSPannel)
