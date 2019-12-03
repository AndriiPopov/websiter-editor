import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'

import * as classes from './Properties.module.css'
// import StyleProperties from './StyleProperties/StyleProperties'
import TextProperty from './TextProperty/TextProperty'
// import OtherProperties from './OtherProperties/OtherProperties'
import MenuItems from './MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import { checkIfCapital } from '../../../utils/basic'
import type { pageStructureType } from '../../../../flowTypes'

type Props = {
    structure: pageStructureType,
    currentBox: string,
    changeProperty: Function,
}

const Properties = (props: Props) => {
    const element = props.resourceDraft.structure.find(
        item => props.resourceDraft.currentBox === item.id
    )

    const hanglePropertiesChange = (value, cursorPosition) => {
        if (value) {
            const changes = {
                propertiesString: value,
                cursorPosition,
            }
            let obj
            try {
                obj = JSON.parse(value)
            } catch (e) {
                obj = null
            }
            if (obj) {
                changes.properties = obj
            }
            props.changeProperty(changes, value, cursorPosition)
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
            props.changeProperty(changes, value, cursorPosition)
        }
    }

    return element ? (
        !checkIfCapital(element.tag.charAt(0)) ? (
            element.text ? (
                <TextProperty
                    element={element}
                    changeProperty={props.changeProperty}
                    currentResource={props.currentResource}
                    resourceDraft={props.resourceDraft}
                />
            ) : (
                <Tabs className={['react-tabs', classes.reactTabs].join(' ')}>
                    <TabList>
                        {element.tag !== 'menu' ? (
                            <Tab
                                className={[
                                    'react-tabs__tab',
                                    classes.reactTabsTab,
                                ].join(' ')}
                            >
                                Style
                            </Tab>
                        ) : null}
                        <Tab
                            className={[
                                'react-tabs__tab',
                                classes.reactTabsTab,
                            ].join(' ')}
                        >
                            Properties
                        </Tab>
                        {element.tag === 'menu' ? (
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
                    {element.tag !== 'menu' ? (
                        <TabPanel
                            selectedClassName={[
                                'react-tabs__tab-panel--selected',
                                classes.reactTabsTabPanelSelected,
                            ].join(' ')}
                        >
                            <Editor
                                currentElement={props.resourceDraft.currentBox}
                                elementValue={
                                    '{ ' + (element.style || '') + ' }'
                                }
                                elementCurrentCursor={element.cursorPosition}
                                editorMode="css"
                                handleChange={handleStyleChange}
                                name="editorStyle"
                            />
                        </TabPanel>
                    ) : null}
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classes.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        <Editor
                            currentElement={props.resourceDraft.currentBox}
                            elementValue={element.propertiesString}
                            elementCurrentCursor={element.cursorPosition}
                            editorMode="json"
                            handleChange={hanglePropertiesChange}
                            name="editorProperties"
                        />
                    </TabPanel>
                    {element.tag === 'menu' ? (
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
    ) : null
}

export default Properties
