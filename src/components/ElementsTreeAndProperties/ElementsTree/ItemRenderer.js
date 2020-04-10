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
import { SmallButton } from '../../UI/Buttons/SmallButton/SmallButton'

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

    var handle

    if (canDrag) {
        handle = connectDragSource(
            <div className={classes.rst__moveHandle}>
                <i className="material-icons">more_vert</i>
            </div>
        )
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
        isPropagatingItem,
    } = props.currentNode

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive)
        rowClasses.push(
            isCurrentBox
                ? props.isFocused
                    ? [classes.Chosen]
                    : [classes.ChosenBlur]
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
                                            itemPath[0] === 'element_02') ||
                                        isPropagatingItem ? (
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
                                                    maxLength="40"
                                                    maxWidth="220px"
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
                                                        ? ` id="${currentNodeValues.properties.id.substr(
                                                              0,
                                                              25
                                                          ) +
                                                              (currentNodeValues
                                                                  .properties.id
                                                                  .length > 25
                                                                  ? '...'
                                                                  : '')}"`
                                                        : ''}
                                                    {currentNodeValues
                                                        .properties.class
                                                        ? ` class="${currentNodeValues.properties.class.substr(
                                                              0,
                                                              25
                                                          ) +
                                                              (currentNodeValues
                                                                  .properties
                                                                  .class
                                                                  .length > 25
                                                                  ? '...'
                                                                  : '')}"`
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
                            {mode === 'page' ? (
                                <div>
                                    {(currentNodeValues.CMSVariableType &&
                                        currentNodeValues.CMSVariableType.indexOf(
                                            'propagating_'
                                        ) === 0) ||
                                    currentNodeValues.CMSVariableType ===
                                        'array' ? (
                                        <SmallButton
                                            inline
                                            buttonClicked={() =>
                                                props.addBox(mode, 'inside')
                                            }
                                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M21.6,13.4H13.4v8.2H10.6V13.4H2.4V10.6h8.2V2.4h2.8v8.2h8.2Zm-2.4,2.8h-.1l-.9.9,1.5,1.4H16.2V15.1H15.1v4.4h4.6l-1.5,1.4.9.9,2.6-2.7h.1Z"></path></svg>'
                                            // tooltip="Add a new item inside the chosen element (Ctrl + A)"
                                            // requiredRights={['content']}
                                        />
                                    ) : null}
                                    {isPropagatingItem ? (
                                        <>
                                            {itemPath.length > 0 &&
                                            itemPath[0] !== 'trash' ? (
                                                <SmallButton
                                                    inline
                                                    buttonClicked={() =>
                                                        props.addBox(mode)
                                                    }
                                                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                                                    // tooltip="Add a new item below (Ctrl + A)"
                                                    // requiredRights={['content']}
                                                />
                                            ) : null}
                                            <SmallButton
                                                inline
                                                buttonClicked={() =>
                                                    props.deleteBox(mode, true)
                                                }
                                                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                                                // tooltip="Delete item (Delete)"
                                                // requiredRights={['content']}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            ) : null}
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
        isFocused: state.activeContainer === props.mode + 'elements',
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
        addBox: (mode, type) => dispatch(actions.addBox(mode, type)),
        deleteBox: (mode, withChildren) =>
            dispatch(actions.deleteBox(mode, withChildren)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
