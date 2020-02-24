import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import SortableTree from 'react-sortable-tree'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import cloneDeep from 'lodash/cloneDeep'

import * as classes from '../../../ResourcesTree/ResourcesTree.module.css'
import * as classesAdvancedBar from '../../../../containers/AdvancedBar/AdvancedBar.module.css'
import { buildItems } from '../../../../utils/pagesStructure'
// import withDragDropContext from '../../../../hoc/withDragDropContext'
import ItemRenderer from './ItemRenderer'
import { buildTree } from '../../../../utils/basic'
import { SizeDragController } from '../../../../containers/AdvancedBar/SizeDragController/SizeDragController'
import Editor from '../../../Editor/Editor'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'

const MenuItems = props => {
    const [state, setState] = useState({
        treeDataSource: [],
    })

    useEffect(() => {
        const pagesStructureWithAll = [
            {
                path: [],
                all: false,
                id: 'link',
                generatedFrom: 'link',
                sourceItem: true,
                name: 'Link',
                properties: {
                    // url: 'http://www.logision.com/',
                },
                propertiesString: '',
            },
            {
                path: [],
                all: true,
                id: 'all',
                generatedFrom: 'all',
                sourceItem: true,
                name: 'All pages',
            },
        ]
        if (props.mode !== 'page' && !props.element.isCMSVariable) {
            pagesStructureWithAll.push({
                path: [],
                all: false,
                id: 'variable',
                generatedFrom: 'variable',
                sourceItem: true,
                name: 'Variable',
                properties: {},
            })
        }
        props.pagesStructure.forEach(element => {
            pagesStructureWithAll.push({
                ...element,
                sourceItem: true,
                all: false,
                id: element.id,
                generatedFrom: element.id,
                path: ['all', ...element.path],
            })
            pagesStructureWithAll.push({
                path: ['all', ...element.path, element.id],
                all: true,
                id: element.id + '_all',
                generatedFrom: element.id,
                sourceItem: true,
                name: 'All in ' + element.name,
            })
        })
        // props.pagesStructure.forEach(element => {
        //     pagesStructureWithAll.push({
        //         ...element,
        //         sourceItem: true,
        //         all: false,
        //         id: element.id,
        //         generatedFrom: element.id,
        //         path: ['all', ...element.path],
        //     })
        //     pagesStructureWithAll.push({
        //         path: ['all', ...element.path, element.id],
        //         all: true,
        //         id: element.id + '_all',
        //         generatedFrom: element.id,
        //         sourceItem: true,
        //         name: 'All in ' + element.name,
        //     })
        // })
        const treeDataSource = buildTree(pagesStructureWithAll).map(item => ({
            ...item,
            type: props.mode,
        }))
        setState({ ...state, treeDataSource })
    }, [props.pagesStructure, props.templatesStructure])

    let menuItems = props.elementValues[props.attrName] || []

    menuItems = menuItems.map(item => ({
        ...item,
        type: props.mode,
    }))
    const treeData = buildTree(menuItems)

    const handleChange = items => {
        const newItems = cloneDeep(items)
        const findNewItem = children => {
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                if (child.sourceItem) return child
                else if (child.children.length > 0)
                    return findNewItem(child.children)
            }
        }
        const newItem = findNewItem(newItems)

        let newCurrentMenuId = null
        if (newItem) {
            newItem.children = []
            newItem.id = 'item_' + (props.elementValues.currentMenuId || 0)
            newItem.sourceItem = false
            newCurrentMenuId = props.elementValues.currentMenuId
                ? props.elementValues.currentMenuId + 1
                : 1
        }

        const saveItems = []
        buildItems(newItems, [], saveItems)
        const result = { [props.attrName]: saveItems, currentMenuId: -1 }
        if (newCurrentMenuId) result.currentMenuId = newCurrentMenuId
        props.changeProperty(result, '')
    }

    const menuItem =
        props.elementValues.currentMenuItem &&
        props.elementValues[props.attrName]
            ? props.elementValues[props.attrName].find(
                  item => item.id === props.elementValues.currentMenuItem
              )
            : null
    const hanglePropertiesChange = (value, cursorPosition) => {
        if (value && props.elementValues.currentMenuItem) {
            let obj
            try {
                obj = JSON.parse(value)
            } catch (e) {
                obj = null
            }
            const newMenuItems = props.elementValues[props.attrName].map(
                item => {
                    if (item.id === props.elementValues.currentMenuItem) {
                        const newItem = cloneDeep(item)
                        newItem.propertiesString = value
                        if (obj) {
                            newItem.properties = obj
                        }
                        return newItem
                    } else {
                        return item
                    }
                }
            )
            props.changeProperty(props.attrName, newMenuItems, cursorPosition)
        }
    }

    const handleDeleteItem = () => {
        if (props.elementValues.currentMenuItem) {
            const newMenuItems = props.elementValues[props.attrName].filter(
                item => item.id !== props.elementValues.currentMenuItem
            )
            props.changeProperty(props.attrName, newMenuItems)
        }
    }

    return props.element && props.elementValues ? (
        <div className={classesAdvancedBar.Content}>
            <div
                className={classesAdvancedBar.Container}
                style={{
                    flex: '0 0 ' + (props.barSizes.width3 || 50) + 'px',
                }}
            >
                <div>
                    <SmallButton
                        inline
                        buttonClicked={handleDeleteItem}
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                        tooltip="Delete menu item"
                        requiredRights={
                            props.mode === 'page' ? ['content'] : ['developer']
                        }
                    />
                </div>
                <div className={classes.TreeContainer}>
                    {treeData.length === 0 ? (
                        <div
                            style={{
                                position: 'absolute',
                                border: '1px dashed #777',
                                left: '20px',
                                padding: '4px',
                            }}
                        >
                            Drop menu items here
                        </div>
                    ) : null}
                    <SortableTree
                        onChange={handleChange}
                        treeData={treeData}
                        nodeContentRenderer={ItemRenderer}
                        generateNodeProps={({ node }) => ({
                            className:
                                node.id === props.elementValues.currentMenuItem
                                    ? [classes.Chosen]
                                    : null,
                        })}
                        isVirtualized={true}
                        onMoveNode={({ node, treeIndex, path }) => {
                            global.console.debug(
                                'node:',
                                node,
                                'treeIndex:',
                                treeIndex,
                                'path:',
                                path
                            )
                        }}
                        rowHeight={20}
                        scaffoldBlockPxWidth={22}
                        className={classes.Tree}
                        dndType={props.attrName}
                        canDrop={({ nextParent }) => {
                            if (!nextParent) return true

                            return (
                                nextParent.generatedFrom !== 'variable' &&
                                !nextParent.all
                            )
                        }}
                    />
                </div>
                <SizeDragController
                    addClass={classesAdvancedBar.widthControll}
                    startValue={props.barSizes.width3 || 50}
                    type="width3"
                />
            </div>
            <div className={classesAdvancedBar.LastContainer}>
                <Tabs
                    className={[
                        'react-tabs',
                        classesAdvancedBar.reactTabs,
                        classes.MenuItemsTabs,
                    ].join(' ')}
                >
                    <TabList>
                        <Tab
                            className={[
                                'react-tabs__tab',
                                classesAdvancedBar.reactTabsTab,
                            ].join(' ')}
                        >
                            Source elements
                        </Tab>
                        {menuItem ? (
                            <Tab
                                className={[
                                    'react-tabs__tab',
                                    classesAdvancedBar.reactTabsTab,
                                ].join(' ')}
                            >
                                Item properties
                            </Tab>
                        ) : null}
                    </TabList>
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classesAdvancedBar.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        <SortableTree
                            treeData={state.treeDataSource}
                            nodeContentRenderer={ItemRenderer}
                            isVirtualized={true}
                            onMoveNode={({ node, treeIndex, path }) =>
                                global.console.debug(
                                    'node:',
                                    node,
                                    'treeIndex:',
                                    treeIndex,
                                    'path:',
                                    path
                                )
                            }
                            rowHeight={20}
                            scaffoldBlockPxWidth={22}
                            canDrop={() => false}
                            shouldCopyOnOutsideDrop={true}
                            dndType={props.attrName}
                            onChange={treeData =>
                                setState({ ...state, treeDataSource: treeData })
                            }
                        />
                    </TabPanel>
                    {menuItem ? (
                        <TabPanel
                            selectedClassName={[
                                'react-tabs__tab-panel--selected',
                                classesAdvancedBar.reactTabsTabPanelSelected,
                            ].join(' ')}
                        >
                            <Editor
                                currentElement={
                                    props.elementValues.currentMenuItem
                                }
                                elementValue={menuItem.propertiesString}
                                elementCurrentCursor={
                                    props.elementValues.cursorPosition
                                }
                                editorMode="json"
                                handleChange={hanglePropertiesChange}
                                name="editorMenuItems"
                            />
                        </TabPanel>
                    ) : null}
                </Tabs>
            </div>
        </div>
    ) : null
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        pagesStructure: state.mD.pagesStructure,
        templatesStructure: state.mD.templatesStructure,
    }
}

export default connect(mapStateToProps)(MenuItems)
