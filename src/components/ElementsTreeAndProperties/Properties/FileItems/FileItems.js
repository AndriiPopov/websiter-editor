import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import Tabs from 'antd/es/tabs'
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
import { getFileUrl } from '../../../../utils/getFileUrl'
import Checkbox from 'antd/es/checkbox'
import Divider from 'antd/es/divider'

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
                <Tabs defaultActiveKey="high" animated={false} size="small">
                    <Tabs.TabPane tab="Highlighted file" key="high">
                        {currentFileItem && (
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
                                        >
                                            Select original size
                                        </Checkbox>
                                        <div />
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
                                        >
                                            Select thumbnail size
                                        </Checkbox>
                                        <Divider />

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
                                    >
                                        Select file
                                    </Checkbox>
                                )}
                                {fileDetailesTable(currentFileItem)}
                            </div>
                        )}
                        <OverlayOnSizeIsChanging />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Chosen file" key="chosen">
                        {props.elementValues[props.attrName] && (
                            <>
                                <div style={{ flex: 1 }}>
                                    <img
                                        src={
                                            getFileUrl(
                                                props.filesStructure,
                                                props.elementValues[
                                                    props.attrName
                                                ],
                                                false,
                                                true,
                                                props.currentWebsiteObject
                                                    .domain
                                            )
                                            // 'http://live.websiter.dev:5000/' +
                                            // props.currentWebsiteObject.domain +
                                            // props.elementValues[props.attrName]
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
                        )}
                        <OverlayOnSizeIsChanging />
                    </Tabs.TabPane>
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
