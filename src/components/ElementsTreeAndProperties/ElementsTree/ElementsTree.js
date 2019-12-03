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

type Props = {
    chooseBox: Function,
    addBox: Function,
    duplicateBox: Function,
    deleteBox: Function,
    changeBoxProperty: Function,
    saveElementsStructure: Function,
    hoverBox: Function,
    unhoverBox: Function,
    savePage: Function,
    loadedPage: string,
    resourceDraft: {
        structure: Array<{}>,
    },
    currentResource: string,
    mode: string,
    mergeBoxToPlugin: Function,
    dissolvePluginToBox: Function,
    pluginsStructure?: Array<{}>,
}

const ElementsTree = (props: Props) => {
    const treeData = buildTree(
        props.resourceDraft.structure.map(item => ({
            ...item,
            itemPath: item.path,
            resourceDraft: props.resourceDraft,
            currentResource: props.currentResource,
            mode: props.mode,
            pluginsStructure: props.pluginsStructure,
        }))
    )

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        props.saveElementsStructure(result)
    }

    const [state, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        searchStringHasBeenCleared: true,
    })

    useEffect(() => {
        if (props.findMode && props.fromFrame) {
            setState({
                ...state,
                searchString: props.hoveredElementId,
                searchStringHasBeenCleared: false,
            })
        } else {
            if (!state.searchStringHasBeenCleared) {
                setState({
                    ...state,
                    searchString: '',
                    searchStringHasBeenCleared: true,
                })
            }
        }
    }, [props.hoveredElementId, props.findMode])

    const searchMethod = ({ node, path, treeIndex, searchQuery }) => {
        if (!searchQuery) return false

        if (node.tag.indexOf(searchQuery) > -1) return true
        if (node.properties.id)
            if (node.properties.id.indexOf(searchQuery) > -1) return true
        if (node.properties.class)
            if (node.properties.class.indexOf(searchQuery) > -1) return true
    }

    const searchMethod2 = ({ node, path, treeIndex, searchQuery }) => {
        if (!searchQuery) return false

        if (node.id.indexOf(searchQuery) > -1) return true
    }
    return (
        <>
            <div>
                <SmallButton
                    inline
                    buttonClicked={() => props.toggleFindMode(props.mode)}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.addBox(props.currentResource, props.resourceDraft)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.addBox(
                            props.currentResource,
                            props.resourceDraft,
                            true
                        )
                    }
                    title="Text"
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.duplicateBox(
                            props.currentResource,
                            props.resourceDraft
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                />
                <SmallButton
                    inline
                    title="All"
                    buttonClicked={() =>
                        props.duplicateBox(
                            props.currentResource,
                            props.resourceDraft,
                            true
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                />
                {props.mode === 'page' ? (
                    <>
                        <SmallButton
                            inline
                            title="Merge"
                            buttonClicked={() =>
                                props.mergeBoxToPlugin(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.websiteId
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                        />
                        <SmallButton
                            inline
                            title="Dissolve"
                            buttonClicked={() =>
                                props.dissolvePluginToBox(
                                    props.currentResource,
                                    props.resourceDraft,
                                    props.pluginsStructure,
                                    props.resourcesObjects
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                        />
                    </>
                ) : null}
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.deleteBox(
                            props.currentResource,
                            props.resourceDraft
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                />
                <SmallButton
                    inline
                    title="All"
                    buttonClicked={() =>
                        props.deleteBox(
                            props.currentResource,
                            props.resourceDraft,
                            true
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                />
            </div>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    canDrag={({ node }) =>
                        node.itemPath.length > (node.mode === 'page' ? 1 : 0)
                    }
                    canDrop={({ nextParent }) =>
                        nextParent &&
                        !nextParent.text &&
                        !checkIfCapital(nextParent.tag.charAt(0)) &&
                        nextParent.tag !== 'menu' &&
                        (nextParent.mode !== 'page' ||
                            nextParent.itemPath.length > 0)
                    }
                    scaffoldBlockPxWidth={22}
                    rowHeight={20}
                    generateNodeProps={({ node }) => ({
                        className:
                            node.id === props.resourceDraft.currentBox
                                ? [classes.Chosen]
                                : node.id === props.hoveredElementId
                                ? [classes.Hovered]
                                : null,
                    })}
                    isVirtualized={true}
                    onMoveNode={({ node, treeIndex, path }) =>
                        global.console.debug(
                            'node:',
                            node,
                            'treeIndex:',
                            treeIndex,
                            'path:',
                            path
                        )
                    }
                    searchQuery={state.searchString}
                    searchFocusOffset={state.searchFocusIndex}
                    searchFinishCallback={matches =>
                        setState({
                            ...state,
                            searchFoundCount: matches.length,
                            searchFocusIndex:
                                matches.length > 0
                                    ? state.searchFocusIndex % matches.length
                                    : 0,
                        })
                    }
                    searchMethod={props.findMode ? searchMethod2 : searchMethod}
                />
            </div>
            <TreeSearch state={state} setState={setState} />
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
        addBox: (currentResource, resourceDraft, text) =>
            dispatch(
                actions.addBox(currentResource, resourceDraft, props.mode, text)
            ),
        duplicateBox: (currentResource, resourceDraft, withChildren) =>
            dispatch(
                actions.duplicateBox(
                    currentResource,
                    resourceDraft,
                    props.mode,
                    withChildren
                )
            ),
        mergeBoxToPlugin: (currentResource, resourceDraft, websiteId) =>
            dispatch(
                actions.mergeBoxToPlugin(
                    currentResource,
                    resourceDraft,
                    websiteId,
                    props.mode
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
        deleteBox: (currentResource, resourceDraft, withChildren) =>
            dispatch(
                actions.deleteBox(
                    currentResource,
                    resourceDraft,
                    props.mode,
                    withChildren
                )
            ),
        changeBoxProperty: (key, value) =>
            dispatch(actions.changeBoxProperty(key, value)),
        saveElementsStructure: structure =>
            dispatch(
                actions.saveElementsStructure(
                    structure,
                    props.currentResource,
                    props.resourceDraft
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
