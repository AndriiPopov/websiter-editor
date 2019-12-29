import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'

import * as classes from './Properties.module.css'
// import * as actions from '../../../store/actions'
import TextProperty from './TextProperty/TextProperty'
import MenuItems from './MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import { checkIfCapital } from '../../../utils/basic'
import propertiesSuggestedList from './propertiesSuggestedList'

import type {
    resourceType,
    elementType,
    initialStateType,
} from '../../../store/reducer/reducer'

type Props = {
    resourceDraft: resourceType,
    changeProperty: (key: string | {}, value: string) => {},
    mode: 'page' | 'plugin',
    currentResource:
        | $PropertyType<initialStateType, 'currentPlugin'>
        | $PropertyType<initialStateType, 'currentPage'>,
}

const Properties = (props: Props) => {
    if (!props.resourceDraft.structure) return null
    const element = props.resourceDraft.structure.find(
        item => props.resourceDraft.currentBox === item.id
    )

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
    return element ? (
        element.text && !isPlugin ? (
            <TextProperty
                element={element}
                changeProperty={props.changeProperty}
                currentResource={props.currentResource}
                resourceDraft={props.resourceDraft}
            />
        ) : (
            <Tabs className={['react-tabs', classes.reactTabs].join(' ')}>
                <TabList>
                    {/* {element.tag !== 'menu' ? ( */}
                    {!isPlugin ? (
                        <Tab
                            className={[
                                'react-tabs__tab',
                                classes.reactTabsTab,
                            ].join(' ')}
                        >
                            Style
                        </Tab>
                    ) : null}
                    {/* ) : null} */}
                    <Tab
                        className={[
                            'react-tabs__tab',
                            classes.reactTabsTab,
                        ].join(' ')}
                    >
                        Properties
                    </Tab>
                    {element.tag === 'websiterMenu' ? (
                        <Tab
                            className={[
                                'react-tabs__tab',
                                classes.reactTabsTab,
                            ].join(' ')}
                        >
                            Items
                        </Tab>
                    ) : null}
                </TabList>
                {/* {element.tag !== 'menu' ? ( */}
                {!isPlugin ? (
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classes.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        <Editor
                            currentElement={props.resourceDraft.currentBox}
                            elementValue={'{ ' + (element.style || '') + ' }'}
                            elementCurrentCursor={element.cursorPosition}
                            editorMode="css"
                            handleChange={handleStyleChange}
                            name="editorStyle"
                        />
                    </TabPanel>
                ) : null}
                {/* ) : null} */}
                <TabPanel
                    selectedClassName={[
                        'react-tabs__tab-panel--selected',
                        classes.reactTabsTabPanelSelected,
                    ].join(' ')}
                >
                    <Editor
                        suggestOptions={[
                            ...(element.tag !== 'menu'
                                ? propertiesSuggestedList.baseHtmlProps
                                : []),
                            ...(propertiesSuggestedList[element.tag]
                                ? propertiesSuggestedList[element.tag]
                                : []),
                        ]}
                        currentElement={props.resourceDraft.currentBox}
                        elementValue={element.propertiesString || '{}'}
                        elementCurrentCursor={element.cursorPosition}
                        editorMode="json"
                        handleChange={hanglePropertiesChange}
                        name="editorProperties"
                    />
                </TabPanel>
                {element.tag === 'websiterMenu' ? (
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classes.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        <MenuItems
                            element={element}
                            changeProperty={props.changeProperty}
                            mode={props.mode}
                        />
                    </TabPanel>
                ) : null}
            </Tabs>
        )
    ) : null
}

export default Properties
