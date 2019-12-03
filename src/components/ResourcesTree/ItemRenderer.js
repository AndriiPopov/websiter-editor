import React from 'react'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'

import * as actions from '../../store/actions/index'
import * as classes from './ResourcesTree.module.css'
import InspectorValue from '../UI/InspectorValue/InspectorValue'
import {
    _extends,
    isDescendant,
    _toConsumableArray,
    _objectSpread,
    // $FlowFixMe
} from '../../utils/sortTreeMethods'
import Svg from '../Svg/Svg'

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
        rowDirection = _this$props.rowDirection
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

    const { name, id, url, homepage, hidden, notPublished } = props.node

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)

    const handlePropertyChange = (key, value, id) => {
        if (key === 'url') {
            value = value.replace(/\s+/g, '-').toLowerCase()
        }
        let newStructure = []
        if (props.type === 'page')
            newStructure = cloneDeep(props.pagesStructure)
        if (props.type === 'file')
            newStructure = cloneDeep(props.filesStructure)
        if (props.type === 'plugin')
            newStructure = cloneDeep(props.pluginsStructure)
        const element = newStructure.find(item => item.id === id)
        if (element[key] !== value) {
            element[key] = value
            props.saveResourcesStructure(
                props.loadedWebsite,
                newStructure,
                props.pagesStructure,
                props.type
            )
        }
    }

    const handleChoose = id => {
        if (
            props.currentPage !== id &&
            props.currentFile !== id &&
            props.currentPlugin !== id
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
                                <InspectorValue
                                    value={name}
                                    items={[]}
                                    blur={value =>
                                        handlePropertyChange('name', value, id)
                                    }
                                    withState
                                />
                            </div>
                            {props.type === 'page' ? (
                                <div className={classes.rst__rowLabel}>
                                    url:
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
                                    />
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
                                {props.type === 'page' && homepage ? (
                                    <div>
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>' />{' '}
                                    </div>
                                ) : null}
                                {props.type === 'page' && hidden ? (
                                    <div>
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>' />{' '}
                                    </div>
                                ) : null}
                                {notPublished ? (
                                    <div>
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"></path></svg>' />{' '}
                                    </div>
                                ) : null}
                                {props.notSavedResources.includes(id) ? (
                                    <div>
                                        <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>' />{' '}
                                    </div>
                                ) : null}
                            </div>
                            {/* {props.notSavedPages.includes(id) ? (
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '10px',
                                        background: 'red',
                                    }}
                                />
                            ) : null} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        pagesStructure: state.pagesStructure,
        filesStructure: state.filesStructure,
        pluginsStructure: state.pluginsStructure,
        notSavedResources: state.notSavedResources,
        loadedWebsite: state.loadedWebsite,
        resourcesObjects: state.resourcesObjects,
        currentPage: state.currentPage,
        currentFile: state.currentFile,
        currentPlugin: state.currentPlugin,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseResource: (id, type) =>
            dispatch(actions.chooseResource(id, type)),
        saveResourcesStructure: (websiteId, newStructure, oldStructure, type) =>
            dispatch(
                actions.saveResourcesStructure(
                    websiteId,
                    newStructure,
                    oldStructure,
                    type
                )
            ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
