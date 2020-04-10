import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'

import * as classes from './Properties.module.css'
import TextProperty from './TextProperty/TextProperty'
import ParseProperty from './ParseProperty/ParseProperty'
import { checkIfCapital } from '../../../utils/basic'
import propertiesSuggestedList from './propertiesSuggestedList'
import Select from '../../UI/Select/Select'
import MenuItems from './MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import HTMLEditor from '../../HTMLEditor/HTMLEditor'
import {
    current as currentIndex,
    resourceDraftIndex,
} from '../../../utils/resourceTypeIndex'
import { getCurrentResourceValue } from '../../../utils/basic'
import CMSPannels from './Property pannels/CMSPannels'
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

    const handlePropertiesChange = (value, cursorPosition) => {
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
        if (typeof value === 'string') {
            value = value.trim()
            if (value.length < 3) {
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
                <CMSPannels
                    tabClass={tabClass}
                    pannelClass={pannelClass}
                    propagatingPlugins={props.propagatingPlugins}
                    elementValues={elementValues}
                    currentBox={currentBox}
                    currentResource={currentResource}
                    element={element}
                    propertiesSuggestedList={propertiesSuggestedList}
                    handlePropertiesChange={handlePropertiesChange}
                    changeProperty={props.changeProperty}
                    mode={props.mode}
                />
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
                    handleChange={(e, editor, id) => {
                        props.changeProperty(
                            'textContent',
                            editor.getContent(),
                            id
                        )
                    }}
                    requiredRights={['developer']}
                    currentBox={currentBox}
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
                                currentResource={currentResource}
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
                            handleChange={handlePropertiesChange}
                            name="editorProperties"
                            requiredRights={['developer']}
                            currentResource={currentResource}
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

    const propagatingPlugins = state.mD.pluginsStructure
        .filter(plugin => plugin.propagating)
        .map(plugin => ({
            label: plugin.name + ' (for propagating plugin)',
            value: 'propagating_' + plugin.id,
        }))

    return {
        element,
        elementValues,

        currentBox: resourceDraft.currentBox,
        currentResource: state.mD[currentIndex[props.mode]],
        propagatingPlugins,
    }
}

export default connect(mapStateToProps)(Properties)
