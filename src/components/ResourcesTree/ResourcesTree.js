import React, { useState } from 'react'
import { connect } from 'react-redux'
import SortableTree from 'react-sortable-tree'

import * as actions from '../../store/actions/index'
import * as classes from './ResourcesTree.module.css'
import withDragDropContext from '../../hoc/withDragDropContext'
import SmallButton from '../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../UI/TreeSearch/TreeSearch'
import { buildTree } from '../../utils/basic'

import type { initialStateType } from '../../store/reducer/reducer'
import type { State } from '../ElementsTreeAndProperties/ElementsTree/ElementsTree'

export type Props = {
    structure:
        | $PropertyType<initialStateType, 'pagesStructure'>
        | $PropertyType<initialStateType, 'pluginsStructure'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    currentResource:
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentPlugin'>,
    loadedWebsite: $PropertyType<initialStateType, 'loadedWebsite'>,
    type: 'page' | 'plugin',
    addResource: typeof actions.addResource,
    duplicateResource: typeof actions.addResource,
    deleteResource: typeof actions.deleteResource,
    saveResourcesStructure: typeof actions.saveResourcesStructure,
    saveResource: typeof actions.saveResource,
    publishRevertResource: typeof actions.publishRevertResource,
    revertResourceToSaved: typeof actions.revertResourceToSaved,
}

const ResourcesTree = (props: Props) => {
    const treeData = buildTree(props.structure)

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        props.saveResourcesStructure(
            props.loadedWebsite,
            result,
            props.structure,
            props.type
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
            props.structure,
            props.type
        )
    }

    const handleSaveResource = () => {
        if (!currentResourcesStructureElement) return
        const newStructure = props.structure.map(item => {
            if (item.id === props.currentResource)
                return { ...item, notPublished: true }
            else return item
        })
        props.saveResource(
            props.currentResource,
            props.resourcesObjects,
            newStructure,
            props.type
        )
    }

    const handlePublishRevert = (revert?: boolean) => {
        if (!currentResourcesStructureElement) return
        const newStructure = props.structure.map(item => {
            if (item.id === props.currentResource)
                return { ...item, notPublished: false }
            else return item
        })
        props.publishRevertResource(
            props.currentResource,
            newStructure,
            props.type,
            revert,
            props.resourcesObjects
        )
    }

    const [state: State, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        searchStringHasBeenCleared: true,
        searchOpen: false,
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
                            props.currentResource,
                            props.type
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                    tooltip="Add new resource (page or plugin)"
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.duplicateResource(
                            props.loadedWebsite,
                            props.currentResource,
                            props.type
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                    tooltip="Duplicate resource"
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.deleteResource(props.currentResource, props.type)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                    tooltip="Delete resource"
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
                            tooltip="Set as the homepage"
                        />
                        <SmallButton
                            inline
                            buttonClicked={() => {
                                if (currentResourcesStructureElement)
                                    resourceStructureAttributeChange(
                                        'hidden',
                                        !currentResourcesStructureElement.hidden
                                    )
                            }}
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>'
                            tooltip="Make hidden or visible. <br>Hidden resources do not influence other resources."
                        />
                    </>
                ) : null}
                <SmallButton
                    inline
                    buttonClicked={() => handleSaveResource()}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                    tooltip="Save all changes in the resource.<br>Saved changes are not visible on the live version if they are not published."
                />
                <SmallButton
                    inline
                    buttonClicked={() => handlePublishRevert()}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></svg>'
                    tooltip="Publish last saved changes of the resource."
                />
                <SmallButton
                    inline
                    buttonClicked={() => handlePublishRevert(true)}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.2,8c-3.8,0-6.8,3.1-6.8,6.8c0,3.8,3,6.8,6.8,6.8s6.8-3.1,6.8-6.8S19,8,15.2,8z M19.9,12.1h-2c-0.2-0.9-0.5-1.7-0.9-2.4   C18.2,10.1,19.3,11,19.9,12.1z M15.2,9.4c0.6,0.8,1,1.7,1.3,2.7h-2.6C14.2,11.2,14.7,10.3,15.2,9.4z M13.5,9.7   c-0.5,0.8-0.8,1.6-1,2.4h-2C11.2,11,12.2,10.1,13.5,9.7z M9.9,16.2c-0.1-0.4-0.2-0.9-0.2-1.4s0.1-0.9,0.2-1.4h2.3   c-0.1,0.4-0.1,0.9-0.1,1.4s0,0.9,0.1,1.4H9.9z M10.5,17.6h2c0.2,0.9,0.5,1.7,0.9,2.4C12.2,19.6,11.2,18.7,10.5,17.6z M15.2,20.3   c-0.6-0.8-1-1.7-1.3-2.7h2.6C16.2,18.6,15.8,19.5,15.2,20.3z M16.8,16.2h-3.2c-0.1-0.4-0.1-0.9-0.1-1.4s0-0.9,0.1-1.4h3.2   c0.1,0.4,0.1,0.9,0.1,1.4S16.9,15.8,16.8,16.2z M17,20c0.4-0.8,0.7-1.6,0.9-2.4h2C19.3,18.7,18.2,19.6,17,20z M18.2,16.2   c0.1-0.4,0.1-0.9,0.1-1.4s0-0.9-0.1-1.4h2.3c0.1,0.4,0.2,0.9,0.2,1.4s-0.1,0.9-0.2,1.4H18.2z M9,10.6H2V3.5l2,2   c4-3.1,8.1-2.1,11.1,0C12.1,5,9.5,6,7,8.5L9,10.6z"></path></svg>'
                    tooltip="Revert resource to the last published version"
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.revertResourceToSaved(
                            props.currentResource,
                            props.resourcesObjects
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M18.6,10.1h-7.3c-0.7,0-1.2,0.5-1.2,1.2v8.5c0,0.7,0.5,1.2,1.2,1.2h8.5c0.7,0,1.2-0.5,1.2-1.2v-7.3L18.6,10.1z M15.6,19.8   c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C17.4,19,16.6,19.8,15.6,19.8z M17.4,13.7h-6v-2.4h6V13.7z    M10.1,10.1H3V3l2,2c4-3,8.1-2,11.1,0c-3-0.5-5.6,0.5-8.1,3L10.1,10.1z"></path></svg>'
                    tooltip="Revert resource to the last saved version"
                />
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
            {state.searchOpen ? (
                <TreeSearch state={state} setState={setState} />
            ) : null}
        </>
    )
}

const mapStateToProps = state => {
    return {
        loadedWebsite: state.loadedWebsite,
        resourcesObjects: state.resourcesObjects,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addResource: (websiteId, currentId, type) =>
            dispatch(actions.addResource(websiteId, currentId, type)),
        duplicateResource: (websiteId, currentId, type) =>
            dispatch(actions.addResource(websiteId, currentId, type, true)),
        deleteResource: (currentId, type) =>
            dispatch(actions.deleteResource(currentId, type)),
        saveResourcesStructure: (websiteId, newStructure, oldStructure, type) =>
            dispatch(
                actions.saveResourcesStructure(
                    websiteId,
                    newStructure,
                    oldStructure,
                    type
                )
            ),
        saveResource: (currentResource, resourcesObjects, structure, type) =>
            dispatch(
                actions.saveResource(
                    currentResource,
                    resourcesObjects,
                    structure,
                    type
                )
            ),
        publishRevertResource: (
            currentResource,
            structure,
            type,
            revert,
            resourcesObjects
        ) =>
            dispatch(
                actions.publishRevertResource(
                    currentResource,
                    structure,
                    type,
                    revert,
                    resourcesObjects
                )
            ),
        revertResourceToSaved: (currentResource, resourcesObjects) =>
            dispatch(
                actions.revertResourceToSaved(currentResource, resourcesObjects)
            ),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResourcesTree)
)
