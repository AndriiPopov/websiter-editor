import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import SortableTree from 'react-sortable-tree'
import Tabs from 'antd/es/tabs'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'

import cloneDeep from 'lodash/cloneDeep'

import * as classes from '../../../ResourcesTree/ResourcesTree.module.css'
import * as classesAdvancedBar from '../../../../containers/AdvancedBar/AdvancedBar.module.css'
import { buildItems } from '../../../../utils/pagesStructure'
// import withDragDropContext from '../../../../hoc/withDragDropContext'
import ItemRenderer from './ItemRenderer'
import { buildTree } from '../../../../utils/basic'
import SizeDragController from '../../../../containers/AdvancedBar/SizeDragController/SizeDragController'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import TextInput from '../../../UI/TextInput/TextInput'
import OverlayOnSizeIsChanging from '../../../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
import ControlPanel from '../../../UI/ControlPanel'
import Switch from 'antd/es/switch'

const MenuItems = props => {
    const [state, setState] = useState({
        treeDataSource: [],
    })
    console.log(props.element)

    useEffect(() => {
        const pagesStructureWithAll = [
            {
                path: [],
                all: false,
                id: 'link',
                generatedFrom: 'link',
                sourceItem: true,
                name: 'Link',
                properties: {},
                propertiesString: '',
            },
            {
                path: [],
                all: true,
                id: 'all',
                generatedFrom: 'all',
                sourceItem: true,
                name: 'All pages',
                properties: {},
                propertiesString: '',
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
                propertiesString: '',
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
                properties: {},
                propertiesString: '',
            })
            pagesStructureWithAll.push({
                path: ['all', ...element.path, element.id],
                all: true,
                id: element.id + '_all',
                generatedFrom: element.id,
                sourceItem: true,
                name: 'All in ' + element.name,
                properties: {},
                propertiesString: '',
            })
        })

        const treeDataSource = buildTree(pagesStructureWithAll)
            .filter(item => !item.generalSettings)
            .map(item => ({
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
                else if (child.children.length > 0) {
                    const newItem = findNewItem(child.children)
                    if (newItem) return newItem
                }
            }
        }
        const newItem = findNewItem(newItems)

        let newCurrentMenuId = props.elementValues.currentMenuId || 0
        if (newItem) {
            newItem.children = []
            newItem.id = 'item_' + (newCurrentMenuId || 0)
            newItem.sourceItem = false
            newCurrentMenuId = newCurrentMenuId + 1
        }

        const saveItems = []
        buildItems(newItems, [], saveItems)
        const result = {
            [props.attrName]: saveItems,
            currentMenuId: newCurrentMenuId,
        }
        // if (newCurrentMenuId) result.currentMenuId = newCurrentMenuId
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

    const handleOnePropertyChange = (key, value, id) => {
        if (key) {
            const newMenuItems = props.elementValues[props.attrName].map(
                item => {
                    if (item.id === id) {
                        const newItem = cloneDeep(item)
                        // newItem.propertiesString = value
                        // if (obj) {
                        newItem.properties[key] = value
                        // }
                        return newItem
                    } else {
                        return item
                    }
                }
            )
            props.changeProperty(props.attrName, newMenuItems)
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
                <ControlPanel>
                    <SmallButton
                        title="Delete"
                        buttonClicked={handleDeleteItem}
                        icon={<DeleteOutlined />}
                        tooltip="Delete menu item"
                        requiredRights={
                            props.mode === 'page' ? ['content'] : ['developer']
                        }
                    />
                </ControlPanel>
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
                        style={{
                            flex: '1 1',
                            height: 'auto !important',
                            overflow: 'auto',
                        }}
                        slideRegionSize={20}
                    />
                    <OverlayOnSizeIsChanging />
                </div>
                <SizeDragController
                    addClass={classesAdvancedBar.widthControll}
                    startValue={props.barSizes.width3 || 50}
                    type={'width3'}
                />
            </div>
            <div className={classesAdvancedBar.LastContainer}>
                <Tabs defaultActiveKey="source" animated={false} size="small">
                    <Tabs.TabPane tab="Source elements" key="source">
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
                            style={{
                                flex: '1 1',
                                height: 'auto !important',
                                overflow: 'auto',
                            }}
                            slideRegionSize={20}
                        />
                        <OverlayOnSizeIsChanging />
                    </Tabs.TabPane>

                    {menuItem && (
                        <Tabs.TabPane tab="Item properties" key="props">
                            {/* {menuItem.type !== 'page' ? (
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
                            ) : menuItem.generatedFrom === 'link' ? ( */}
                            <table>
                                <tbody>
                                    {menuItem.generatedFrom === 'link' ? (
                                        <tr>
                                            <td>Url</td>
                                            <td>
                                                <TextInput
                                                    changed={value =>
                                                        handleOnePropertyChange(
                                                            'url',
                                                            value,
                                                            props.elementValues
                                                                .currentMenuItem
                                                        )
                                                    }
                                                    value={
                                                        menuItem.properties.url
                                                    }
                                                    unControlled
                                                    uniqueId={
                                                        props.elementValues
                                                            .currentMenuItem +
                                                        props.element.id +
                                                        menuItem.type
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td>Open in a new tab</td>
                                        <td>
                                            <Switch
                                                onChange={value =>
                                                    handleOnePropertyChange(
                                                        'newTab',
                                                        value,
                                                        props.elementValues
                                                            .currentMenuItem
                                                    )
                                                }
                                                checked={
                                                    menuItem.properties.newTab
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Tabs.TabPane>
                    )}
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
