import React from 'react'
import { connect } from 'react-redux'

const OverlayOnSizeIsChanging = props =>
    props.sizeIsChanging ? (
        <div
            style={{
                width: '100%',
                height: '100%',
                opacity: '0',
                position: 'absolute',
            }}
        />
    ) : null

const mapStateToProps = state => {
    return {
        sizeIsChanging: state.sizeIsChanging,
    }
}

export default connect(mapStateToProps)(OverlayOnSizeIsChanging)
