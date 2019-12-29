import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import LoginButton from '../../../components/UI/LoginButton/LoginButton'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    storage: $PropertyType<initialStateType, 'storage'>,
    logout: typeof actions.logout,
    switchTooltips: typeof actions.switchTooltips,
    deleteUser: typeof actions.deleteUser,
}

const Account = (props: Props) => (
    <div className={classes.Content}>
        <div className={classes.Container}>
            <div>{props.storage}Bytes</div>
            <LoginButton
                datatestid="logoutAccount"
                clicked={() => props.logout()}
                btnType="Danger"
            >
                LOGOUT
            </LoginButton>
            <LoginButton
                datatestid="logoutAccount"
                clicked={() => props.logout(true)}
                btnType="Danger"
            >
                LOGOUT ON ALL DEVICES
            </LoginButton>
            <LoginButton
                datatestid="deleteAccount"
                clicked={() => props.switchTooltips()}
                btnType="Danger"
            >
                TURN OFF/ON TOOLTIPS
            </LoginButton>
            <LoginButton
                datatestid="deleteAccount"
                clicked={() => props.deleteUser()}
                btnType="Danger"
            >
                DELETE MY ACCOUNT
            </LoginButton>
        </div>
    </div>
)

const mapStateToProps = state => {
    return {
        loading: state.loading,
        storage: state.storage,
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
