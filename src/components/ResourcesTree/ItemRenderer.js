import React from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import * as actions from '../../store/actions/index'
import * as classes from './ResourcesTree.module.css'
import InspectorValue from '../UI/InspectorValue/InspectorValue'
import {
    _extends,
    isDescendant,
    _objectSpread,
    // $FlowFixMe
} from '../../utils/sortTreeMethods'
import Svg from '../Svg/Svg'
import { structure } from '../../utils/resourceTypeIndex'
import checkUserRights from '../../utils/checkUserRights'
import * as wsActions from '../../websocketActions'

import type { pageType, initialStateType } from '../../store/reducer/reducer'

type Props = {
    changeWebsiteProperty: typeof actions.changeWebsiteProperty,
    chooseResource: typeof actions.chooseResource,
    connectDragPreview: Function,
    scaffoldBlockPxWidth: number,
    toggleChildrenVisibility: Function,
    connectDragPreview: Function,
    connectDragSource: Function,
    isDragging: boolean,
    canDrop: boolean,
    canDrag: boolean,
    node: pageType & { children: Array<pageType>, expanded: boolean },
    draggedNode: {},
    path: Array<string>,
    treeIndex: number,
    isSearchMatch: boolean,
    isSearchFocus: boolean,
    className: string,
    style: string,
    didDrop: boolean,
    type: 'page' | 'plugin' | 'template',
    saveResourcesStructure: typeof actions.saveResourcesStructure,
    notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
    userId: $PropertyType<initialStateType, 'userId'>,
}

const ItemRenderer = (props: Props) => {
    // const mD = getEssentialData(props.userId, props.resourcesObjects)
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
        didDrop = _this$props.didDrop

    var handle

    if (canDrag) {
        handle = connectDragSource(<div className={classes.rst__moveHandle} />)
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { name, id, url, homepage, hidden, published } = props.node

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)

    const handlePropertyChange = (key, value, id) => {
        if (
            !props.checkUserRights(
                props.type === 'page' ? ['content'] : ['developer']
            )
        ) {
            return
        }
        value = value.trim()
        if (key === 'url') {
            value = value.replace(/\s+/g, '-').toLowerCase()
        }
        const newStructure = cloneDeep(props.structure)
        const element = newStructure.find(item => item.id === id)
        // $FlowFixMe
        if (element[key] !== value) {
            // $FlowFixMe
            element[key] = value
            props.sendUpdate(
                'website',
                {
                    [structure[props.type]]: newStructure,
                },
                props.currentWebsiteId
            )
        }
    }

    const handleChoose = id => {
        if (
            props.currentPageId !== id &&
            props.currentTemplateId !== id &&
            props.currentPluginId !== id
        )
            props.chooseResource(id, props.type)
    }

    return (
        <div
            {..._extends({ style: { height: '100%' } })}
            onMouseDown={() => handleChoose(id)}
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
                            style={
                                props.type === 'page'
                                    ? {
                                          minWidth: '350px',
                                          paddingRight: '90px',
                                      }
                                    : {}
                            }
                        >
                            <div className={classes.rst__rowLabel}>
                                {props.checkUserRights(
                                    props.type === 'page'
                                        ? ['content']
                                        : ['developer'],
                                    true
                                ) ? (
                                    <InspectorValue
                                        value={name}
                                        items={[]}
                                        blur={value =>
                                            handlePropertyChange(
                                                'name',
                                                value,
                                                id
                                            )
                                        }
                                        withState
                                        requiredRights={
                                            props.type === 'page'
                                                ? ['content']
                                                : ['developer']
                                        }
                                    />
                                ) : (
                                    name
                                )}
                            </div>
                            {props.type === 'page' ? (
                                <div className={classes.rst__rowLabel}>
                                    url:
                                    {props.checkUserRights(
                                        props.type === 'page'
                                            ? ['content']
                                            : ['developer'],

                                        true
                                    ) ? (
                                        <InspectorValue
                                            value={url}
                                            items={[]}
                                            blur={value =>
                                                handlePropertyChange(
                                                    'url',
                                                    value,
                                                    id
                                                )
                                            }
                                            withState
                                            allowEmpty
                                        />
                                    ) : (
                                        url
                                    )}
                                </div>
                            ) : null}
                            <div
                                className={[
                                    classes.IconsContainer,
                                    props.type === 'page'
                                        ? classes.IconsContainerPage
                                        : classes.IconsContainerNotPage,
                                ].join(' ')}
                            >
                                {props.type === 'page' ? (
                                    <div>
                                        {homepage ? (
                                            <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>' />
                                        ) : (
                                            <Svg icon='<svg width="17" height="17"></svg>' />
                                        )}
                                    </div>
                                ) : null}
                                {props.type === 'page' ? (
                                    <div>
                                        {hidden ? (
                                            <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>' />
                                        ) : (
                                            <Svg icon='<svg width="17" height="17"></svg>' />
                                        )}
                                    </div>
                                ) : null}
                                <div>
                                    {!published ? (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></svg>' />
                                    ) : (
                                        <Svg icon='<svg width="17" height="17"></svg>' />
                                    )}
                                </div>
                                <div>
                                    {props.notSavedResources.includes(id) ? (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>' />
                                    ) : (
                                        <Svg icon='<svg width="17" height="17"></svg>' />
                                    )}
                                </div>
                                <div>
                                    {props.newVersionResources.includes(id) ? (
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M20,4H4C2.89,4,2.01,4.89,2.01,6L2,18c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2V6C22,4.89,21.11,4,20,4z M8.5,15H7.3 l-2.55-3.5V15H3.5V9h1.25l2.5,3.5V9H8.5V15z M13.5,10.26H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4V10.26z M20.5,14 c0,0.55-0.45,1-1,1h-4c-0.55,0-1-0.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25V14z"></path></svg>' />
                                    ) : (
                                        <Svg icon='<svg width="17" height="17"></svg>' />
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

const mapStateToProps = (state, props) => {
    return {
        newVersionResources: state.newVersionResources,
        notSavedResources: state.notSavedResources,
        resourcesObjects: state.resourcesObjects,
        userId: state.userId,
        structure: state.mD[structure[props.type]],
        currentWebsiteId: state.mD.currentWebsiteId,
        currentPageId: state.mD.currentPageId,
        currentTemplateId: state.mD.currentTemplateId,
        currentPluginId: state.mD.currentPluginId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseResource: (id, type) =>
            dispatch(actions.chooseResource(id, type)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
        sendUpdate: (type, newResource, id) =>
            dispatch(wsActions.sendUpdate(type, newResource, id)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
