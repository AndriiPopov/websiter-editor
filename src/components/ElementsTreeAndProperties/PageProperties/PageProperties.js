import React, { useRef } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'

import * as classes from '../Properties/Properties.module.css'
import MenuItems from '../Properties/MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import HTMLEditor from '../../HTMLEditor/HTMLEditor'
import { resourceDraftIndex } from '../../../utils/resourceTypeIndex'
import { SketchPicker, CirclePicker } from 'react-color'

import { getCurrentResourceValue } from '../../../utils/basic'
import checkUserRights from '../../../utils/checkUserRights'
import Select from '../../UI/Select/Select'

import type { initialStateType } from '../../../store/reducer/reducer'
import FileItems from '../Properties/FileItems/FileItems'

type Props = {
    changeProperty: (key: string | {}, value: string) => ?{},
    mode: 'page' | 'plugin' | 'template',
    currentResource:
        | $PropertyType<initialStateType, 'currentPlugin'>
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentTemplate'>,
}

const Properties = (props: Props) => {
    const rangeInput = useRef(null)
    const tabClass = ['react-tabs__tab', classes.reactTabsTab].join(' ')
    const pannelClass = [
        'react-tabs__tab-panel--selected',
        classes.reactTabsTabPanelSelected,
    ].join(' ')

    return props.element && props.templateCMSElementValues ? (
        <Tabs
            className={['react-tabs', classes.reactTabs].join(' ')}
            selectedTabPanelClassName={pannelClass}
        >
            <TabList>
                <Tab className={tabClass}>Value</Tab>
                <Tab className={tabClass}>Description</Tab>
                <Tab className={tabClass}>Default value</Tab>
            </TabList>
            <TabPanel>
                {props.templateCMSElementValues.CMSVariableType === 'html' ? (
                    <HTMLEditor
                        value={props.elementValues.value}
                        handleChange={(e, editor) => {
                            props.changeProperty('value', editor.getContent())
                        }}
                        requiredRights={['content']}
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
                        <input
                            type={
                                props.templateCMSElementValues.CMSVariableType
                            }
                            defaultValue={props.elementValues.value}
                            style={{ margin: '5px' }}
                            onChange={e => {
                                if (!props.checkUserRights(['content'])) return
                                if (rangeInput.current)
                                    rangeInput.current.value = e.target.value
                                props.changeProperty('value', e.target.value)
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
                        {props.templateCMSElementValues.CMSVariableType ===
                        'range' ? (
                            <input
                                type="number"
                                ref={rangeInput}
                                defaultValue={props.elementValues.value}
                                readOnly
                            />
                        ) : null}
                    </>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'select' ? (
                    <Select
                        options={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .options || []
                                : []
                        }
                        default={(props.templateCMSElementValues.properties
                            ? props.templateCMSElementValues.properties
                                  .options || []
                            : []
                        ).findIndex(
                            el =>
                                el.value.toString() ===
                                props.elementValues.value.toString()
                        )}
                        onChange={option => {
                            if (!props.checkUserRights(['developer'])) return
                            props.changeProperty('value', option.value)
                        }}
                    />
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
                                if (!props.checkUserRights(['content'])) return
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
                            if (!props.checkUserRights(['content'])) return
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
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
                {props.templateCMSElementValues.CMSVariableType === 'html' ? (
                    <HTMLEditor
                        value={
                            props.templateCMSElementValues
                                .CMSVariableDefaultValue
                        }
                        handleChange={() => {}}
                        readOnly={true}
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
                        <input
                            type={
                                props.templateCMSElementValues.CMSVariableType
                            }
                            style={{ margin: '5px' }}
                            defaultValue={
                                props.templateCMSElementValues
                                    .CMSVariableDefaultValue
                            }
                            readOnly
                        />
                        {props.templateCMSElementValues.CMSVariableType ===
                        'range' ? (
                            <input
                                type="number"
                                defaultValue={
                                    props.templateCMSElementValues
                                        .CMSVariableDefaultValue
                                }
                                readOnly
                            />
                        ) : null}
                    </>
                ) : props.templateCMSElementValues.CMSVariableType ===
                  'select' ? (
                    <Select
                        options={
                            props.templateCMSElementValues.properties
                                ? props.templateCMSElementValues.properties
                                      .options || []
                                : []
                        }
                        default={(props.templateCMSElementValues.properties
                            ? props.templateCMSElementValues.properties
                                  .options || []
                            : []
                        ).findIndex(
                            el =>
                                el.value.toString() ===
                                props.templateCMSElementValues.CMSVariableDefaultValue.toString()
                        )}
                        onChange={option => {}}
                    />
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
            </TabPanel>
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
const mapDispatchToProps = dispatch => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Properties)
