import React, { useState } from 'react'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import isEqual from 'lodash/isEqual'
import * as actions from '../../store/actions/index'
import * as classes from './ResourcesTree.module.css'
import { buildItems } from '../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../UI/TreeSearch/TreeSearch'
import { buildTree, isEqualStructuresWithOmit } from '../../utils/basic'
import checkUserRights from '../../utils/checkUserRights'
import {
    current as currentIndex,
    structure as structureIndex,
    resourceItemIndex,
} from '../../utils/resourceTypeIndex'
import * as wsActions from '../../websocketActions'
import { connect } from 'react-redux'

import OverlayOnSizeIsChanging from '../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'

import buildRelUrls from '../../utils/buildRelUrls'
import Buttons from './Buttons'
import ControlPanel from '../UI/ControlPanel'

// export type Props = {
//     type: 'page' | 'plugin' | 'template',
//     addResource: typeof actions.addResource,
//     duplicateResource: typeof actions.addResource,
//     deleteResource: typeof actions.deleteResource,
//     saveResourcesStructure: typeof actions.saveResourcesStructure,
//     saveResource: typeof actions.saveResource,
//     publishRevertResource: typeof actions.publishRevertResource,
//     revertResourceToSaved: typeof actions.revertResourceToSaved,
// }

const ResourcesTree = props => {
    const {
        structure,
        currentResource,
        currentResourcesStructureElement,
    } = props

    const treeData = buildTree(structure)

    const handleChange = items => {
        let result: Array<{}> = []
        buildItems(items, [], result)
        if (!isEqual(result, structure)) {
            if (!isEqualStructuresWithOmit(result, structure))
                if (!props.checkUserRights(requiredRightsIndex.add)) {
                    return
                }
            if (props.type === 'page') result = buildRelUrls(result, true)
            props.sendUpdate(
                'website',
                {
                    [structureIndex[props.type]]: result,
                },
                props.currentWebsiteId
            )
        }
    }

    const resourceStructureAttributeChange = (key, value) => {
        if (!currentResourcesStructureElement) return
        const newStructure = structure.map(item => {
            if (item.id === currentResource) {
                return {
                    ...item,
                    [key]: value,
                }
            } else {
                if (key === 'homepage') return { ...item, homepage: false }
                else return item
            }
        })
        props.sendUpdate(
            'website',
            {
                [structureIndex[props.type]]: newStructure,
            },
            props.currentWebsiteId
        )
    }

    const handleSaveResource = () => {
        if (!currentResourcesStructureElement) return
        props.sendUpdate(props.type, {}, currentResource)
    }

    const handlePublishRevert = () => {
        if (!currentResourcesStructureElement) return
        props.publishResource(props.type)
    }

    const [state, setState] = useState({
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        searchStringHasBeenCleared: true,
        searchOpen: false,
    })

    const searchMethod = ({ node, searchQuery }) => {
        if (!searchQuery) return false
        if (node.name.indexOf(searchQuery) > -1) return true
    }

    const templateOptions = props.templatesStructure
        .filter(item => !item.generalSettings && !item.hidden)
        .map(item => ({
            label: item.name,
            value: item.name,
        }))

    const canDropHandle = ({ nextParent }) => {
        if (nextParent) if (nextParent.generalSettings) return false
        return true
    }

    const canDragHandle = ({ node }) => {
        if (node.generalSettings) return false
        return true
    }
    const generateNodePropsHandle = ({ node }) => ({
        className:
            node.id === currentResource
                ? props.isFocused
                    ? [classes.Chosen]
                    : [classes.ChosenBlur]
                : null,
        type: props.type,
    })

    const requiredRightsIndex = {
        add: props.type === 'page' ? ['content'] : ['developer'],
        home: ['content'],
    }

    const setActiveAndKeyDown = e => {
        if (e === 'blur') {
            props.unsetActiveContainer(props.type + 'resources')
        } else {
            props.setActiveContainer(props.type + 'resources')
            if (e) {
                if (!props.checkUserRights(requiredRightsIndex.add)) {
                    return
                }

                switch (e.code) {
                    case 'KeyA':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            props.addResource(props.type)
                        }
                        break
                    case 'KeyD':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            props.addResource(props.type, true)
                        }
                        break
                    case 'KeyH':
                        if (e.ctrlKey)
                            if (currentResourcesStructureElement) {
                                e.preventDefault()

                                resourceStructureAttributeChange(
                                    'hidden',
                                    !currentResourcesStructureElement.hidden
                                )
                            }
                        break
                    case 'KeyS':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            handleSaveResource()
                        }
                        break
                    case 'KeyP':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            handlePublishRevert()
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
                    case 'Delete':
                        e.preventDefault()
                        props.deleteResource(props.type)
                        break
                    default:
                        break
                }
            }
        }
    }

    const handleButtonMenuClick = e => {
        if (!props.checkUserRights(requiredRightsIndex.add)) {
            return
        }
        switch (e.key) {
            case 'duplicate':
                props.addResource(props.type, true)
                break
            case 'delete':
                props.deleteResource(props.type)
                break
            case 'homepage':
                resourceStructureAttributeChange('homepage', true)
                break
            case 'hide':
                if (currentResourcesStructureElement)
                    resourceStructureAttributeChange(
                        'hidden',
                        !currentResourcesStructureElement.hidden
                    )
                break
            case 'folder':
                if (currentResourcesStructureElement)
                    resourceStructureAttributeChange(
                        'folderPage',
                        !currentResourcesStructureElement.folderPage
                    )
                break
            case 'propagating':
                if (currentResourcesStructureElement) {
                    if (currentResourcesStructureElement.propagating)
                        if (
                            !window.confirm(
                                'Are you sure you want to turn off propagating of this plugin? This will remove all CMS variables of this plugin.'
                            )
                        )
                            return
                    resourceStructureAttributeChange(
                        'propagating',
                        !currentResourcesStructureElement.propagating
                    )
                }
                break
            case 'search':
                setState({
                    ...state,
                    searchOpen: !state.searchOpen,
                })
                break
            case 'publish':
                handlePublishRevert()
                break
            case 'revertSave':
                props.revertResource(props.type, 'draft')
                break
            case 'revertPublish':
                props.revertResource(props.type, 'published')
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
                {
                    <Buttons
                        handleButtonMenuClick={handleButtonMenuClick}
                        requiredRightsIndex={requiredRightsIndex}
                        currentResourcesStructureElement={
                            currentResourcesStructureElement
                        }
                        resourceStructureAttributeChange={
                            resourceStructureAttributeChange
                        }
                        templateOptions={templateOptions}
                        handleSaveResource={handleSaveResource}
                        currentResource={currentResource}
                        newVersionResources={props.newVersionResources}
                        type={props.type}
                        currentWebsiteObject={props.currentWebsiteObject}
                        revertResource={props.revertResource}
                        checkUserRights={props.checkUserRights}
                        sendUpdate={props.sendUpdate}
                        publishResource={props.publishResource}
                        addResource={props.addResource}
                        deleteResource={props.deleteResource}
                        isGlobalSettingsPage={props.isGlobalSettingsPage}
                    />
                }
            </ControlPanel>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    scaffoldBlockPxWidth={22}
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
                    style={{
                        flex: '1 1',
                        height: 'auto !important',
                    }}
                    canDrag={canDragHandle}
                    canDrop={canDropHandle}
                    generateNodeProps={generateNodePropsHandle}
                    slideRegionSize={20}
                />
                <OverlayOnSizeIsChanging />
            </div>
            {state.searchOpen ? (
                <TreeSearch state={state} setState={setState} />
            ) : null}
        </div>
    )
}

const mapStateToProps = (state, props) => {
    return {
        newVersionResources: state.newVersionResources,
        structure: state.mD[structureIndex[props.type]],
        currentResource: state.mD[currentIndex[props.type]],
        isGlobalSettingsPage:
            state.mD[currentIndex[props.type]] ===
                state.mD.globalSettingsPageId ||
            state.mD[currentIndex[props.type]] ===
                state.mD.globalSettingsTemplateId,
        currentWebsiteId: state.mD.currentWebsiteId,
        currentWebsiteObject: state.mD.currentWebsiteObject,
        currentResourcesStructureElement:
            state.mD[resourceItemIndex[props.type]],
        templatesStructure: state.mD.templatesStructure,
        isFocused: state.activeContainer === props.type + 'resources',
    }
}

const mapDispatchToProps = dispatch => {
    return {
        revertResource: (mD, type, to) =>
            dispatch(wsActions.revertResource(mD, type, to)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
        sendUpdate: (type, newResource, id) =>
            dispatch(wsActions.sendUpdate(type, newResource, id)),
        publishResource: type => dispatch(wsActions.publishResource(type)),
        addResource: (type, withChildren) =>
            dispatch(wsActions.addResource(type, withChildren)),
        deleteResource: type => dispatch(wsActions.deleteResource(type)),
        setActiveContainer: container =>
            dispatch(actions.setActiveContainer(container)),
        unsetActiveContainer: container =>
            dispatch(actions.unsetActiveContainer(container)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourcesTree)
