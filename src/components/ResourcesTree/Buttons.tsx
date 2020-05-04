import React, { useState, memo } from 'react'
import Modal from 'antd/es/modal'
import Menu from 'antd/es/menu'
import Select from 'antd/es/select'
import Dropdown from 'antd/es/dropdown'
import Button from 'antd/es/button'
import Tooltip from 'antd/es/tooltip'
import copyToClipboard from '../../utils/copyToClipboard'
import Divider from 'antd/es/divider'

import PlusOutlined from '@ant-design/icons/PlusOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import LinkOutlined from '@ant-design/icons/LinkOutlined'
import DownOutlined from '@ant-design/icons/DownOutlined'
import CopyOutlined from '@ant-design/icons/CopyOutlined'
import DesktopOutlined from '@ant-design/icons/DesktopOutlined'
import CloudDownloadOutlined from '@ant-design/icons/CloudDownloadOutlined'
import SmallButton from '../UI/Buttons/SmallButton/SmallButton'

const Buttons = props => {
    const [linkModalVisible, setLinkModalVisible] = useState(false)
    const {
        requiredRightsIndex,
        handleButtonMenuClick,
        currentResourcesStructureElement,
        resourceStructureAttributeChange,
        templateOptions,
        handleSaveResource,
        currentResource,
    } = props

    const linkModal = currentResourcesStructureElement && (
        <Modal
            title={currentResourcesStructureElement.name + ' links'}
            visible={linkModalVisible}
            onOk={() => setLinkModalVisible(false)}
            onCancel={() => setLinkModalVisible(false)}
            width={800}
        >
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td>Relative url</td>
                        <td>
                            <span style={{ userSelect: 'all' }}>
                                {currentResourcesStructureElement.relUrl}
                            </span>
                        </td>
                        <td>
                            <SmallButton
                                icon={<CopyOutlined />}
                                buttonClicked={() =>
                                    copyToClipboard(
                                        currentResourcesStructureElement.relUrl
                                    )
                                }
                                tooltip="Copy."
                            />
                        </td>
                    </tr>
                    {props.currentWebsiteObject.customDomain ? (
                        <tr>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                Custom domain url
                            </td>
                            <td>
                                <span
                                    style={{
                                        userSelect: 'all',
                                    }}
                                >
                                    {'https://' +
                                        props.currentWebsiteObject
                                            .customDomain +
                                        '/' +
                                        currentResourcesStructureElement.relUrl}
                                </span>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <SmallButton
                                    icon={<CopyOutlined />}
                                    buttonClicked={() =>
                                        copyToClipboard(
                                            'https://' +
                                                props.currentWebsiteObject
                                                    .customDomain +
                                                '/' +
                                                currentResourcesStructureElement.relUrl
                                        )
                                    }
                                    tooltip="Copy."
                                />
                                <SmallButton
                                    icon={<DesktopOutlined />}
                                    buttonClicked={() => {
                                        window.open(
                                            'https://' +
                                                props.currentWebsiteObject
                                                    .customDomain +
                                                '/' +
                                                currentResourcesStructureElement.relUrl,
                                            '_blank'
                                        )
                                    }}
                                    tooltip="Open in a new tab"
                                />
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            Local domain url
                        </td>
                        <td>
                            <span style={{ userSelect: 'all' }}>
                                {'http://live.websiter.test:5000/' +
                                    props.currentWebsiteObject.domain +
                                    '/' +
                                    currentResourcesStructureElement.relUrl}
                            </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <SmallButton
                                icon={<CopyOutlined />}
                                buttonClicked={() =>
                                    copyToClipboard(
                                        'http://live.websiter.test:5000/' +
                                            props.currentWebsiteObject.domain +
                                            '/' +
                                            currentResourcesStructureElement.relUrl
                                    )
                                }
                                tooltip="Copy."
                            />
                            <SmallButton
                                icon={<DesktopOutlined />}
                                buttonClicked={() => {
                                    window.open(
                                        'http://live.websiter.test:5000/' +
                                            props.currentWebsiteObject.domain +
                                            '/' +
                                            currentResourcesStructureElement.relUrl,
                                        '_blank'
                                    )
                                }}
                                tooltip="Open in a new tab"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    )

    const saveManu = currentResourcesStructureElement && (
        <Menu onClick={handleButtonMenuClick}>
            <Menu.Item key="publish">Publish</Menu.Item>
            <Menu.Item key="revertSave">Revert to saved</Menu.Item>
            <Menu.Item key="revertPublish">Revert to published</Menu.Item>
        </Menu>
    )

    const moreMenu = (
        <Menu onClick={handleButtonMenuClick}>
            {!props.isGlobalSettingsPage &&
                currentResourcesStructureElement && (
                    <Menu.Item key="duplicate">
                        Duplicate resource (Ctrl + D)
                    </Menu.Item>
                )}
            {!props.isGlobalSettingsPage &&
                currentResourcesStructureElement && (
                    <Menu.Item key="delete">Delete resource (Delete)</Menu.Item>
                )}
            {props.type === 'page' &&
                !props.isGlobalSettingsPage &&
                currentResourcesStructureElement && (
                    <Menu.Item key="homepage">Set as the homepage</Menu.Item>
                )}
            {!props.isGlobalSettingsPage &&
                currentResourcesStructureElement && (
                    <Menu.Item key="hide">Hide/Show</Menu.Item>
                )}
            {props.type === 'page' &&
                currentResourcesStructureElement &&
                currentResourcesStructureElement.hidden &&
                !props.isGlobalSettingsPage &&
                currentResourcesStructureElement && (
                    <Menu.Item key="folder">Folder</Menu.Item>
                )}
            {props.type === 'plugin' && currentResourcesStructureElement && (
                <Menu.Item key="propagating">Propagating plugin</Menu.Item>
            )}
            <Menu.Item key="search">Search</Menu.Item>
        </Menu>
    )

    return (
        <>
            <SmallButton
                buttonClicked={() => props.addResource(props.type)}
                icon={<PlusOutlined />}
                tooltip="Add new resource (page, template or plugin) (Ctrl + A)"
                requiredRights={requiredRightsIndex.add}
            />
            <Divider type="vertical" />
            {props.type === 'page' && currentResourcesStructureElement ? (
                !currentResourcesStructureElement.generalSettings ? (
                    <>
                        <Tooltip title="Choose template" mouseEnterDelay={0.2}>
                            <Select
                                showSearch
                                onSelect={value => {
                                    if (
                                        window.confirm(
                                            'All unsaved edits on this page will be deleted. Are you sure you want to change the template?'
                                        )
                                    )
                                        resourceStructureAttributeChange(
                                            'template',
                                            value
                                        )
                                }}
                                value={
                                    currentResourcesStructureElement.template
                                }
                                dropdownMatchSelectWidth={false}
                                //requiredRights={['content']}
                                size="small"
                                placeholder="Template"
                                style={{ width: 120 }}
                            >
                                {templateOptions.map(option => (
                                    <Select.Option
                                        key={'select' + option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Tooltip>
                        <Divider type="vertical" />
                    </>
                ) : null
            ) : null}

            <SmallButton
                tooltip="Save all changes in the resource.<br>Saved changes are not visible on the live version if they are not published. (Ctrl + S)"
                requiredRights={requiredRightsIndex.add}
                icon={<SaveOutlined />}
                buttonClicked={() => handleSaveResource()}
                overlay={saveManu}
            />
            <Divider type="vertical" />
            {props.newVersionResources.includes(currentResource) ? (
                <>
                    <SmallButton
                        buttonClicked={() =>
                            props.revertResource(props.type, 'draft')
                        }
                        icon={<CloudDownloadOutlined />}
                        tooltip="A new version of this resource is available. Press the button to load the new version."
                    />
                    <Divider type="vertical" />
                </>
            ) : null}
            {props.type === 'page' &&
            !props.isGlobalSettingsPage &&
            currentResourcesStructureElement ? (
                <>
                    <SmallButton
                        buttonClicked={() => setLinkModalVisible(true)}
                        icon={<LinkOutlined />}
                        tooltip="Copy link to page or visit page."
                    />
                    {linkModal}
                    <Divider type="vertical" />
                </>
            ) : null}

            <Dropdown overlay={moreMenu}>
                <Button>
                    More <DownOutlined />
                </Button>
            </Dropdown>
        </>
    )
}

export default memo(Buttons)
