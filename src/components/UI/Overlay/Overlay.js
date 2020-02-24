import React from 'react'
import { connect } from 'react-redux'
import * as classes from './Overlay.module.css'

const Overlay = props => {
    return props.sizeIsChanging ? <div className={classes.Overlay} /> : null
}

const mapStateToProps = state => {
    return {
        sizeIsChanging: state.sizeIsChanging,
    }
}

export default connect(mapStateToProps)(Overlay)
