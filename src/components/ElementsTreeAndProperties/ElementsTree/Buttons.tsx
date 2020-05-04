import React, { memo } from 'react'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import Menu from 'antd/es/menu'

// import type {
//     resourceType,
//     initialStateType,
//     elementType,
// } from '../../../store/reducer/reducer'

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
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import FullscreenExitOutlined from '@ant-design/icons/FullscreenExitOutlined'
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import RedoOutlined from '@ant-design/icons/RedoOutlined'

import Divider from 'antd/es/divider'

const Buttons = props => {
    const { handleButtonMenuClick, buttonRules } = props

    const addMenu = (
        <Menu onClick={handleButtonMenuClick}>
            {buttonRules.addText && (
                <Menu.Item key="addText">Add text element (Ctrl + Q)</Menu.Item>
            )}
            {buttonRules.addInside && buttonRules.addNext && (
                <Menu.Item key="addInside">
                    Add inside (Ctrl + Shift + A)
                </Menu.Item>
            )}
            {buttonRules.addNext && buttonRules.addFromCMSVariable && (
                <Menu.Item key="addFromCMS">Add from CMS variable</Menu.Item>
            )}
            {buttonRules.addChildren && (
                <Menu.Item key="addInheritedChildren">
                    Add inherited children
                </Menu.Item>
            )}
            {buttonRules.duplicate && (
                <Menu.Item key="duplicateWithout">
                    Duplicate without children (Ctrl + D)
                </Menu.Item>
            )}
            {buttonRules.duplicate && (
                <Menu.Item key="duplicateWith">
                    Duplicate with children (Ctrl + Shift + D)
                </Menu.Item>
            )}
        </Menu>
    )

    return (
        <>
            {props.mode !== 'page' && (
                <>
                    {/* <SmallButton
                        inline
                        buttonClicked={() => props.toggleFindMode(props.mode)}
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"></path></svg>'
                        tooltip="Select an element on the page"
                    /> */}
                    <SmallButton
                        tooltip={`Add a new element ${
                            buttonRules.addNext ? 'next to' : 'inside'
                        } the chosen element (Ctrl ${
                            buttonRules.addNext ? '' : '+ Shift '
                        }+ A)`}
                        requiredRights={['developer']}
                        icon={<PlusOutlined />}
                        buttonClicked={() =>
                            props.addBox(
                                props.mode,
                                buttonRules.addNext ? null : 'inside'
                            )
                        }
                        overlay={addMenu}
                    />
                    <Divider type="vertical" />
                    {buttonRules.mergeToPlugin ? (
                        <>
                            <SmallButton
                                tooltip="Merge element and children elements into a new plugin"
                                requiredRights={['developer']}
                                icon={<FullscreenExitOutlined />}
                                buttonClicked={() =>
                                    props.mergeBoxToPlugin(props.mode)
                                }
                                overlay={
                                    props.buttonRules.mergeToPluginChildren &&
                                    props.mode !== 'page' ? (
                                        <Menu onClick={handleButtonMenuClick}>
                                            <Menu.Item key="mergeChildren">
                                                Merge children into plugin
                                            </Menu.Item>
                                        </Menu>
                                    ) : null
                                }
                            />
                            <Divider type="vertical" />
                        </>
                    ) : (
                        props.buttonRules.mergeToPluginChildren &&
                        props.mode !== 'page' && (
                            <>
                                <SmallButton
                                    tooltip="Merge children elements into a new plugin"
                                    requiredRights={['developer']}
                                    icon={<FullscreenExitOutlined />}
                                    buttonClicked={() =>
                                        props.mergeBoxToPlugin(props.mode, true)
                                    }
                                />
                                <Divider type="vertical" />
                            </>
                        )
                    )}

                    {buttonRules.dissolve && (
                        <>
                            <SmallButton
                                tooltip="Dissolve the plugin into elements"
                                requiredRights={['developer']}
                                icon={<FullscreenOutlined />}
                                buttonClicked={() =>
                                    props.dissolvePluginToBox(props.mode)
                                }
                            />
                            <Divider type="vertical" />
                        </>
                    )}

                    {props.buttonRules.delete && (
                        <>
                            <SmallButton
                                buttonClicked={() =>
                                    props.deleteBox(props.mode)
                                }
                                icon={<DeleteOutlined />}
                                tooltip="Delete element without children.<br>All children will remain on the page (Delete)"
                                requiredRights={['developer']}
                                overlay={
                                    <Menu onClick={handleButtonMenuClick}>
                                        <Menu.Item key="deleteWith">
                                            Delete with children (Shift +
                                            Delete)
                                        </Menu.Item>
                                    </Menu>
                                }
                            />
                            <Divider type="vertical" />
                        </>
                    )}
                </>
            )}
            <SmallButton
                buttonClicked={() =>
                    props.setState({
                        ...props.state,
                        searchOpen: !props.state.searchOpen,
                    })
                }
                icon={<SearchOutlined />}
                tooltip="Show or hide search (Ctrl + F)"
            />
            <Divider type="vertical" />
            <SmallButton
                buttonClicked={() => props.markShouldRefreshing(true)}
                icon={<RedoOutlined />}
                tooltip="Reload page (Ctrl + R)"
            />
        </>
    )
}
export default memo(Buttons)
