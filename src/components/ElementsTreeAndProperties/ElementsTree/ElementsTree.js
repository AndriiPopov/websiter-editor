import React, { useState, useEffect, memo } from 'react'
import { getCurrentResourceValue } from '../../../utils/basic'
import { connect } from 'react-redux'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import SortableTree from 'react-sortable-tree'
import { checkIfCapital, buildTree } from '../../../utils/basic'
import * as actions from '../../../store/actions/index'
import * as classes from '../../ResourcesTree/ResourcesTree.module.css'
import { buildItems } from '../../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../../UI/TreeSearch/TreeSearch'
import populateStructureWithPluginChildren from './methods/populateStructureWithPluginChildren'
import { searchOnHover, searchMethod, searchMethod2 } from './methods/search'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import checkUserRights from '../../../utils/checkUserRights'
import {
    current as currentIndex,
    resourceDraftIndex,
} from '../../../utils/resourceTypeIndex'
import Buttons from './Buttons'

import type {
    resourceType,
    initialStateType,
    elementType,
} from '../../../store/reducer/reducer'

export type State = {
    searchString: string,
    searchFocusIndex: number,
    searchFoundCount: null | number,
    searchStringHasBeenCleared: boolean,
    searchOpen: boolean,
}

export type Props = {
    resourceDraft: resourceType,
    currentResource:
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentPlugin'>,
    mode: 'page' | 'plugin' | 'template',
    findMode: $PropertyType<initialStateType, 'findMode'>,
    fromFrame: $PropertyType<initialStateType, 'fromFrame'>,
    hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
    chooseBox: typeof actions.chooseBox,
    addBox: typeof actions.addBox,
    duplicateBox: typeof actions.duplicateBox,
    deleteBox: typeof actions.deleteBox,
    saveElementsStructure: typeof actions.saveElementsStructure,
    hoverBox: typeof actions.hoverBox,
    unhoverBox: typeof actions.unhoverBox,
    mergeBoxToPlugin: typeof actions.mergeBoxToPlugin,
    dissolvePluginToBox: typeof actions.dissolvePluginToBox,
    markShouldRefreshing: typeof actions.markShouldRefreshing,
    toggleFindMode: typeof actions.toggleFindMode,
    currentBoxType:
        | 'html'
        | 'page'
        | 'headBody'
        | 'plugin'
        | 'children'
        | 'childrenTo'
        | 'element'
        | 'isCMSVariable'
        | 'isElementFromCMSVariable'
        | 'none',
    searchQuery: string,
    node: elementType,
}

const ElementsTree = (props: Props) => {
    const { currentResource, resourceDraftStructure } = props

    if (!resourceDraftStructure) return null

    const structureWithPluginChildren = populateStructureWithPluginChildren(
        resourceDraftStructure,
        currentResource,
        props
    )
    let treeData = buildTree(
        structureWithPluginChildren.map((item, index) => ({
            ...item,
            itemPath: item.path,
            mode: props.mode,
            itemIndex: index,
        }))
    )

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        if (!isEqual(result, resourceDraftStructure)) {
            if (
                !isEqual(
                    result.map(item =>
                        omit(item, ['expanded', 'children', 'itemPath'])
                    ),
                    resourceDraftStructure.map(item =>
                        omit(item, ['expanded', 'children', 'itemPath'])
                    )
                )
            ) {
                if (
                    !props.checkUserRights(
                        props.mode === 'page' ? null : ['developer']
                    )
                ) {
                    return
                }
            }
            props.saveElementsStructure(
                props.mode,
                result,
                resourceDraftStructure
            )
        }
    }

    const canDropHandle = ({ nextParent, nextPath, prevPath }) => {
        if (!nextParent) return false
        if (nextParent.mode === 'page') return false
        if (nextParent.text) return false
        if (nextParent.mode === 'template' && nextPath[0] !== prevPath[0])
            return false
        if (
            nextParent.mode === 'template' &&
            (nextPath[0] === 'element_02' || nextParent.id === 'element_02')
        )
            return true
        if (nextParent.isElementFromCMSVariable) return false
        return (
            (!checkIfCapital(nextParent.tag.charAt(0)) ||
                nextParent.itemPath.length === 0 ||
                nextParent.forChildren) &&
            nextParent.tag !== 'menu' &&
            ((nextParent.mode === 'template' &&
                nextParent.itemPath.length > 0) ||
                nextParent.mode === 'plugin') &&
            !nextParent.isChildren
        )
    }

    const canDragHandle = ({ node }) => {
        if (node.mode === 'page') return false
        return (
            node.itemPath.length >
                (node.mode === 'template' && node.itemPath[0] !== 'element_02'
                    ? 1
                    : 0) && !node.childrenTo
        )
    }

    const generateNodePropsHandle = ({ node }) => ({
        mode: props.mode,
        itemIndex: node.itemIndex,
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
        setState({
            ...state,
            searchFoundCount: matches.length,
            searchFocusIndex:
                matches.length > 0
                    ? state.searchFocusIndex % matches.length
                    : 0,
        })
    }

    const [state: State, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        searchStringHasBeenCleared: true,
        searchOpen: false,
    })

    useEffect(() => {
        searchOnHover(props, state, setState)
    }, [props.hoveredElementId, props.findMode])

    return (
        <>
            <div>
                <Buttons state={state} setState={setState} mode={props.mode} />
            </div>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    canDrag={canDragHandle}
                    canDrop={canDropHandle}
                    scaffoldBlockPxWidth={22}
                    rowHeight={20}
                    generateNodeProps={generateNodePropsHandle}
                    isVirtualized={true}
                    onMoveNode={onMoveNodeHandle}
                    searchQuery={state.searchString}
                    searchFocusOffset={state.searchFocusIndex}
                    searchFinishCallback={searchFinishCallbackHandle}
                    searchMethod={props.findMode ? searchMethod2 : searchMethod}
                />
            </div>
            {state.searchOpen ? (
                <TreeSearch state={state} setState={setState} />
            ) : null}
        </>
    )
}

const mapStateToProps = (state, props) => {
    const pluginElementsStructures = {}
    for (let item of state.mD.pluginsStructure) {
        let draft = getCurrentResourceValue(item.id, state.resourcesObjects)
        pluginElementsStructures[item.id] = draft ? draft.structure : []
    }
    return {
        hoveredElementId: -100,
        findMode: state.findMode,
        fromFrame: state.fromFrame,
        // structure: state.mD[structureIndex[props.mode]].structure,
        currentResource: state.mD[currentIndex[props.mode]],
        resourceDraftStructure: state.mD[resourceDraftIndex[props.mode]]
            ? state.mD[resourceDraftIndex[props.mode]].structure
            : null,
        pluginsStructure: state.mD.pluginsStructure,
        pluginElementsStructures,
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
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}
// let prevVal
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    memo(
        ElementsTree,
        (prevProps, nextProps) => {
            return (
                isEqual(
                    prevProps.pluginElementsStructures,
                    nextProps.pluginElementsStructures
                ) &&
                isEqual(
                    prevProps.resourceDraftStructure,
                    nextProps.resourceDraftStructure
                ) &&
                isEqual(prevProps.currentResource, nextProps.currentResource)
            )
        }
        // , (prevProps, nextProps) => {
        //     const getData = props => {
        //         const { currentResource, resourceDraft } = props
        //         if (!resourceDraft) return null
        //         return populateStructureWithPluginChildren(
        //             resourceDraft.structure,
        //             currentResource,
        //             props
        //         )
        //     }
        //     // const prev = getData(prevProps)
        //     const next = getData(nextProps)
        //     if (!prevVal) {
        //         prevVal = next
        //         return false
        //     }
        //     const equal = isEqual(prevVal.pluginsElements, next.pluginsElements)
        //     prevVal = next
        //     return equal
        // }
    )
)
