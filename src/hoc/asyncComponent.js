import React, { Component } from 'react'

// type Props = {}

// type State = {
//     component: Object | null,
// }

const asyncComponent = importComponent => {
    return class extends Component {
        state = {
            component: null,
        }

        componentDidMount() {
            importComponent().then(cmp => {
                this.setState({ component: cmp.default })
            })
        }

        render() {
            const C = this.state.component
            return C ? <C {...this.props} /> : <div>Loading...</div>
        }
    }
}

export default asyncComponent
