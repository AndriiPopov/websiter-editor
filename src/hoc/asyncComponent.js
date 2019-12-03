import React, { Component } from 'react';

type Props = {

}

type State = {
    component: Object | null    
}

const asyncComponent = (importComponent: Object) => {
    return class extends Component<Props, State> {
        state = {
            component: null
        }

        componentDidMount () {
            importComponent()
                .then(cmp => {
                    this.setState({component: cmp.default});
                });
        }
        
        render () {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    }
}

export default asyncComponent;