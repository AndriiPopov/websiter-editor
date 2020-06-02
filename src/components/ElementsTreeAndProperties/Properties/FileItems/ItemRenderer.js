import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from '../../../FilesTreeAndProperties/FilesTree/FilesTree.module.css'
import * as classesFileTree from './FileItem.module.css'
import {
    _extends,
    isDescendant,
    _objectSpread,
} from '../../../../utils/sortTreeMethods'
import Svg from '../../../Svg/Svg'
import LazyLoad from 'react-lazy-load'
import TimeAgo from 'react-timeago'
import { getFileUrl } from '../../../../utils/getFileUrl'

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

    var isLandingPadActive = !didDrop && isDragging
    var isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    var buttonStyle = {
        left: -0.5 * scaffoldBlockPxWidth,
    }

    const { name, id, size, type } = props.node

    const rowClasses = [classes.rst__row, classesFileTree.rst__row]
    if (isLandingPadActive) rowClasses.push(classes.rst__rowLandingPad)
    if (isLandingPadActive && !canDrop)
        rowClasses.push(classes.rst__rowCancelPad)
    if (isSearchMatch) rowClasses.push(classes.rst__rowSearchMatch)
    if (isSearchFocus) rowClasses.push(classes.rst__rowSearchFocus)
    if (!isLandingPadActive) rowClasses.push(className)

    const handleChoose = id => {
        props.changeProperty('currentFileId', id)
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
                        <div
                            style={{
                                width: '100px',
                                height: '60px',
                                overflow: 'hidden',

                                boxSizing: 'border-box',
                                lineHeight: '60px',
                                textAlign: 'center',
                            }}
                        >
                            {type.indexOf('image') >= 0 ? (
                                <LazyLoad height={60}>
                                    <img
                                        src={getFileUrl(
                                            props.structure,
                                            id,
                                            false,
                                            true,
                                            props.currentWebsiteObject.domain
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
                        <div
                            style={{ padding: '0 7px 0 15px', border: 'none' }}
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
                                <div>{name}</div>
                                <div style={{ color: '#555' }}>
                                    <TimeAgo date={props.node.modifiedDate} />
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
        currentWebsiteObject: state.mD.currentWebsiteObject,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseResource: id => dispatch(actions.chooseResource(id, 'file')),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
