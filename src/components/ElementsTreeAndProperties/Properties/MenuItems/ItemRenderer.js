import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from '../../../ResourcesTree/ResourcesTree.module.css'
import InspectorValue from '../../../UI/InspectorValue/InspectorValue'
import {
    _extends,
    _objectWithoutProperties,
    isDescendant,
    _toConsumableArray,
    _objectSpread,
    // $FlowFixMe
} from '../../../../utils/sortTreeMethods'

import type {
    menuItemType,
    initialStateType,
} from '../../../../store/reducer/reducer'

type Props = {
    chooseMenuItem: typeof actions.chooseMenuItem,
    changeMenuItemProperty: typeof actions.changeMenuItemProperty,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    connectDragPreview: Function,
    scaffoldBlockPxWidth: number,
    toggleChildrenVisibility: Function,
    connectDragPreview: Function,
    connectDragSource: Function,
    isDragging: boolean,
    canDrop: boolean,
    canDrag: boolean,
    node: menuItemType & { children: Array<menuItemType>, expanded: boolean },
    draggedNode: {},
    path: Array<string>,
    treeIndex: number,
    isSearchMatch: boolean,
    isSearchFocus: boolean,
    className: string,
    style: string,
    didDrop: boolean,
    currentPage: $PropertyType<initialStateType, 'currentPage'>,
    currentPlugin: $PropertyType<initialStateType, 'currentPlugin'>,
}

const ItemRenderer = (props: Props) => {
    var _this$props = props,
        scaffoldBlockPxWidth = _this$props.scaffoldBlockPxWidth,
        toggleChildrenVisibility = _this$props.toggleChildrenVisibility,
        connectDragPreview = _this$props.connectDragPreview,
        connectDragSource = _this$props.connectDragSource,
        isDragging = _this$props.isDragging,
        canDrop = _this$props.canDrop,
        canDrag = _this$props.canDrag,
        node = _this$props.node,
        draggedNode = _this$props.draggedNode,
        path = _this$props.path,
        treeIndex = _this$props.treeIndex,
        isSearchMatch = _this$props.isSearchMatch,
        isSearchFocus = _this$props.isSearchFocus,
        className = _this$props.className,
        style = _this$props.style,
        didDrop = _this$props.didDrop,
        otherProps = _objectWithoutProperties(_this$props, [
            'scaffoldBlockPxWidth',
            'toggleChildrenVisibility',
            'connectDragPreview',
            'connectDragSource',
            'isDragging',
            'canDrop',
            'canDrag',
            'node',
            'title',
            'subtitle',
            'draggedNode',
            'path',
            'treeIndex',
            'isSearchMatch',
            'isSearchFocus',
            'buttons',
            'className',
            'style',
            'didDrop',
            'treeId',
            'isOver',
            'parentNode',
            'currentPage',
            'currentPlugin',
            'resourcesObjects',
            'chooseMenuItem',
            'changeMenuItemProperty',
            'isSub',
        ])

    var handle

    if (canDrag) {
        if (typeof node.children === 'function' && node.expanded) {
            handle = (
                <div className={classes.rst__loadingHandle}>
                    <div className={classes.rst__loadingCircle}>
                        {_toConsumableArray(new Array(12)).map(function(
                            _,
                            index
                        ) {
                            return (
                                <div
                                    key={index}
                                    className={classes.rst__loadingCirclePoint}
                                />
                            )
                        })}
                        )}
                    </div>
                </div>
            )
        } else {
            handle = connectDragSource(
                <div className={classes.rst__moveHandle} />
            )
        }
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { name, id, sourceItem, type } = props.node
    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)
    return (
        <div
            // $FlowFixMe
            {..._extends({ style: { height: '100%' } }, otherProps)}
            onMouseDown={() =>
                props.chooseMenuItem(
                    id,
                    type === 'page' ? props.currentPage : props.currentPlugin,
                    props.resourcesObjects
                )
            }
        >
            {toggleChildrenVisibility &&
                node.children &&
                (node.children.length > 0 ||
                    typeof node.children === 'function') && (
                    <div>
                        <button
                            type="button"
                            aria-label={node.expanded ? 'Collapse' : 'Expand'}
                            className={
                                node.expanded
                                    ? classes.rst__collapseButton
                                    : classes.rst__expandButton
                            }
                            style={buttonStyle}
                            onClick={function onClick() {
                                return toggleChildrenVisibility({
                                    node: node,
                                    path: path,
                                    treeIndex: treeIndex,
                                })
                            }}
                        />
                        {node.expanded && !isDragging && (
                            <div
                                style={{ width: scaffoldBlockPxWidth }}
                                className={classes.rst__lineChildren}
                            />
                        )}
                    </div>
                )}
            <div className={classes.rst__rowWrapper}>
                {connectDragPreview(
                    <div
                        className={rowClasses.join(' ')}
                        style={_objectSpread(
                            {
                                opacity: isDraggedDescendant ? 0.5 : 1,
                            },
                            style
                        )}
                    >
                        {handle}
                        <div
                            className={
                                canDrag
                                    ? classes.rst__rowContents
                                    : [
                                          classes.rst__rowContents,
                                          classes.rst__rowContentsDragDisabled,
                                      ].join(' ')
                            }
                        >
                            <div className={classes.rst__rowLabel}>
                                {sourceItem ? (
                                    name
                                ) : (
                                    <InspectorValue
                                        value={name}
                                        blur={value =>
                                            props.changeMenuItemProperty(
                                                'name',
                                                value,
                                                type === 'page'
                                                    ? props.currentPage
                                                    : props.currentPlugin,
                                                props.resourcesObjects
                                            )
                                        }
                                        withState
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        currentPage: state.currentPage,
        currentPlugin: state.currentPlugin,
        resourcesObjects: state.resourcesObjects,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        chooseMenuItem: (id, currentPage, resourcesObjects) =>
            dispatch(actions.chooseMenuItem(id, currentPage, resourcesObjects)),
        changeMenuItemProperty: (key, value, currentPage, resourcesObjects) =>
            dispatch(
                actions.changeMenuItemProperty(
                    key,
                    value,
                    currentPage,
                    resourcesObjects
                )
            ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
