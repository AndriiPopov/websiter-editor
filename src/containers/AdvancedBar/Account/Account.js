import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SmallButton from '../../../components/UI/Buttons/SmallButton/SmallButton'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import LogoutOutlined from '@ant-design/icons/LogoutOutlined'

// import type { initialStateType } from '../../../store/reducer/reducer'

// type Props = {
//     maxStorage: $PropertyType<initialStateType, 'maxStorage'>,
//     logout: typeof actions.logout,
//     // switchTooltips: typeof actions.switchTooltips,
//     deleteUser: typeof actions.deleteUser,
// }

const Account = props => {
    return (
        <div className={classes.Content}>
            <div>
                <div style={{ margin: '10px' }}>
                    User ID:{' '}
                    <span style={{ userSelect: 'all' }}>{props.userId}</span>
                </div>

                <SmallButton
                    buttonClicked={props.logout}
                    title="Logout"
                    icon={<LogoutOutlined />}
                    style={{ margin: '10px' }}
                />
                <SmallButton
                    buttonClicked={() => props.logout(true)}
                    title="Logout on all devices"
                    icon={<LogoutOutlined />}
                    style={{ margin: '10px' }}
                />

                <SmallButton
                    buttonClicked={props.deleteUser}
                    title="Delete account"
                    icon={<DeleteOutlined />}
                    style={{ margin: '10px' }}
                />
            </div>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        loading: state.loading,
        maxStorage: state.maxStorage,
        userId: state.userId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteUser: () => dispatch(actions.deleteUser()),
        logout: all => dispatch(actions.logout(all)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
