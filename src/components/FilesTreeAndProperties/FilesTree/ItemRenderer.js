import React from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import * as actions from '../../../store/actions/index'
import * as classes from './FilesTree.module.css'
import InspectorValue from '../../UI/InspectorValue/InspectorValue'
import {
    _extends,
    isDescendant,
    _objectSpread,
} from '../../../utils/sortTreeMethods'
import Svg from '../../Svg/Svg'
import * as wsActions from '../../../websocketActions'
import bytes from 'bytes'
import LazyLoad from 'react-lazy-load'
import TimeAgo from 'react-timeago'
import { getFileUrl } from '../../../utils/getFileUrl'
import { structure } from '../../../utils/resourceTypeIndex'
// import { bucket, CloudFrontUrl } from '../../../awsConfig'

// type Props = {
//     changeWebsiteProperty: typeof actions.changeWebsiteProperty,
//     chooseResource: typeof actions.chooseResource,
//     connectDragPreview: Function,
//     scaffoldBlockPxWidth: number,
//     toggleChildrenVisibility: Function,
//     connectDragPreview: Function,
//     connectDragSource: Function,
//     isDragging: boolean,
//     canDrop: boolean,
//     canDrag: boolean,
//     node: pageType & { children: Array<pageType>, expanded: boolean },
//     draggedNode: {},
//     path: Array<string>,
//     treeIndex: number,
//     isSearchMatch: boolean,
//     isSearchFocus: boolean,
//     className: string,
//     style: string,
//     didDrop: boolean,
//     saveResourcesStructure: typeof actions.saveResourcesStructure,
//     notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
//     userId: $PropertyType<initialStateType, 'userId'>,
// }

const ItemRenderer = props => {
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
        handle = connectDragSource(
            <div className={classes.rst__moveHandle}>
                <Svg icon='<svg width="17" height="17" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>' />
            </div>
        )
    }

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { name, id, size, type } = props.node

    const rowClasses = [classes.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)

    const handlePropertyChange = (key, value, id) => {
        value = value.trim()
        const newStructure = cloneDeep(props.structure)
        const element = newStructure.find(item => item.id === id)

        if (element[key] !== value) {
            element[key] = value
            props.sendUpdate(
                'website',
                {
                    filesStructure: newStructure,
                },
                props.currentWebsiteId
            )
        }
    }

    const handleChoose = id => {
        if (props.currentFileId !== id) props.chooseResource(id)
    }

    // const edits = {
    //     resize: {
    //         width: 40,
    //         height: 40,
    //         fit: 'contain',
    //         background: { r: 0, g: 0, b: 0, alpha: 0 },
    //     },
    // }
    // if (type !== 'image/png') edits.toFormat = 'png'
    // const imageRequest = JSON.stringify({
    //     bucket: bucket,
    //     key: serverName,
    //     edits,
    // })
    // const url = `${CloudFrontUrl}/${btoa(imageRequest)}`

    // let imageClass = classes.ImageContainer

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
                        >
                            <div className={classes.rst__rowLabel}>
                                <InspectorValue
                                    value={name}
                                    items={[]}
                                    blur={value =>
                                        handlePropertyChange('name', value, id)
                                    }
                                    withState
                                    requiredRights={['content', 'developer']}
                                    maxLength="38"
                                    maxWidth="320px"
                                />

                                <div
                                    style={{
                                        display: 'inline-block',
                                    }}
                                >
                                    {bytes(size, { decimalPlaces: 1 })}
                                </div>
                                <div
                                    style={{
                                        color: '#777',
                                        paddingLeft: '5px',
                                    }}
                                >
                                    <TimeAgo date={props.node.modifiedDate} />
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '-40px',
                                        top: '0px',
                                        width: '40px',
                                        height: '40px',
                                        overflow: 'hidden',
                                        background: '#fff',
                                        border: '1px solid #eee',
                                        boxSizing: 'border-box',
                                        lineHeight: '40px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {type.indexOf('image') >= 0 ? (
                                        <LazyLoad height={40}>
                                            <img
                                                src={getFileUrl(
                                                    props.structure,
                                                    id,
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
                                        </LazyLoad>
                                    ) : (
                                        <Svg icon='<svg width="40" height="30" viewBox="0 0 24 24"><path fill="#555" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>' />
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
        userId: state.userId,
        structure: state.mD.filesStructure,
        currentWebsiteId: state.mD.currentWebsiteId,
        currentFileId: state.mD.currentFileId,
        currentWebsiteObject: state.mD.currentWebsiteObject,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseResource: id => dispatch(actions.chooseResource(id, 'file')),
        sendUpdate: (type, newResource, id) =>
            dispatch(wsActions.sendUpdate(type, newResource, id)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
