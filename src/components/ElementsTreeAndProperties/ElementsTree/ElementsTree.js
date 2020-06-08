import React, { useState, useEffect, memo } from 'react'
import { getCurrentResourceValue } from '../../../utils/basic'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import SortableTree from 'react-sortable-tree'
import { buildTree } from '../../../utils/basic'
import * as actions from '../../../store/actions/index'
import * as classes from '../../ResourcesTree/ResourcesTree.module.css'
import { buildItems } from '../../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../../UI/TreeSearch/TreeSearch'
import populateStructureWithPluginChildrenAndPropagating from './methods/populateStructureWithPluginChildrenAndPropagating'
import { searchOnHover, searchMethod, searchMethod2 } from './methods/search'
import isEqual from 'lodash/isEqual'
import {
    current as currentIndex,
    resourceDraftIndex,
} from '../../../utils/resourceTypeIndex'
import Buttons from './Buttons'
import OverlayOnSizeIsChanging from '../../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
// import type {
//     resourceType,
//     initialStateType,
//     elementType,
// } from '../../../store/reducer/reducer'
import getBoxType from '../../../utils/getBoxType'
import generateButtonRules from './methods/generateButtonRules'

import ControlPanel from '../../UI/ControlPanel'
import { canDragHandle, canDropHandle } from './methods'

// export type State = {
//     searchString: string,
//     searchFocusIndex: number,
//     searchFoundCount: null | number,
//     searchStringHasBeenCleared: boolean,
//     searchOpen: boolean,
// }

// export type Props = {
//     resourceDraft: resourceType,
//     currentResource:
//         | $PropertyType<initialStateType, 'currentPage'>
//         | $PropertyType<initialStateType, 'currentPlugin'>,
//     mode: 'page' | 'plugin' | 'template',
//     findMode: $PropertyType<initialStateType, 'findMode'>,
//     fromFrame: $PropertyType<initialStateType, 'fromFrame'>,
//     hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
//     chooseBox: typeof actions.chooseBox,
//     addBox: typeof actions.addBox,
//     duplicateBox: typeof actions.duplicateBox,
//     deleteBox: typeof actions.deleteBox,
//     saveElementsStructure: typeof actions.saveElementsStructure,
//     hoverBox: typeof actions.hoverBox,
//     unhoverBox: typeof actions.unhoverBox,
//     mergeBoxToPlugin: typeof actions.mergeBoxToPlugin,
//     dissolvePluginToBox: typeof actions.dissolvePluginToBox,
//     markShouldRefreshing: typeof actions.markShouldRefreshing,
//     toggleFindMode: typeof actions.toggleFindMode,
//     currentBoxType:
//         | 'html'
//         | 'page'
//         | 'headBody'
//         | 'plugin'
//         | 'children'
//         | 'childrenTo'
//         | 'element'
//         | 'isCMSVariable'
//         | 'isElementFromCMSVariable'
//         | 'none',
//     searchQuery: string,
//     node,
// }

const ElementsTree = props => {
    const { resourceDraftStructure, structureWithPluginChildren } = props

    if (!resourceDraftStructure) return null
    let treeData = buildTree(
        structureWithPluginChildren.map(item => ({
            ...item,
            itemPath: item.path,
            mode: props.mode,
        }))
    )

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        if (!isEqual(result, resourceDraftStructure)) {
            props.saveElementsStructure(
                props.mode,
                result,
                resourceDraftStructure
            )
        }
    }

    const generateNodePropsHandle = ({ node }) => ({
        mode: props.mode,
        // itemIndex: node.itemIndex,
    })

    const onMoveNodeHandle = ({ node, treeIndex, path }) => {
        return global.console.debug(
            'node:',
            node,
            'treeIndex:',
            treeIndex,
            'path:',
            path
        )
    }

    const searchFinishCallbackHandle = matches => {
        return
        // setState({
        //     ...state,
        //     searchFoundCount: matches.length,
        //     searchFocusIndex:
        //         matches.length > 0
        //             ? state.searchFocusIndex % matches.length
        //             : 0,
        // })
    }

    const [state, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        searchStringHasBeenCleared: true,
        searchOpen: false,
    })

    useEffect(() => {
        searchOnHover(props, state, setState)
    }, [props.hoveredElementId, props.findMode])

    const [structureIds, saveStructureIds] = useState(
        props.structureWithPluginChildren.map(item => item.id)
    )

    useEffect(() => {
        const newStructureIds = props.structureWithPluginChildren.map(
            item => item.id
        )
        const structuresAreEqual = isEqual(newStructureIds, structureIds)

        if (!structuresAreEqual) {
            props.saveElementsStructure(
                props.mode,
                props.structureWithPluginChildren,
                props.resourceDraftStructure
            )
            saveStructureIds(newStructureIds)
        }
    }, [props.structureWithPluginChildren])

    const currentBoxType = getBoxType(props)

    const buttonRules = generateButtonRules(props, currentBoxType)

    const setActiveAndKeyDown = e => {
        if (e === 'blur') {
            props.unsetActiveContainer(props.mode + 'elements')
        } else {
            props.setActiveContainer(props.mode + 'elements')
            if (e) {
                const code = e.code

                if (props.mode === 'page') {
                    switch (code) {
                        case 'KeyA':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.addBox(props.mode, 'page')
                            }
                            break
                        case 'KeyD':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.duplicateBox(props.mode, 'page')
                            }
                            break
                        case 'KeyF':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                setState({
                                    ...state,
                                    searchOpen: !state.searchOpen,
                                })
                            }
                            break
                        case 'KeyR':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.markShouldRefreshing(true)
                            }
                            break
                        case 'KeyC':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.copyBox(props.mode, 'page')
                            }
                            break
                        case 'KeyX':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.cutBox(props.mode, 'page')
                            }
                            break
                        case 'KeyV':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.pasteBox(props.mode, 'page')
                            }
                            break
                        case 'Delete':
                            props.deleteBox(props.mode, 'page')
                            break
                        default:
                            break
                    }
                } else {
                    switch (code) {
                        case 'KeyA':
                            if (
                                e.ctrlKey &&
                                e.shiftKey &&
                                buttonRules.addInside
                            ) {
                                e.preventDefault()
                                props.addBox(props.mode, 'inside')
                            } else if (e.ctrlKey && buttonRules.addNext) {
                                e.preventDefault()
                                props.addBox(props.mode)
                            }
                            break
                        case 'KeyQ':
                            if (e.ctrlKey && buttonRules.addText) {
                                e.preventDefault()
                                props.addBox(props.mode, 'text')
                            }
                            break
                        case 'KeyD':
                            if (buttonRules.duplicate) {
                                if (e.ctrlKey && e.shiftKey) {
                                    e.preventDefault()
                                    props.duplicateBox(props.mode, true)
                                } else if (e.ctrlKey) {
                                    e.preventDefault()
                                    props.duplicateBox(props.mode)
                                }
                            }
                            break
                        case 'KeyF':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                setState({
                                    ...state,
                                    searchOpen: !state.searchOpen,
                                })
                            }
                            break
                        case 'KeyR':
                            if (e.ctrlKey) {
                                e.preventDefault()
                                props.markShouldRefreshing(true)
                            }
                            break
                        case 'KeyC':
                            if (e.ctrlKey && e.shiftKey) {
                                e.preventDefault()
                                props.copyBox(props.mode, true)
                            } else if (e.ctrlKey) {
                                e.preventDefault()
                                props.copyBox(props.mode)
                            }
                            break
                        case 'KeyX':
                            if (e.ctrlKey && e.shiftKey) {
                                e.preventDefault()
                                props.cutBox(props.mode, true)
                            } else if (e.ctrlKey) {
                                e.preventDefault()
                                props.cutBox(props.mode)
                            }
                            break
                        case 'KeyV':
                            if (e.ctrlKey && e.shiftKey) {
                                e.preventDefault()
                                props.pasteBox(props.mode, true)
                            } else if (e.ctrlKey) {
                                e.preventDefault()
                                props.pasteBox(props.mode)
                            }
                            break
                        case 'Delete':
                            if (buttonRules.delete) {
                                e.preventDefault()
                                if (e.shiftKey)
                                    props.deleteBox(props.mode, true)
                                else props.deleteBox(props.mode)
                            }
                            break
                        default:
                            break
                    }
                }
            }
        }
    }

    const handleButtonMenuClick = e => {
        switch (e.key) {
            case 'addText':
                props.addBox(props.mode, 'text')
                break
            case 'addInside':
                props.addBox(props.mode, 'inside')
                break
            case 'addFromCMS':
                props.addBox(props.mode, 'cmsVariable')
                break
            case 'addInheritedChildren':
                props.addBox(props.mode, 'children')
                break
            case 'duplicateWithout':
                props.duplicateBox(props.mode)
                break
            case 'duplicateWith':
                props.duplicateBox(props.mode, true)
                break
            case 'deleteWith':
                props.deleteBox(props.mode, true)
                break
            case 'deleteChildren':
                props.deleteBox(props.mode, 'onlyChildren')
                break

            default:
                break
        }
    }

    return (
        <div
            className={classes.Container}
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
            <ControlPanel>
                <Buttons
                    state={state}
                    setState={setState}
                    mode={props.mode}
                    addBox={props.addBox}
                    duplicateBox={props.duplicateBox}
                    mergeBoxToPlugin={props.mergeBoxToPlugin}
                    dissolvePluginToBox={props.dissolvePluginToBox}
                    deleteBox={props.deleteBox}
                    toggleFindMode={props.toggleFindMode}
                    markShouldRefreshing={props.markShouldRefreshing}
                    buttonRules={buttonRules}
                    handleButtonMenuClick={handleButtonMenuClick}
                />
            </ControlPanel>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    canDrag={canDragHandle}
                    canDrop={canDropHandle}
                    scaffoldBlockPxWidth={22}
                    rowHeight={({ node }) => {
                        return 20
                    }}
                    generateNodeProps={generateNodePropsHandle}
                    isVirtualized={true}
                    onMoveNode={onMoveNodeHandle}
                    searchQuery={state.searchString}
                    searchFocusOffset={state.searchFocusIndex}
                    searchFinishCallback={searchFinishCallbackHandle}
                    searchMethod={props.findMode ? searchMethod2 : searchMethod}
                    style={{
                        flex: '1 1',
                        height: 'auto !important',
                        // overflow: 'auto',
                    }}
                    slideRegionSize={20}
                    innerStyle={{ paddingBottom: '150px' }}
                />
            </div>
            {state.searchOpen ? (
                <TreeSearch state={state} setState={setState} />
            ) : null}
            <OverlayOnSizeIsChanging />
        </div>
    )
}

const mapStateToProps = (state, props) => {
    let resourceDraftStructure = null
    let resourceDraftValues = null
    if (state.mD[resourceDraftIndex[props.mode]]) {
        resourceDraftStructure =
            state.mD[resourceDraftIndex[props.mode]].structure
        resourceDraftValues = state.mD[resourceDraftIndex[props.mode]].values
    }

    const currentResource = state.mD[currentIndex[props.mode]]
    const pluginsStructure = state.mD.pluginsStructure
    const {
        structureWithPluginChildren,
        pluginElementsStructures,
    } = populateStructureWithPluginChildrenAndPropagating(state.mD, props.mode)

    return {
        hoveredElementId: -100,
        findMode: state.findMode,
        fromFrame: state.fromFrame,
        // structure: state.mD[structureIndex[props.mode]].structure,
        currentResource,
        resourceDraftStructure,
        resourceDraftValues,
        pluginsStructure,
        pluginElementsStructures,
        structureWithPluginChildren,
        currentBox: state.mD[resourceDraftIndex[props.mode]].currentBox,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        saveElementsStructure: (type, structure, resourceDraftStructure) =>
            dispatch(
                actions.saveElementsStructure(
                    type,
                    structure,
                    resourceDraftStructure
                )
            ),
        setActiveContainer: container =>
            dispatch(actions.setActiveContainer(container)),
        unsetActiveContainer: container =>
            dispatch(actions.unsetActiveContainer(container)),
        copyBox: (mode, withChildren) =>
            dispatch(actions.copyBox(mode, false, withChildren)),
        cutBox: (mode, withChildren) =>
            dispatch(actions.copyBox(mode, true, withChildren)),
        pasteBox: (mode, inside) => dispatch(actions.pasteBox(mode, inside)),
        addBox: (mode, type) => dispatch(actions.addBox(mode, type)),
        duplicateBox: (mode, withChildren) =>
            dispatch(actions.duplicateBox(mode, withChildren)),
        mergeBoxToPlugin: (type, onlyChildren) =>
            dispatch(actions.mergeBoxToPlugin(type, onlyChildren)),
        dissolvePluginToBox: type =>
            dispatch(actions.dissolvePluginToBox(type)),
        deleteBox: (mode, withChildren) =>
            dispatch(actions.deleteBox(mode, withChildren)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        markShouldRefreshing: value =>
            dispatch(actions.markShouldRefreshing(value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    memo(ElementsTree, (prevProps, nextProps) => {
        return (
            isEqual(
                prevProps.pluginElementsStructures,
                nextProps.pluginElementsStructures
            ) &&
            isEqual(
                prevProps.structureWithPluginChildren,
                nextProps.structureWithPluginChildren
            ) &&
            isEqual(prevProps.currentResource, nextProps.currentResource) &&
            isEqual(prevProps.currentBox, nextProps.currentBox)
        )
    })
)
