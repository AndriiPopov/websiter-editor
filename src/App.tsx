import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Logout from './containers/Auth/Logout/Logout'
import asyncComponent from './hoc/asyncComponent'
import * as actions from './store/actions/index'
import Auth from './containers/Auth/Auth'
import Spinner from './components/UI/Spinner/Spinner'
import { initialState, initialStateType } from './store/reducer/reducer'
import './components/UI/loadStyles'

const asyncSiteBuilderLayout = asyncComponent(() => {
    return import('./containers/SiteBuilderLayout/SiteBuilderLayout')
})

type Props = {
    onTryAutoSignup: Function
    isAuthenticated: boolean
    loading: typeof initialState.loading
}

class App extends Component<Props> {
    componentDidMount() {
        this.props.onTryAutoSignup()
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/login" component={Auth} />
                <Redirect to="/login" />
            </Switch>
        )
        if (this.props.isAuthenticated) {
            routes = (
                <div style={{ height: '100%' }}>
                    <Switch>
                        <Route
                            path="/editor"
                            component={asyncSiteBuilderLayout}
                        />
                        <Route path="/logout" component={Logout} />
                        <Redirect to="/editor" />
                    </Switch>
                </div>
            )
        }
        return (
            <>
                {routes} {this.props.loading && <Spinner cover />}
            </>
        )
    }
}

const mapStateToProps = (state: initialStateType) => {
    return {
        isAuthenticated: state.userId !== null,
        loading: state.loading,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
)
