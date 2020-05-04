import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../../store/actions/index'
import * as classes from './SharingProperties.module.css'
import SmallButton from '../../../../../components/UI/Buttons/SmallButton/SmallButton'
import * as wsActions from '../../../../../websocketActions'
import Divider from 'antd/es/divider'
import ControlPanel from '../../../../../components/UI/ControlPanel'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import SendOutlined from '@ant-design/icons/SendOutlined'
import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined'
import Switch from 'antd/es/switch'
// type Props = {
//     currentUserInWebsiteSharing: string,
//     chooseUserInWebsiteSharing: typeof actions.chooseUserInWebsiteSharing,
// }

const SharingProperties = props => {
    let website = props.currentWebsiteObject
    if (!website) return null
    let isOwner
    let sharingItem = {
        rights: [],
    }
    const newSharing = [...website.sharing]
    let ownerAccount = newSharing.find(item => item.userId === website.user)
    if (!ownerAccount) {
        ownerAccount = {
            userId: website.user,
            rights: ['owner', 'admin', 'developer', 'content'],
        }
        newSharing.unshift(ownerAccount)
        props.changeWebsiteProperty('sharing', newSharing)
    }

    if (website.user === props.userId) isOwner = true
    sharingItem =
        newSharing.find(item => item.userId === props.userId) || sharingItem

    return props.currentWebsiteId && website ? (
        isOwner || sharingItem.rights.includes('admin') ? (
            <div style={{ width: '100%' }}>
                <ControlPanel>
                    <SmallButton
                        icon={<ShareAltOutlined />}
                        buttonClicked={() => props.addUserInWebsiteSharing()}
                        tooltip="Share the website with a new user. You need to know the user's id which can be found in the user's Account menu tab. The user will need to refresh page in browser to see the shared website."
                        requiredRights={['admin', 'user']}
                        title="Share"
                    />
                    <Divider type="vertical" />

                    <SmallButton
                        icon={<DeleteOutlined />}
                        buttonClicked={() => {
                            if (
                                props.currentUserInWebsiteSharing ===
                                website.user
                            )
                                return
                            props.deleteUserInWebsiteSharing(
                                props.currentUserInWebsiteSharing
                            )
                        }}
                        tooltip="Stop sharing the website with this user."
                        requiredRights={['admin', 'user']}
                        title="Delete"
                    />
                    {website.user === props.userId && (
                        <>
                            <Divider type="vertical" />

                            <SmallButton
                                icon={<SendOutlined />}
                                buttonClicked={() => props.transferWebsite()}
                                tooltip="Transfer the website to another user."
                                requiredRights={['owner']}
                                title="Transfer"
                            />
                        </>
                    )}
                </ControlPanel>
                <div style={{ width: '100%' }}>
                    <table className={classes.SharingTable}>
                        <tbody>
                            <tr>
                                <th>User id</th>
                                <th>Name</th>
                                <th />
                                <th>Owner</th>
                                <th>Admin</th>
                                <th>Developer</th>
                                <th>Content manager</th>
                            </tr>
                            {newSharing.map((account, index) => (
                                <tr
                                    key={index}
                                    className={
                                        props.currentUserInWebsiteSharing ===
                                        account.userId
                                            ? classes.Active
                                            : ''
                                    }
                                    onMouseDown={() =>
                                        props.chooseUserInWebsiteSharing(
                                            account.userId
                                        )
                                    }
                                >
                                    <td>{account.userId}</td>
                                    <td>
                                        {account.accountInfo
                                            ? account.accountInfo.displayName ||
                                              ''
                                            : ''}
                                    </td>
                                    <td>
                                        {account.accountInfo ? (
                                            account.accountInfo.photos ? (
                                                account.accountInfo
                                                    .photos[0] ? (
                                                    <div
                                                        style={{
                                                            backgroundImage:
                                                                'url(' +
                                                                account
                                                                    .accountInfo
                                                                    .photos[0]
                                                                    .value +
                                                                ')',
                                                        }}
                                                        className={classes.Ava}
                                                    />
                                                ) : (
                                                    ''
                                                )
                                            ) : (
                                                ''
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                    <td>
                                        <Switch
                                            checked={
                                                website.user === account.userId
                                                    ? true
                                                    : false
                                            }
                                            onChange={() => {}}
                                        />
                                    </td>
                                    {website.user === account.userId ? (
                                        <td>
                                            <Switch
                                                checked={true}
                                                onChange={() => {}}
                                            />
                                        </td>
                                    ) : null}
                                    {[
                                        ...(website.user === account.userId
                                            ? []
                                            : ['admin']),
                                        ...['developer', 'content'],
                                    ].map((right, index) => (
                                        <td key={index}>
                                            <Switch
                                                checked={account.rights.includes(
                                                    right
                                                )}
                                                onChange={value =>
                                                    props.sharingRightsChange(
                                                        account.userId,
                                                        right,
                                                        value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <p>
                You are not the owner of the website and you do not have the
                admin rights.
            </p>
        )
    ) : null
}

const mapStateToProps = state => {
    return {
        currentUserInWebsiteSharing: state.currentUserInWebsiteSharing,
        userId: state.mD.userId,
        currentWebsiteObject: state.mD.currentWebsiteObject,
        currentWebsiteId: state.mD.currentWebsiteId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseUserInWebsiteSharing: id =>
            dispatch(actions.chooseUserInWebsiteSharing(id)),
        changeWebsiteProperty: (key, value) =>
            dispatch(wsActions.changeWebsiteProperty(key, value)),
        addUserInWebsiteSharing: () =>
            dispatch(wsActions.addUserInWebsiteSharing()),
        deleteUserInWebsiteSharing: user =>
            dispatch(wsActions.deleteUserInWebsiteSharing(user)),
        sharingRightsChange: (user, right, value) =>
            dispatch(wsActions.sharingRightsChange(user, right, value)),
        transferWebsite: () => dispatch(wsActions.transferWebsite()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SharingProperties)
