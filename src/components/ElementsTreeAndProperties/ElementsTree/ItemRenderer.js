import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions/index'
import * as classes from '../../ResourcesTree/ResourcesTree.module.css'
import InspectorValue from '../../UI/InspectorValue/InspectorValue'
import {
    _extends,
    isDescendant,
    _objectSpread,
    // $FlowFixMe
} from '../../../utils/sortTreeMethods'
import tagItems from '../../../utils/tagItems'
import checkUserRights from '../../../utils/checkUserRights'

import type {
    initialStateType,
    elementType,
    resourceType,
} from '../../../store/reducer/reducer'

import {
    current as currentIndex,
    resourceDraftIndex,
} from '../../../utils/resourceTypeIndex'

type Props = {
    changeBoxProperty: typeof actions.changeBoxProperty,
    chooseBox: typeof actions.chooseBox,
    hoverBox: typeof actions.hoverBox,
    unhoverBox: typeof actions.unhoverBox,
    connectDragPreview: Function,
    scaffoldBlockPxWidth: number,
    toggleChildrenVisibility: Function,
    connectDragPreview: Function,
    connectDragSource: Function,
    isDragging: boolean,
    canDrop: boolean,
    canDrag: boolean,
    node: elementType & {
        children: Array<elementType>,
        expanded: boolean,
        resourceDraft: resourceType,
        currentResource:
            | $PropertyType<initialStateType, 'currentPage'>
            | $PropertyType<initialStateType, 'currentPlugin'>,
        pluginsStructure: $PropertyType<initialStateType, 'pluginsStructure'>,
        mode: 'page' | 'plugin',
        itemPath: Array<{}>,
    },
    draggedNode: {},
    path: Array<string>,
    treeIndex: number,
    isSearchMatch: boolean,
    isSearchFocus: boolean,
    className: string,
    style: string,
    didDrop: boolean,
    type: 'page' | 'plugin' | 'template',
    tryWebsiter: $PropertyType<initialStateType, 'tryWebsiter'>,
    websites: $PropertyType<initialStateType, 'websites'>,
    loadedWebsite: $PropertyType<initialStateType, 'loadedWebsite'>,
    userId: $PropertyType<initialStateType, 'userId'>,
    mode: string,
}

const ItemRenderer = (props: Props) => {
    if (!props.currentNode) return null
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
        didDrop = _this$props.didDrop
    // otherProps = _objectWithoutProperties(_this$props, [
    //     'scaffoldBlockPxWidth',
    //     'toggleChildrenVisibility',
    //     'connectDragPreview',
    //     'connectDragSource',
    //     'isDragging',
    //     'canDrop',
    //     'canDrag',
    //     'node',
    //     'title',
    //     'subtitle',
    //     'draggedNode',
    //     'path',
    //     'treeIndex',
    //     'isSearchMatch',
    //     'isSearchFocus',
    //     'buttons',
    //     'className',
    //     'style',
    //     'didDrop',
    //     'treeId',
    //     'isOver',
    //     'parentNode',
    //     'chooseBox',
    //     'hoverBox',
    //     'unhoverBox',
    //     'changeBoxProperty',
    //     'resourceDraft',
    //     'currentResource',
    //     'pluginsStructure',
    //     'properties',
    //     'mode',
    //     'itemPath',
    //     'text',
    //     'isChildren',
    //     'isElementFromCMSVariable',
    //     'forChildren',
    //     'textContent',
    //     'rowDirection',
    //     'tryWebsiter',
    //     'userId',
    //     'loadedWebsite',
    //     'resourcesObjects',
    // ])

    var handle

    if (canDrag) {
        handle = connectDragSource(<div className={classes.rst__moveHandle} />)
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { id, mode, itemPath } = props.node

    const {
        currentResource,
        pluginsStructure,
        currentNodeValues,
        isCurrentBox,
    } = props

    const {
        tag,
        text,
        isChildren,
        isElementFromCMSVariable,
        childrenTo,
    } = props.currentNode
    if (
        id ===
        'element_21_forPlugin_5e552539a8244072b62fceaf_childrenTo_element_3'
    )
        console.log(tag)

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive)
        rowClasses.push(
            isCurrentBox
                ? [classes.Chosen]
                : id === props.hoveredElementId
                ? [classes.Hovered]
                : null
        )

    const handleRename = value => {
        if (
            !props.checkUserRights(
                props.mode === 'page' ? ['content'] : ['developer']
            )
        ) {
            return
        }
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
            props.changeBoxPropertyInStructure(mode, 'tag', value, false, id)
        }
    }
    return (
        <div
            // {..._extends({ style: { height: '100%' } }, otherProps)}
            {..._extends({ style: { height: '100%' } }, {})}
            onMouseDown={() => props.chooseBox(mode, id)}
            // onMouseEnter={() => props.hoverBox(id, mode)}
            // onMouseMove={() => props.hoverBox(id, mode)}
            // onMouseLeave={() => props.unhoverBox()}
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
                        style={_objectSpread({
                            opacity: isDraggedDescendant ? 0.5 : 1,
                        })}
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
                                {text && currentNodeValues ? (
                                    'text' +
                                    (currentNodeValues.textContent
                                        ? ' - "' +
                                          currentNodeValues.textContent.substr(
                                              0,
                                              25
                                          ) +
                                          (currentNodeValues.textContent
                                              .length > 25
                                              ? '...'
                                              : '') +
                                          '"'
                                        : '')
                                ) : (
                                    <>
                                        {!isChildren &&
                                        !isElementFromCMSVariable
                                            ? '<'
                                            : isElementFromCMSVariable
                                            ? 'From CMS variable - '
                                            : ''}
                                        {(mode === 'plugin' &&
                                            itemPath.length > 0) ||
                                        ((mode === 'template' &&
                                            itemPath.length > 1) ||
                                            itemPath[0] === 'element_02') ? (
                                            props.checkUserRights(
                                                mode === 'page'
                                                    ? ['content']
                                                    : ['developer'],
                                                true
                                            ) ? (
                                                <InspectorValue
                                                    readonly={childrenTo}
                                                    value={tag}
                                                    items={tagItems.map(
                                                        item => {
                                                            return {
                                                                abbr: item,
                                                                name: item,
                                                            }
                                                        }
                                                    )}
                                                    blur={handleRename}
                                                    withState
                                                />
                                            ) : (
                                                tag
                                            )
                                        ) : (
                                            tag
                                        )}
                                        {currentNodeValues ? (
                                            currentNodeValues.properties ? (
                                                <>
                                                    {currentNodeValues
                                                        .properties.id
                                                        ? ` id="${
                                                              currentNodeValues
                                                                  .properties.id
                                                          }"`
                                                        : ''}
                                                    {currentNodeValues
                                                        .properties.class
                                                        ? ` class="${
                                                              currentNodeValues
                                                                  .properties
                                                                  .class
                                                          }"`
                                                        : ''}
                                                </>
                                            ) : (
                                                ''
                                            )
                                        ) : (
                                            ''
                                        )}
                                        {!isChildren &&
                                        !isElementFromCMSVariable
                                            ? ' >'
                                            : isElementFromCMSVariable
                                            ? ''
                                            : ' (inherited children)'}
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

const mapStateToProps = (state, props) => {
    const currentNode = state.mD[resourceDraftIndex[props.mode]].structure.find(
        item => item.id === props.node.id
    )
    if (!currentNode) {
        return {}
    }
    return {
        isCurrentBox:
            state.mD[resourceDraftIndex[props.mode]].currentBox ===
            currentNode.id,
        currentNode,
        currentNodeValues:
            state.mD[resourceDraftIndex[props.mode]].values[currentNode.id],
        currentResource: state.mD[currentIndex[props.mode]],
        pluginsStructure: state.mD.pluginsStructure,
        hoveredElementId: -100,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        chooseBox: (type, id) => dispatch(actions.chooseBox(type, id)),
        changeBoxPropertyInStructure: (
            type,
            key,
            value,
            notForHistory,
            boxId
        ) =>
            dispatch(
                actions.changeBoxPropertyInStructure(
                    type,
                    key,
                    value,
                    false,
                    boxId
                )
            ),
        hoverBox: (id, mode) => dispatch(actions.hoverBox(id, mode)),
        unhoverBox: () => dispatch(actions.unhoverBox()),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
