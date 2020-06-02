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
} from '../../../../utils/sortTreeMethods'
import Svg from '../../../Svg/Svg'

// import type {
//     menuItemType,
//     initialStateType,
// } from '../../../../store/reducer/reducer'

// type Props = {
//     chooseMenuItem: typeof actions.chooseMenuItem,
//     changeMenuItemProperty: typeof actions.changeMenuItemProperty,
//     resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
//     connectDragPreview: Function,
//     scaffoldBlockPxWidth: number,
//     toggleChildrenVisibility: Function,
//     connectDragPreview: Function,
//     connectDragSource: Function,
//     isDragging: boolean,
//     canDrop: boolean,
//     canDrag: boolean,
//     node: menuItemType & { children: Array<menuItemType>, expanded: boolean },
//     draggedNode: {},
//     path: Array<string>,
//     treeIndex: number,
//     isSearchMatch: boolean,
//     isSearchFocus: boolean,
//     className: string,
//     style: string,
//     didDrop: boolean,
//     currentPage: $PropertyType<initialStateType, 'currentPage'>,
//     currentPlugin: $PropertyType<initialStateType, 'currentPlugin'>,
//     currentTemplate: $PropertyType<initialStateType, 'currentTemplate'>,
// }

const ItemRenderer = props => {
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
            'name',
            'id',
            'sourceItem',
            'type',
            'generatedFrom',
            'rowDirection',
            'currentTemplate',
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
                    </div>
                </div>
            )
        } else {
            handle = connectDragSource(
                <div className={classes.rst__moveHandle}>
                    <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>' />
                </div>
            )
        }
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { name, id, sourceItem, type, generatedFrom } = props.node
    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)
    return (
        <div
            {..._extends({ style: { height: '100%' } }, otherProps)}
            onMouseDown={() => props.changeBoxPropertyInValues(type, id)}
        >
            {toggleChildrenVisibility &&
                node.children &&
                (node.children.length > 0 ||
                    typeof node.children === 'function') && (
                    <div onMouseDown={e => e.stopPropagation()}>
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
                                                type,
                                                'name',
                                                value,
                                                id
                                            )
                                        }
                                        withState
                                        maxLength="30"
                                        maxWidth="220px"
                                    />
                                )}
                            </div>
                            <div
                                className={[
                                    classes.IconsContainer,
                                    props.type === 'page'
                                        ? classes.IconsContainerPage
                                        : classes.IconsContainerNotPage,
                                ].join(' ')}
                            >
                                <div>
                                    {generatedFrom === 'link' ? (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></svg>' />
                                    ) : generatedFrom === 'variable' ? (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"></path></svg>' />
                                    ) : (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>' />
                                    )}
                                </div>
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
        userId: state.userId,
        resourcesObjects: state.resourcesObjects,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        changeBoxPropertyInValues: (type, id) =>
            dispatch(
                actions.changeBoxPropertyInValues(
                    type,
                    'currentMenuItem',
                    id,
                    true
                )
            ),
        changeMenuItemProperty: (type, key, value, itemId) =>
            dispatch(actions.changeMenuItemProperty(type, key, value, itemId)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
