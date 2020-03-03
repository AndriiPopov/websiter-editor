import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// $FlowFixMe
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'

import * as classes from '../Properties/Properties.module.css'
import MenuItems from '../Properties/MenuItems/MenuItems'
import Editor from '../../Editor/Editor'
import HTMLEditor from '../../HTMLEditor/HTMLEditor'
import { resourceDraftIndex } from '../../../utils/resourceTypeIndex'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    changeProperty: (key: string | {}, value: string) => ?{},
    mode: 'page' | 'plugin' | 'template',
    currentResource:
        | $PropertyType<initialStateType, 'currentPlugin'>
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentTemplate'>,
}

const Properties = (props: Props) => {
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
                ) : (
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
                ) : (
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
                templateCMSElementValues =
                    state.mD.pageTemplateDraft.values[element.id]
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
