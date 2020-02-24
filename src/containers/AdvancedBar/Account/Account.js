import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import { SmallButton } from '../../../components/UI/Buttons/SmallButton/SmallButton'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    // storage: $PropertyType<initialStateType, 'storage'>,
    maxStorage: $PropertyType<initialStateType, 'maxStorage'>,
    logout: typeof actions.logout,
    switchTooltips: typeof actions.switchTooltips,
    deleteUser: typeof actions.deleteUser,
}

const Account = (props: Props) => {
    // const storageDivTable = (
    //     <div>
    //         <table>
    //             <tbody>
    //                 <tr>
    //                     <td>Available:</td>
    //                     <td>{Math.round(props.maxStorage / 1000000)} MB </td>
    //                     <td>100%</td>
    //                 </tr>
    //                 <tr>
    //                     <td>Free:</td>
    //                     <td>
    //                         {Math.round(
    //                             (props.maxStorage - props.storage) / 1000000
    //                         )}{' '}
    //                         MB
    //                     </td>
    //                     <td>
    //                         {Math.round(
    //                             (100 * (props.maxStorage - props.storage)) /
    //                                 props.maxStorage
    //                         )}
    //                         %
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td>Used:</td>
    //                     <td>{Math.round(props.storage / 1000000)} MB</td>
    //                     <td>
    //                         {Math.round(
    //                             (100 * props.storage) / props.maxStorage
    //                         )}
    //                         %
    //                     </td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     </div>
    // )
    return (
        <div className={classes.Content}>
            <div>
                {/* <div>
                    Storage:
                    <div className={classesAccount.StorageContainer}>
                        <div className={classesAccount.StorageEmpty}>
                            {storageDivTable}
                        </div>
                        <div className={classesAccount.StorageFill}>
                            {storageDivTable}
                        </div>
                    </div>
                    <div>{storageDivTable}</div>
                </div> */}
                <div style={{ margin: '10px' }}>
                    User ID:{' '}
                    <span style={{ userSelect: 'all' }}>{props.userId}</span>
                </div>

                <SmallButton
                    buttonClicked={props.logout}
                    title="Logout"
                    icon='<svg width="30" height="30" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>'
                    style={{ margin: '10px' }}
                />
                <SmallButton
                    buttonClicked={() => props.logout(true)}
                    title="Logout on all devices"
                    icon='<svg width="30" height="30" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>'
                    style={{ margin: '10px' }}
                />
                <SmallButton
                    buttonClicked={props.switchTooltips}
                    title="Switch tooltips"
                    icon='<svg width="30" height="30" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"></path></svg>'
                    style={{ margin: '10px' }}
                    tooltip={
                        props.tooltipsOff
                            ? 'Tooltips are off (except this one)'
                            : 'Tooltips are on'
                    }
                />
                <SmallButton
                    buttonClicked={props.deleteUser}
                    title="Delete account"
                    icon='<svg width="30" height="30" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"></path></svg>'
                    style={{ margin: '10px' }}
                />
            </div>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        loading: state.loading,
        // storage: state.storage,
        maxStorage: state.maxStorage,
        userId: state.userId,
        tooltipsOff: state.mD.tooltipsOff,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteUser: () => dispatch(actions.deleteUser()),
        logout: all => dispatch(actions.logout(all)),
        switchTooltips: () => dispatch(actions.switchTooltips()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
