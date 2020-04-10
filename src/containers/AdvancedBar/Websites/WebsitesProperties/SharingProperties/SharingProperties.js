import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../../store/actions/index'
import * as classes from './SharingProperties.module.css'
import SmallButton from '../../../../../components/UI/Buttons/SmallButton/SmallButton'
import Checkbox from '../../../../../components/UI/Checkbox/Checkbox'
import * as wsActions from '../../../../../websocketActions'

type Props = {
    currentUserInWebsiteSharing: string,
    chooseUserInWebsiteSharing: typeof actions.chooseUserInWebsiteSharing,
}

const SharingProperties = (props: Props) => {
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
                <div>
                    <SmallButton
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                        buttonClicked={() => props.addUserInWebsiteSharing()}
                        tooltip="Share the website with a new user. You need to know the user's id which can be found in the user's Account menu tab. The user will need to refresh page in browser to see the shared website."
                        inline
                        requiredRights={['admin', 'user']}
                    />
                    <SmallButton
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
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
                        inline
                        requiredRights={['admin', 'user']}
                    />
                    {website.user === props.userId ? (
                        <SmallButton
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>'
                            buttonClicked={() => props.transferWebsite()}
                            tooltip="Transfer the website to another user."
                            inline
                            requiredRights={['owner']}
                        />
                    ) : null}
                </div>
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
                                        <Checkbox
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
                                            <Checkbox
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
                                            <Checkbox
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
