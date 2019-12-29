import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import SortableTree from 'react-sortable-tree'
import { checkIfCapital, buildTree } from '../../../utils/basic'
import * as actions from '../../../store/actions/index'
import * as classes from '../../ResourcesTree/ResourcesTree.module.css'
import withDragDropContext from '../../../hoc/withDragDropContext'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../../UI/TreeSearch/TreeSearch'
import populateStructureWithPluginChildren from './methods/populateStructureWithPluginChildren'
import { searchOnHover, searchMethod, searchMethod2 } from './methods/search'
import getBoxType from './methods/getBoxType'
import generateButtonRules from './methods/generateButtonRules'

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
    loadedPage: $PropertyType<initialStateType, 'currentPage'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    resourceDraft: resourceType,
    currentResource:
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentPlugin'>,
    mode: 'page' | 'plugin',
    pluginsStructure: $PropertyType<initialStateType, 'pluginsStructure'>,
    findMode: $PropertyType<initialStateType, 'findMode'>,
    fromFrame: $PropertyType<initialStateType, 'fromFrame'>,
    hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
    websiteId: $PropertyType<initialStateType, 'loadedWebsite'>,
    chooseBox: typeof actions.chooseBox,
    addBox: typeof actions.addBox,
    duplicateBox: typeof actions.duplicateBox,
    deleteBox: typeof actions.deleteBox,
    saveElementsStructure: typeof actions.saveElementsStructure,
    hoverBox: typeof actions.hoverBox,
    unhoverBox: typeof actions.unhoverBox,
    mergeBoxToPlugin: typeof actions.mergeBoxToPlugin,
    dissolvePluginToBox: typeof actions.dissolvePluginToBox,
    toggleFindMode: typeof actions.toggleFindMode,
    currentBoxType:
        | 'html'
        | 'page'
        | 'headBody'
        | 'plugin'
        | 'children'
        | 'childrenTo'
        | 'element'
        | 'none',
    searchQuery: string,
    node: elementType,
}

const ElementsTree = (props: Props) => {
    const structureWithPluginChildren = populateStructureWithPluginChildren(
        props.resourceDraft.structure,
        props
    )
    const treeData = buildTree(
        structureWithPluginChildren.map(item => ({
            ...item,
            itemPath: item.path,
            resourceDraft: props.resourceDraft,
            currentResource: props.currentResource,
            mode: props.mode,
            pluginsStructure: props.pluginsStructure,
        }))
    )

    const currentBoxType = getBoxType(props)

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        props.saveElementsStructure(
            result,
            props.currentResource,
            props.resourceDraft
        )
    }

    const canDropHandle = ({ nextParent }) => {
        return (
            nextParent &&
            !nextParent.text &&
            (!checkIfCapital(nextParent.tag.charAt(0)) ||
                nextParent.itemPath.length === 0 ||
                nextParent.forChildren) &&
            nextParent.tag !== 'menu' &&
            ((nextParent.mode === 'page' && nextParent.itemPath.length > 0) ||
                nextParent.mode === 'plugin') &&
            !nextParent.isChildren
        )
    }

    const canDragHandle = ({ node }) => {
        return (
            node.itemPath.length > (node.mode === 'page' ? 1 : 0) &&
            !node.childrenTo
        )
    }

    const generateNodePropsHandle = ({ node }) => ({
        className:
            node.id === props.resourceDraft.currentBox
                ? [classes.Chosen]
                : node.id === props.hoveredElementId
                ? [classes.Hovered]
                : null,
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

    const buttonRules = generateButtonRules(props, currentBoxType)

    return (
        <>
            <div>
                <SmallButton
                    inline
                    buttonClicked={() => props.toggleFindMode(props.mode)}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"></path></svg>'
                    tooltip="Select an element on the page"
                />
                {buttonRules.addNext ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.addBox(
                                props.currentResource,
                                props.resourceDraft,
                                props.mode
                            )
                        }
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                        tooltip="Add a new element next to the chosen element"
                    />
                ) : null}
                {buttonRules.addInside ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.addBox(
                                props.currentResource,
                                props.resourceDraft,
                                props.mode,
                                'inside'
                            )
                        }
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                        tooltip="Add a new element inside the chosen element"
                    />
                ) : null}
                {buttonRules.addChildren ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.addBox(
                                props.currentResource,
                                props.resourceDraft,
                                props.mode,
                                'children'
                            )
                        }
                        title="Children"
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                        tooltip="Add a new inherited children"
                    />
                ) : null}
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.addBox(
                            props.currentResource,
                            props.resourceDraft,
                            props.mode,
                            'text'
                        )
                    }
                    title="Text"
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                    tooltip="Add a new text element"
                />
                {buttonRules.duplicate ? (
                    <>
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.duplicateBox(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.mode
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                            tooltip="Duplicate the element without children elements"
                        />
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.duplicateBox(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.mode,
                                    true
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.8,3h4v5.1h-4V3z M17.8,15.9h4V21h-4V15.9z M17.8,9.4h4v5.2h-4V9.4z M4.1,3c-1,0-1.8,0.8-1.8,1.8v14.4  c0,1,0.8,1.8,1.8,1.8h10.8c1,0,1.8-0.8,1.8-1.8V8.4L11.3,3H4.1z M10.4,9.3v-5l5,5H10.4z"></path></svg>'
                            tooltip="Duplicate the element with children elements"
                        />
                    </>
                ) : null}

                {buttonRules.mergeToPlugin ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.mergeBoxToPlugin(
                                props.currentResource,
                                props.resourceDraft,
                                props.websiteId,
                                props.mode
                            )
                        }
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                        tooltip="Merge element and children elements into a new plugin"
                    />
                ) : null}
                {buttonRules.mergeToPluginChildren ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.mergeBoxToPlugin(
                                props.currentResource,
                                props.resourceDraft,
                                props.websiteId,
                                props.mode,
                                true
                            )
                        }
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                        tooltip="Merge children elements into a new plugin"
                    />
                ) : null}
                {buttonRules.dissolve ? (
                    <SmallButton
                        inline
                        buttonClicked={() =>
                            props.dissolvePluginToBox(
                                props.currentResource,
                                props.resourceDraft,
                                props.pluginsStructure,
                                props.resourcesObjects
                            )
                        }
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                        tooltip="Dissolve the plugin into elements"
                    />
                ) : null}

                {buttonRules.delete ? (
                    <>
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.deleteBox(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.mode
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                            tooltip="Delete element without children.<br>All children will remain on the page"
                        />
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.deleteBox(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.mode,
                                    true
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M11.8,3h-5l-1,1H2.3v2h14V4h-3.5L11.8,3z M3.3,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7h-12C3.3,7,3.3,19,3.3,19z M17.8,3  v5.1h4V3H17.8z M17.8,21h4v-5.1h-4V21z M17.8,14.6h4V9.4h-4V14.6z"></path></svg>'
                            tooltip="Delete element with all children inside"
                        />
                    </>
                ) : null}
                <SmallButton
                    inline
                    buttonClicked={() =>
                        setState({
                            ...state,
                            searchOpen: !state.searchOpen,
                        })
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>'
                    tooltip="Show or hide search"
                />
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

const mapStateToProps = state => {
    return {
        websiteId: state.loadedWebsite,
        resourcesObjects: state.resourcesObjects,
        pluginsStructure: state.pluginsStructure,
        hoveredElementId: state.hoveredElementId,
        findMode: state.findMode,
        fromFrame: state.fromFrame,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addBox: (currentResource, resourceDraft, mode, type) =>
            dispatch(
                actions.addBox(currentResource, resourceDraft, mode, type)
            ),
        duplicateBox: (currentResource, resourceDraft, mode, withChildren) =>
            dispatch(
                actions.duplicateBox(
                    currentResource,
                    resourceDraft,
                    mode,
                    withChildren
                )
            ),
        mergeBoxToPlugin: (
            currentResource,
            resourceDraft,
            websiteId,
            mode,
            onlyChildren
        ) =>
            dispatch(
                actions.mergeBoxToPlugin(
                    currentResource,
                    resourceDraft,
                    websiteId,
                    mode,
                    onlyChildren
                )
            ),
        dissolvePluginToBox: (
            currentResource,
            resourceDraft,
            pluginsStructure,
            resourcesObjects
        ) =>
            dispatch(
                actions.dissolvePluginToBox(
                    currentResource,
                    resourceDraft,
                    pluginsStructure,
                    resourcesObjects
                )
            ),
        deleteBox: (currentResource, resourceDraft, mode, withChildren) =>
            dispatch(
                actions.deleteBox(
                    currentResource,
                    resourceDraft,
                    mode,
                    withChildren
                )
            ),
        saveElementsStructure: (structure, currentResource, resourceDraft) =>
            dispatch(
                actions.saveElementsStructure(
                    structure,
                    currentResource,
                    resourceDraft
                )
            ),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ElementsTree)
)
