import React, { useState, useRef } from 'react'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import * as actions from '../../../store/actions/index'
import * as classes from './FilesTree.module.css'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import { buildItems } from '../../../utils/pagesStructure'
import ItemRenderer from './ItemRenderer'
import { TreeSearch } from '../../UI/TreeSearch/TreeSearch'
import { buildTree } from '../../../utils/basic'
import checkUserRights from '../../../utils/checkUserRights'
import * as wsActions from '../../../websocketActions'
import { connect } from 'react-redux'

import copyToClipboard from '../../../utils/copyToClipboard'
import OverlayOnSizeIsChanging from '../../UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
import { getFileUrl } from '../../../utils/getFileUrl'
import buildRelUrls from '../../../utils/buildRelUrls'
import ControlPanel from '../../UI/ControlPanel'

import Dropdown from 'antd/es/dropdown'
import Menu from 'antd/es/menu'
import Button from 'antd/es/button'
import Divider from 'antd/es/divider'
import UploadOutlined from '@ant-design/icons/UploadOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import LinkOutlined from '@ant-design/icons/LinkOutlined'
import DownOutlined from '@ant-design/icons/DownOutlined'

const FilesTree = props => {
    const {
        structure,
        currentResource,
        currentResourcesStructureElement,
    } = props
    const treeData = buildTree(structure)

    const handleChange = items => {
        let result = []
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
            result = buildRelUrls(result)
            props.sendUpdate(
                'website',
                {
                    filesStructure: result,
                },
                props.currentWebsiteId
            )
        }
    }

    const handleCopyPath = thumbnail => {
        if (currentResourcesStructureElement) {
            const path = getFileUrl(
                props.structure,
                currentResourcesStructureElement.id,
                true,
                thumbnail
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

    const [state, setState] = useState({
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

    const handleButtonMenuClick = e => {
        if (!props.checkUserRights(['developer', 'content'])) {
            return
        }
        switch (e.key) {
            case 'create':
                createFile()
                break
            case 'saveNew':
                props.saveFile(currentResource)
                break
            case 'delete':
                props.deleteFile(currentResource)
                break

            case 'search':
                setState({
                    ...state,
                    searchOpen: !state.searchOpen,
                })
                break
            case 'linkThumbnail':
                handleCopyPath(true)
                break
            default:
                break
        }
    }

    const moreMenu = (
        <Menu onClick={handleButtonMenuClick}>
            {currentResourcesStructureElement && (
                <Menu.Item key="create">
                    Create new file (Ctrl + Shift + A)
                </Menu.Item>
            )}
            {currentResourcesStructureElement && (
                <Menu.Item key="saveNew">Save as new</Menu.Item>
            )}
            {currentResourcesStructureElement && (
                <Menu.Item key="delete">Delete file (Delete)</Menu.Item>
            )}
            <Menu.Item key="search">Show or hide search (Ctrl + F)</Menu.Item>
        </Menu>
    )
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
                <input
                    ref={fileUploadRef}
                    className={classes.ImageInput}
                    type="file"
                    onChange={e => {
                        if (props.checkUserRights(['developer', 'content']))
                            props.uploadFile(e.target.files)
                    }}
                />
                <SmallButton
                    icon={<UploadOutlined />}
                    title="Upload"
                    buttonClicked={() =>
                        fileUploadRef.current && fileUploadRef.current.click()
                    }
                    tooltip="Upload a new file (Ctrl + A)"
                />
                <Divider type="vertical" />
                <SmallButton
                    title="Save"
                    icon={<SaveOutlined />}
                    buttonClicked={() => props.saveFile(currentResource, true)}
                    tooltip="Save file (Ctrl + S)"
                    requiredRights={['developer', 'content']}
                />
                <Divider type="vertical" />

                <SmallButton
                    title="Link"
                    icon={<LinkOutlined />}
                    buttonClicked={handleCopyPath}
                    tooltip="Copy path to the path to clipboard. You can paste it where needed. (Ctrl + L)"
                    requiredRights={['developer', 'content']}
                    overlay={
                        <Menu onClick={handleButtonMenuClick}>
                            <Menu.Item key="linkThumbnail">
                                Link to thumbnail (220px X 220px)
                            </Menu.Item>
                        </Menu>
                    }
                />
                <Divider type="vertical" />
                <Dropdown overlay={moreMenu}>
                    <Button size="small">
                        More <DownOutlined />
                    </Button>
                </Dropdown>
            </ControlPanel>
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
        structure: state.mD.filesStructure,
        currentResource: state.mD.currentFileId,
        currentWebsiteId: state.mD.currentWebsiteId,
        currentResourcesStructureElement: state.mD.currentFileItem,
        isFocused: state.activeContainer === 'filesresources',
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
