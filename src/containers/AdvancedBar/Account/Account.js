import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import LoginButton from '../../../components/UI/LoginButton/LoginButton'
import Logout from '../../Auth/Logout/Logout'

const Account = props => (
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account)
