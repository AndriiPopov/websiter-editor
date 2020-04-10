import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as actions from '../../../../store/actions/index'

import * as classes from '../../../ResourcesTree/ResourcesTree.module.css'
import * as classesFileTree from './FileItem.module.css'
import * as classesAdvancedBar from '../../../../containers/AdvancedBar/AdvancedBar.module.css'
import ItemRenderer from './ItemRenderer'
import { buildTree } from '../../../../utils/basic'
import SizeDragController from '../../../../containers/AdvancedBar/SizeDragController/SizeDragController'
import OverlayOnSizeIsChanging from '../../../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
import checkUserRights from '../../../../utils/checkUserRights'
import bytes from 'bytes'
import TimeAgo from 'react-timeago'
import Checkbox from '../../../UI/Checkbox/Checkbox'
import { getFileUrl } from '../../../../utils/getFileUrl'

const FileItems = props => {
    const [state, setState] = useState({
        treeDataSource: [],
    })

    useEffect(() => {
        const treeDataSource = buildTree(props.filesStructure).map(item => ({
            ...item,
            // type: props.mode,
        }))
        setState({ ...state, treeDataSource })
    }, [props.filesStructure])

    const setActiveAndKeyDown = e => {
        if (e === 'blur') {
            props.unsetActiveContainer('filesitems')
        } else {
            props.setActiveContainer('filesitems')
        }
    }

    const currentFileItem = props.filesStructure.find(
        item => item.id === props.elementValues.currentFileId
    )

    const chosenFileItem = props.filesStructure.find(item => {
        return (
            getFileUrl(props.filesStructure, item.id, true) ===
            props.elementValues[props.attrName]
        )
    })

    const fileDetailesTable = file => (
        <table>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>{file.name}</td>
                </tr>
                <tr>
                    <td>Size</td>
                    <td>
                        {bytes(file.size, {
                            decimalPlaces: 1,
                        })}
                    </td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>{file.type}</td>
                </tr>
                <tr>
                    <td>Date created</td>
                    <td>
                        <TimeAgo date={file.createdDate} />
                    </td>
                </tr>
                <tr>
                    <td>Date modified</td>
                    <td>
                        <TimeAgo date={file.modifiedDate} />
                    </td>
                </tr>
            </tbody>
        </table>
    )

    return props.element && props.elementValues ? (
        <div className={classesAdvancedBar.Content}>
            <div
                className={classesAdvancedBar.Container}
                style={{
                    flex: '0 0 ' + (props.barSizes.width3 || 50) + 'px',
                }}
                tabIndex="0"
                onKeyDown={e => {
                    setActiveAndKeyDown(e.nativeEvent)
                }}
                onMouseDown={() => {
                    setActiveAndKeyDown()
                }}
                onTouchStart={() => {
                    setActiveAndKeyDown()
                }}
                onFocus={() => {
                    setActiveAndKeyDown()
                }}
                onBlur={() => {
                    setActiveAndKeyDown('blur')
                }}
            >
                <div className={classes.TreeContainer}>
                    <SortableTree
                        className={classesFileTree.FilesTree}
                        treeData={state.treeDataSource}
                        nodeContentRenderer={ItemRenderer}
                        isVirtualized={true}
                        generateNodeProps={({ node }) => ({
                            type: props.type,
                            className:
                                chosenFileItem && node.id === chosenFileItem.id
                                    ? [classes.ChosenGreen]
                                    : node.id ===
                                      props.elementValues.currentFileId
                                    ? props.isFocused
                                        ? [classes.Chosen]
                                        : [classes.ChosenBlur]
                                    : null,
                            changeProperty: props.changeProperty,
                            elementId: props.element.id,
                            fileUrl: props.elementValues[props.attrName],
                            attrName: props.attrName,
                        })}
                        rowHeight={60}
                        scaffoldBlockPxWidth={22}
                        canDrop={() => false}
                        canDrag={() => false}
                        shouldCopyOnOutsideDrop={true}
                        dndType={props.attrName}
                        style={{
                            flex: '1 1',
                            height: 'auto !important',
                            overflow: 'auto',
                        }}
                        onChange={items =>
                            setState({ ...state, treeDataSource: items })
                        }
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
                            Highlighted file
                        </Tab>
                        <Tab
                            className={[
                                'react-tabs__tab',
                                classesAdvancedBar.reactTabsTab,
                            ].join(' ')}
                        >
                            Chosen file
                        </Tab>
                    </TabList>
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classesAdvancedBar.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        {currentFileItem ? (
                            <div style={{ flex: 1 }}>
                                {currentFileItem.type.indexOf('image') >= 0 ? (
                                    <>
                                        <Checkbox
                                            checked={
                                                props.elementValues[
                                                    props.attrName
                                                ] ===
                                                    getFileUrl(
                                                        props.filesStructure,
                                                        currentFileItem.id,
                                                        true
                                                    ) &&
                                                !props.elementValues[
                                                    props.attrThumb
                                                ]
                                            }
                                            onChange={value => {
                                                props.changeProperty({
                                                    [props.attrName]: getFileUrl(
                                                        props.filesStructure,
                                                        currentFileItem.id,
                                                        true
                                                    ),
                                                    [props.attrThumb]: false,
                                                })
                                            }}
                                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#666" d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"></path></svg>'
                                            title="Select original size"
                                        />
                                        <Checkbox
                                            checked={
                                                props.elementValues[
                                                    props.attrName
                                                ] ===
                                                    getFileUrl(
                                                        props.filesStructure,
                                                        currentFileItem.id,
                                                        true
                                                    ) &&
                                                props.elementValues[
                                                    props.attrThumb
                                                ]
                                            }
                                            onChange={value => {
                                                props.changeProperty({
                                                    [props.attrName]: getFileUrl(
                                                        props.filesStructure,
                                                        currentFileItem.id,
                                                        true
                                                    ),
                                                    [props.attrThumb]: true,
                                                })
                                            }}
                                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#666" d="M23 15h-2v2h2v-2zm0-4h-2v2h2v-2zm0 8h-2v2c1 0 2-1 2-2zM15 3h-2v2h2V3zm8 4h-2v2h2V7zm-2-4v2h2c0-1-1-2-2-2zM3 21h8v-6H1v4c0 1.1.9 2 2 2zM3 7H1v2h2V7zm12 12h-2v2h2v-2zm4-16h-2v2h2V3zm0 16h-2v2h2v-2zM3 3C2 3 1 4 1 5h2V3zm0 8H1v2h2v-2zm8-8H9v2h2V3zM7 3H5v2h2V3z"></path></svg>'
                                            title="Select thumbnail size"
                                        />

                                        <img
                                            src={getFileUrl(
                                                props.filesStructure,
                                                props.elementValues
                                                    .currentFileId,
                                                false,
                                                true,
                                                props.currentWebsiteObject
                                                    .domain
                                            )}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                verticalAlign: 'middle',
                                            }}
                                            alt="websiter"
                                        />
                                    </>
                                ) : (
                                    <Checkbox
                                        style={{}}
                                        checked={
                                            props.elementValues[
                                                props.attrName
                                            ] ===
                                                getFileUrl(
                                                    props.filesStructure,
                                                    currentFileItem.id,
                                                    true
                                                ) && !props.thumbnail
                                        }
                                        onChange={value => {
                                            props.changeProperty({
                                                [props.attrName]: getFileUrl(
                                                    props.filesStructure,
                                                    currentFileItem.id,
                                                    true
                                                ),
                                                [props.attrThumb]: false,
                                            })
                                        }}
                                        title="Select file"
                                    />
                                )}
                                {fileDetailesTable(currentFileItem)}
                            </div>
                        ) : null}
                        <OverlayOnSizeIsChanging />
                    </TabPanel>
                    <TabPanel
                        selectedClassName={[
                            'react-tabs__tab-panel--selected',
                            classesAdvancedBar.reactTabsTabPanelSelected,
                        ].join(' ')}
                    >
                        {props.elementValues[props.attrName] ? (
                            <>
                                <div style={{ flex: 1 }}>
                                    <img
                                        src={
                                            'http://live.websiter.dev:5000/' +
                                            props.currentWebsiteObject.domain +
                                            props.elementValues[props.attrName]
                                        }
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            verticalAlign: 'middle',
                                        }}
                                        alt="websiter"
                                    />
                                    {chosenFileItem
                                        ? fileDetailesTable(chosenFileItem)
                                        : null}
                                </div>
                            </>
                        ) : null}
                        <OverlayOnSizeIsChanging />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    ) : null
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        filesStructure: state.mD.filesStructure,
        currentWebsiteObject: state.mD.currentWebsiteObject,
        isFocused: state.activeContainer === 'filesitems',
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
        setActiveContainer: container =>
            dispatch(actions.setActiveContainer(container)),
        unsetActiveContainer: container =>
            dispatch(actions.unsetActiveContainer(container)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileItems)
