import React, { useState, useRef } from 'react'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import * as actions from '../../../store/actions/index'
import * as classes from './FilesTree.module.css'
import * as buttonClasses from '../../UI/Buttons/SmallButton/SmallButton.module.css'
import SmallButton, {
    tooltipOverwritePositions,
} from '../../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../../UI/TreeSearch/TreeSearch'
import { buildTree } from '../../../utils/basic'
import checkUserRights from '../../../utils/checkUserRights'
import * as wsActions from '../../../websocketActions'
import { connect } from 'react-redux'

import Svg from '../../../components/Svg/Svg'
import copyToClipboard from '../../../utils/copyToClipboard'
import OverlayOnSizeIsChanging from '../../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
import ReactTooltip from 'react-tooltip'
import { getFileUrl } from '../../../utils/getFileUrl'

const FilesTree = props => {
    const {
        structure,
        currentResource,
        currentResourcesStructureElement,
    } = props
    const treeData = buildTree(structure)

    const handleChange = items => {
        const result = []
        buildItems(items, [], result)
        if (!isEqual(result, structure)) {
            if (
                !isEqual(
                    result.map(item =>
                        omit(item, ['expanded', 'children', 'itemPath'])
                    ),
                    structure.map(item =>
                        omit(item, ['expanded', 'children', 'itemPath'])
                    )
                )
            )
                if (!props.checkUserRights(['content', 'developer'])) {
                    return
                }

            props.sendUpdate(
                'website',
                {
                    filesStructure: result,
                },
                props.currentWebsiteId
            )
        }
    }

    const handleCopyPath = () => {
        if (currentResourcesStructureElement) {
            const path = getFileUrl(
                props.structure,
                currentResourcesStructureElement.id,
                true
            )
            // currentResourcesStructureElement.path.reduce(
            //     (totalPath, item) => (totalPath = totalPath + '/' + item.name),
            //     '/'
            // )
            // + currentResourcesStructureElement.name
            copyToClipboard(path)
        }
    }

    const createFile = () => {
        const file = new File([''], 'New file.css', {
            type: 'text/css',
        })
        props.uploadFile([file])
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

    const generateNodePropsHandle = ({ node }) => ({
        className:
            node.id === currentResource
                ? props.isFocused
                    ? [classes.Chosen]
                    : [classes.ChosenBlur]
                : null,
        type: props.type,
    })

    const setActiveAndKeyDown = e => {
        if (e === 'blur') {
            props.unsetActiveContainer('filesresources')
        } else {
            props.setActiveContainer('filesresources')
            if (e) {
                const code = e.code

                if (!props.checkUserRights(['content', 'developer'])) {
                    return
                }

                switch (code) {
                    case 'KeyA':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            if (e.shiftKey) {
                                createFile()
                            } else {
                                if (fileUploadRef.current)
                                    fileUploadRef.current.click()
                            }
                        }
                        break
                    case 'KeyS':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            props.saveFile(currentResource, !e.shiftKey)
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
                        props.deleteFile(currentResource)
                        break
                    case 'KeyL':
                        if (e.ctrlKey) {
                            e.preventDefault()
                            handleCopyPath()
                        }
                        break
                    default:
                        break
                }
            }
        }
    }
    const fileUploadRef = useRef(null)

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
            <div>
                <label
                    data-tip="Upload file"
                    className={[
                        classes.ImageContainer,
                        buttonClasses.Button,
                        buttonClasses.Inline,
                    ].join(' ')}
                >
                    <input
                        ref={fileUploadRef}
                        className={classes.ImageInput}
                        type="file"
                        onChange={e => {
                            if (props.checkUserRights(['developer', 'content']))
                                props.uploadFile(e.target.files)
                        }}
                    />
                    <Svg
                        className={buttonClasses.Svg}
                        icon='<svg height="20" viewBox="0 0 24 24" width="20"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" ></path></svg>'
                    />
                </label>
                {!props.tooltipsOff ? (
                    <ReactTooltip
                        effect="solid"
                        multiline={true}
                        place="top"
                        className={buttonClasses.Tooltip}
                        delayShow={250}
                        overridePosition={tooltipOverwritePositions}
                    />
                ) : null}
                <SmallButton
                    inline
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                    buttonClicked={createFile}
                    tooltip="Create new file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                    buttonClicked={() => props.saveFile(currentResource, true)}
                    tooltip="Save file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10,14H8.5H5v-3.8C5,10.1,5.1,10,5.3,10h3.3H10V9H4.5C4.2,9,4,9.2,4,9.5V14H2V2h2v3.5C4,5.8,4.2,6,4.5,6h5   C9.8,6,10,5.8,10,5.5V2h0.8c0.3,0,0.5,0.1,0.7,0.3l1.9,2C13.8,4.7,14,5.2,14,5.7v2.8V10h1V5.4c0-0.5-0.2-1-0.6-1.4l-2.4-2.4   C11.7,1.2,11.2,1,10.7,1H1.5C1.2,1,1,1.2,1,1.5v13C1,14.8,1.2,15,1.5,15H10V14z M7,2.3C7,2.1,7.1,2,7.3,2h1.5C8.9,2,9,2.1,9,2.3   v2.5C9,4.9,8.9,5,8.8,5H7.3C7.1,5,7,4.9,7,4.8V2.3z"></path></svg>'
                    buttonClicked={() => props.saveFile(currentResource)}
                    tooltip="Save as a new file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg height="20" viewBox="0 0 24 24" width="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" ></path></svg>'
                    buttonClicked={() => props.deleteFile(currentResource)}
                    tooltip="Delete file"
                    requiredRights={['developer', 'content']}
                />
                <SmallButton
                    inline
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>'
                    buttonClicked={() =>
                        setState({
                            ...state,
                            searchOpen: !state.searchOpen,
                        })
                    }
                    tooltip="Show or hide search (Ctrl + F)"
                />
                <SmallButton
                    inline
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></svg>'
                    buttonClicked={handleCopyPath}
                    tooltip="Copy path to the media file to clipboard.<br>You can paste it where needed."
                    requiredRights={['developer', 'content']}
                />
            </div>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={handleChange}
                    nodeContentRenderer={ItemRenderer}
                    scaffoldBlockPxWidth={22}
                    isVirtualized={true}
                    rowHeight={40}
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
                        overflow: 'auto',
                    }}
                    generateNodeProps={generateNodePropsHandle}
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
        structure: state.mD.filesStructure,
        currentResource: state.mD.currentFileId,
        currentWebsiteId: state.mD.currentWebsiteId,
        currentResourcesStructureElement: state.mD.currentFileItem,
        isFocused: state.activeContainer === 'filesresources',
        tooltipsOff: state.mD.tooltipsOff,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
        setActiveContainer: container =>
            dispatch(actions.setActiveContainer(container)),
        unsetActiveContainer: container =>
            dispatch(actions.unsetActiveContainer(container)),
        uploadFile: files => dispatch(actions.uploadFile(files)),
        deleteFile: file => dispatch(actions.deleteFile(file)),
        sendUpdate: (type, newResource, id) =>
            dispatch(wsActions.sendUpdate(type, newResource, id)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilesTree)
