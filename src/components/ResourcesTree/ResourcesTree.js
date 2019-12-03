import React, { useState } from 'react'
import { connect } from 'react-redux'
import SortableTree from 'react-sortable-tree'
// import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import 'react-sortable-tree/style.css'

import * as actions from '../../store/actions/index'
import * as classes from './ResourcesTree.module.css'
import withDragDropContext from '../../hoc/withDragDropContext'
import SmallButton from '../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../UI/TreeSearch/TreeSearch'
import { buildTree } from '../../utils/basic'
import type { resourcesStructureType } from '../../../flowTypes'

type Props = {
    addResource: Function,
    duplicateResource: Function,
    deleteResource: Function,
    saveResourcesStructure: Function,
    structure: resourcesStructureType,
    resourcesObjects: {},
    currentResource: string,
    loadedWebsite: String,
    value: {},
    type: string,
    saveResource: Function,
    publishRevertResource: Function,
    revertResourceToSaved: Function,
}

const ResourcesTree = (props: Props) => {
    const treeData = buildTree(props.structure)

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        props.saveResourcesStructure(
            props.loadedWebsite,
            result,
            props.structure
        )
    }

    let currentResourcesStructureElement
    if (props.currentResource) {
        currentResourcesStructureElement = props.structure.find(
            item => item.id === props.currentResource
        )
    }
    const resourceStructureAttributeChange = (key, value) => {
        if (!currentResourcesStructureElement) return
        const newStructure = props.structure.map(item => {
            if (item.id === props.currentResource) {
                return {
                    ...item,
                    [key]: value,
                }
            } else {
                if (key === 'homepage') return { ...item, homepage: false }
                else return item
            }
        })
        props.saveResourcesStructure(
            props.loadedWebsite,
            newStructure,
            props.structure
        )
    }

    const handleSaveResource = () => {
        if (!currentResourcesStructureElement) return
        const newStructure = props.structure.map(item => {
            if (item.id === props.currentResource)
                return { ...item, notPublished: true }
            else return item
        })
        props.saveResource(newStructure, props.resourcesObjects)
    }

    const handlePublishRevert = (revert?: boolean) => {
        if (!currentResourcesStructureElement) return
        const newStructure = props.structure.map(item => {
            if (item.id === props.currentResource)
                return { ...item, notPublished: false }
            else return item
        })
        props.publishRevertResource(
            newStructure,
            revert,
            props.resourcesObjects
        )
    }

    const [state, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
    })

    const searchMethod = ({ node, path, treeIndex, searchQuery }) => {
        if (!searchQuery) return false
        if (node.name.indexOf(searchQuery) > -1) return true
    }

    return (
        <>
            <div>
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.addResource(
                            props.loadedWebsite,
                            props.currentResource
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.duplicateResource(
                            props.loadedWebsite,
                            props.currentResource
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.deleteResource(props.currentResource)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                />
                {props.type === 'page' ? (
                    <>
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                resourceStructureAttributeChange(
                                    'homepage',
                                    true
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>'
                        />
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                resourceStructureAttributeChange(
                                    'hidden',
                                    !currentResourcesStructureElement.hidden
                                )
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>'
                        />
                    </>
                ) : null}
                <SmallButton
                    inline
                    buttonClicked={() => handleSaveResource()}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() => handlePublishRevert()}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() => handlePublishRevert(true)}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></svg>'
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.revertResourceToSaved(props.resourcesObjects)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></svg>'
                />
            </div>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    scaffoldBlockPxWidth={22}
                    generateNodeProps={({ node }) => ({
                        className:
                            node.id === props.currentResource
                                ? [classes.Chosen]
                                : null,
                        type: props.type,
                    })}
                    isVirtualized={true}
                    rowHeight={20}
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
                    searchMethod={searchMethod}
                />
            </div>
            <TreeSearch state={state} setState={setState} />
        </>
    )
}

const mapStateToProps = state => {
    return {
        loadedWebsite: state.loadedWebsite,
        resourcesObjects: state.resourcesObjects,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addResource: (websiteId, currentId) =>
            dispatch(actions.addResource(websiteId, currentId, props.type)),
        duplicateResource: (websiteId, currentId) =>
            dispatch(
                actions.addResource(websiteId, currentId, props.type, true)
            ),
        deleteResource: currentId =>
            dispatch(actions.deleteResource(currentId, props.type)),
        saveResourcesStructure: (websiteId, newStructure, oldStructure) =>
            dispatch(
                actions.saveResourcesStructure(
                    websiteId,
                    newStructure,
                    oldStructure,
                    props.type
                )
            ),
        saveResource: (structure, resourcesObjects) =>
            dispatch(
                actions.saveResource(
                    props.currentResource,
                    resourcesObjects,
                    structure,
                    props.type
                )
            ),
        publishRevertResource: (structure, revert, resourcesObjects) =>
            dispatch(
                actions.publishRevertResource(
                    props.currentResource,
                    structure,
                    props.type,
                    revert,
                    resourcesObjects
                )
            ),
        revertResourceToSaved: resourcesObjects =>
            dispatch(
                actions.revertResourceToSaved(
                    props.currentResource,
                    resourcesObjects
                )
            ),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResourcesTree)
)
