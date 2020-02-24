import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'

import * as classes from './Properties.module.css'
import TextProperty from './TextProperty/TextProperty'
import ParseProperty from './ParseProperty/ParseProperty'
import MenuItems from './MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import { checkIfCapital } from '../../../utils/basic'
import propertiesSuggestedList from './propertiesSuggestedList'
import Select from '../../UI/Select/Select'
import HTMLEditor from '../../HTMLEditor/HTMLEditor'
import {
    current as currentIndex,
    resourceDraftIndex,
} from '../../../utils/resourceTypeIndex'
import type { resourceType, elementType } from '../../../store/reducer/reducer'

type Props = {
    resourceDraft: resourceType,
    changeProperty: (key: string | {}, value: string) => ?{},
    mode: 'page' | 'plugin' | 'template',
}

const Properties = (props: Props) => {
    const { element, elementValues, currentBox, currentResource } = props

    const tabClass = ['react-tabs__tab', classes.reactTabsTab].join(' ')
    const pannelClass = [
        'react-tabs__tab-panel--selected',
        classes.reactTabsTabPanelSelected,
    ].join(' ')

    const hanglePropertiesChange = (value, cursorPosition) => {
        if (value) {
            const changes: elementType = {}
            changes.cursorPosition = cursorPosition
            changes['propertiesString'] = value
            let obj
            try {
                obj = JSON.parse(value)
            } catch (e) {
                obj = null
            }
            if (obj) {
                changes['properties'] = obj
                changes['propertiesString'] = JSON.stringify(obj)
            }
            props.changeProperty(changes, value)
        }
    }

    const handleStyleChange = (value, cursorPosition) => {
        if (value) {
            value = value.trim()
            if (value.length < 6) {
                value = ''
            } else {
                if (value.charAt(0) === '{') {
                    value = value.slice(1)
                }
                if (value.charAt(value.length - 1) === '}') {
                    value = value.slice(0, value.length - 2)
                }
                value = value.trim()
            }
            const changes = {
                style: value,
                cursorPosition,
            }
            props.changeProperty(changes, value)
        }
    }
    const isPlugin = element ? checkIfCapital(element.tag.charAt(0)) : false

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
            label: 'Menu tems',
            value: 'menuItems',
        },
    ]

    let result = null

    if (element && elementValues && !element.isElementFromCMSVariable) {
        if (props.mode === 'page') {
            result = (
                <TextProperty
                    type={props.mode}
                    element={element}
                    elementValues={elementValues}
                    changeProperty={props.changeProperty}
                    currentResource={currentResource}
                />
            )
        } else if (element.isCMSVariable) {
            result = (
                <Tabs
                    className={['react-tabs', classes.reactTabs].join(' ')}
                    selectedTabPanelClassName={pannelClass}
                >
                    <TabList>
                        <Tab className={tabClass}>Type</Tab>
                        <Tab className={tabClass}>System name</Tab>
                        <Tab className={tabClass}>Desription</Tab>
                        <Tab className={tabClass}>Default value</Tab>
                    </TabList>
                    <TabPanel>
                        <Select
                            onChange={option =>
                                props.changeProperty(
                                    'CMSVariableType',
                                    option.value
                                )
                            }
                            options={variableOptions}
                            default={variableOptions.findIndex(
                                item =>
                                    item.value === elementValues.CMSVariableType
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
                                props.changeProperty(
                                    'CMSVariableSystemName',
                                    value
                                )
                            }
                            name="editorCMSName"
                            requiredRights={['developer']}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Editor
                            currentElement={currentBox}
                            elementValue={elementValues.CMSVariableDescription}
                            elementCurrentCursor={elementValues.cursorPosition}
                            editorMode="text"
                            handleChange={value =>
                                props.changeProperty(
                                    'CMSVariableDescription',
                                    value
                                )
                            }
                            name="editorCMSDescription"
                            requiredRights={['developer']}
                        />
                    </TabPanel>
                    <TabPanel>
                        {elementValues.CMSVariableType === 'html' ? (
                            <HTMLEditor
                                value={elementValues.CMSVariableDefaultValue}
                                handleChange={(e, editor) => {
                                    props.changeProperty(
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
                                changeProperty={props.changeProperty}
                                mode={props.mode}
                                attrName={
                                    element.isCMSVariable
                                        ? 'defaultMenuItems'
                                        : 'menuItems'
                                }
                            />
                        ) : (
                            <Editor
                                currentElement={currentBox}
                                elementValue={
                                    elementValues.CMSVariableDefaultValue
                                }
                                elementCurrentCursor={
                                    elementValues.cursorPosition
                                }
                                editorMode="text"
                                handleChange={value =>
                                    props.changeProperty(
                                        'CMSVariableDefaultValue',
                                        value
                                    )
                                }
                                name="editorCMSDefaultValue"
                                requiredRights={['developer']}
                            />
                        )}
                    </TabPanel>
                </Tabs>
            )
        } else if (element.text && !isPlugin) {
            result = (
                <TextProperty
                    type={props.mode}
                    element={element}
                    elementValues={elementValues}
                    changeProperty={props.changeProperty}
                    currentResource={currentResource}
                    requiredRights={['developer']}
                />
            )
        } else if (element.tag === 'richEditor') {
            result = (
                <HTMLEditor
                    value={elementValues.textContent}
                    handleChange={(e, editor) => {
                        props.changeProperty('textContent', editor.getContent())
                    }}
                    requiredRights={['developer']}
                />
            )
        } else if (element.tag === 'parseHTML') {
            result = (
                <ParseProperty
                    type={props.mode}
                    requiredRights={['developer']}
                    currentResource={currentResource}
                    currentBox={currentBox}
                    element={element}
                />
            )
        } else {
            result = (
                <Tabs
                    className={['react-tabs', classes.reactTabs].join(' ')}
                    selectedTabPanelClassName={pannelClass}
                >
                    <TabList>
                        {!isPlugin ? (
                            <Tab className={tabClass}>Style</Tab>
                        ) : null}
                        <Tab className={tabClass}>Properties</Tab>
                        {element.tag === 'websiterMenu' ? (
                            <Tab className={tabClass}>Items</Tab>
                        ) : null}
                    </TabList>
                    {!isPlugin ? (
                        <TabPanel>
                            <Editor
                                currentElement={currentBox}
                                elementValue={
                                    '{ ' + (elementValues.style || '') + ' }'
                                }
                                elementCurrentCursor={
                                    elementValues.cursorPosition
                                }
                                editorMode="css"
                                handleChange={handleStyleChange}
                                name="editorStyle"
                                requiredRights={['developer']}
                            />
                        </TabPanel>
                    ) : null}
                    {/* ) : null} */}
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
                            elementValue={
                                elementValues.propertiesString || '{}'
                            }
                            elementCurrentCursor={elementValues.cursorPosition}
                            editorMode="json"
                            handleChange={hanglePropertiesChange}
                            name="editorProperties"
                            requiredRights={['developer']}
                        />
                    </TabPanel>
                    {element.tag === 'websiterMenu' ? (
                        <TabPanel>
                            <MenuItems
                                elementValues={elementValues}
                                element={element}
                                changeProperty={props.changeProperty}
                                mode={props.mode}
                                attrName="menuItems"
                            />
                        </TabPanel>
                    ) : null}
                </Tabs>
            )
        }
    }
    return result
}

const mapStateToProps = (state, props) => {
    const resourceDraft = state.mD[resourceDraftIndex[props.mode]]
    let element = null,
        elementValues = null
    if (resourceDraft.structure) {
        element = resourceDraft.structure.find(
            item => resourceDraft.currentBox === item.id
        )
        if (element) {
            elementValues = resourceDraft.values[element.id]
        }
    }

    return {
        element,
        elementValues,
        currentBox: resourceDraft.currentBox,
        currentResource: state.mD[currentIndex[props.mode]],
    }
}

export default connect(mapStateToProps)(Properties)
