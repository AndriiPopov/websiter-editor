import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import SortableTree from 'react-sortable-tree'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { cloneDeep } from 'lodash'

import * as actions from '../../../../store/actions/index'
import * as classes from '../../../ResourcesTree/ResourcesTree.module.css'
import * as classesAdvancedBar from '../../../../containers/AdvancedBar/AdvancedBar.module.css'
//import * as classes from './MenuItems.module.css'
// import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../../../utils/pagesStructure'
import withDragDropContext from '../../../../hoc/withDragDropContext'
// import OtherProperties from '../OtherProperties/OtherProperties'
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
                    url: 'http://www.logision.com/',
                },
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
        const treeDataSource = buildTree(pagesStructureWithAll).map(item => ({
            ...item,
            type: props.mode,
        }))
        setState({ ...state, treeDataSource })
    }, [props.pagesStructure])

    let menuItems = props.element.menuItems || []
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
            newItem.id = 'item_' + (props.element.currentMenuId || 0)
            newItem.sourceItem = false
            newCurrentMenuId = props.element.currentMenuId
                ? props.element.currentMenuId + 1
                : 1
        }

        const saveItems = []
        buildItems(newItems, [], saveItems)
        const result = { menuItems: saveItems }
        if (newCurrentMenuId) result.currentMenuId = newCurrentMenuId
        props.changeProperty(result, '')
    }

    const menuItem =
        props.element.currentMenuItem && props.element.menuItems
            ? props.element.menuItems.find(
                  item => item.id === props.element.currentMenuItem
              )
            : null
    const hanglePropertiesChange = (value, cursorPosition) => {
        if (value && props.element.currentMenuItem) {
            let obj
            try {
                obj = JSON.parse(value)
            } catch (e) {
                obj = null
            }
            const newMenuItems = props.element.menuItems.map(item => {
                if (item.id === props.element.currentMenuItem) {
                    const newItem = cloneDeep(item)
                    newItem.propertiesString = value
                    if (obj) {
                        newItem.properties = obj
                    }
                    return newItem
                } else {
                    return item
                }
            })
            props.changeProperty('menuItems', newMenuItems, cursorPosition)
        }
    }

    const handleDeleteItem = () => {
        if (props.element.currentMenuItem) {
            const newMenuItems = props.element.menuItems.filter(
                item => item.id !== props.element.currentMenuItem
            )
            props.changeProperty('menuItems', newMenuItems)
        }
    }

    return props.element ? (
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
                    />
                </div>
                <div className={classes.TreeContainer}>
                    <SortableTree
                        onChange={handleChange}
                        treeData={treeData}
                        nodeContentRenderer={ItemRenderer}
                        generateNodeProps={({ node }) => ({
                            className:
                                node.id === props.element.currentMenuItem
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
                        dndType={'menuItems'}
                    />
                </div>
                <SizeDragController
                    addClass={classesAdvancedBar.widthControll}
                    startValue={props.barSizes.width3 || 50}
                    changed={value =>
                        props.changeBarSize(props.barSizes, {
                            key: 'width3',
                            value,
                        })
                    }
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
                            dndType={'menuItems'}
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
                                currentElement={props.element.currentMenuItem}
                                elementValue={menuItem.propertiesString}
                                elementCurrentCursor={
                                    props.element.cursorPosition
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
        pagesStructure: state.pagesStructure,
        barSizes: state.barSizes,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
        changeMenuItemProperty: (key, value) =>
            dispatch(actions.changeMenuItemProperty(key, value)),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(MenuItems)
)
