import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions/index'
//import * as classes from './ElementsTree.module.css'
import * as classes from '../../ResourcesTree/ResourcesTree.module.css'
import InspectorValue from '../../UI/InspectorValue/InspectorValue'
import {
    _extends,
    _objectWithoutProperties,
    isDescendant,
    _toConsumableArray,
    _objectSpread,
} from '../../../utils/sortTreeMethods'

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
        rowDirection = _this$props.rowDirection,
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
            'rowDirection',
            'chooseBox',
            'hoverBox',
            'unhoverBox',
            'changeBoxProperty',
            'resourceDraft',
            'currentResource',
            'pluginsStructure',
            'properties',
            'mode',
            'itemPath',
        ])

    const tagItems = ['div', 'image', 'span', 'nav', 'ul', 'li'].map(item => {
        return { abbr: item, name: item }
    })

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
                <div className={classes.rst__moveHandle} />,
                { dropEffect: 'copy' }
            )
        }
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    if (rowDirection === 'rtl') {
        buttonStyle = {
            right: -0.5 * scaffoldBlockPxWidth,
        }
    }

    const {
        tag,
        id,
        text,
        resourceDraft,
        currentResource,
        pluginsStructure,
        properties,
        mode,
        itemPath,
    } = props.node

    console.log(path)

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)

    const handleRename = value => {
        if (value !== tag) {
            if (mode === 'plugin') {
                const currentPlugin = pluginsStructure.find(
                    item => item.id === currentResource
                )
                if (!currentPlugin) return
                if (value === currentPlugin.name) {
                    alert('Plugin can not be inside itself.')
                    return
                }
            }
            props.changeBoxProperty(
                'tag',
                value,
                currentResource,
                resourceDraft
            )
        }
    }
    return (
        <div
            {..._extends({ style: { height: '100%' } }, otherProps)}
            onMouseDown={() =>
                props.chooseBox(id, currentResource, resourceDraft)
            }
            onMouseEnter={() => props.hoverBox(id, mode)}
            onMouseMove={() => props.hoverBox(id, mode)}
            onMouseLeave={() => props.unhoverBox()}
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
                                {text ? (
                                    'text'
                                ) : (
                                    <>
                                        {'<'}
                                        {(mode === 'plugin' &&
                                            itemPath.length > 0) ||
                                        (mode === 'page' &&
                                            itemPath.length > 1) ? (
                                            <InspectorValue
                                                value={tag}
                                                items={tagItems}
                                                blur={handleRename}
                                                withState
                                            />
                                        ) : (
                                            tag
                                        )}
                                        {properties.id
                                            ? ` id="${properties.id}"`
                                            : ''}
                                        {properties.class
                                            ? ` class="${properties.class}"`
                                            : ''}
                                        {' >'}
                                    </>
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
    return {}
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        chooseBox: (id, currentResource, resourceDraft) =>
            dispatch(actions.chooseBox(id, currentResource, resourceDraft)),
        changeBoxProperty: (key, value, currentResource, resourceDraft) =>
            dispatch(
                actions.changeBoxProperty(
                    key,
                    value,
                    currentResource,
                    resourceDraft
                )
            ),
        hoverBox: (id, mode) => dispatch(actions.hoverBox(id, mode)),
        unhoverBox: () => dispatch(actions.unhoverBox()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
