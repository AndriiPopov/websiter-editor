import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import WebsitesTree from './WebsitesTree/WebsitesTree'
import SizeDragController from '../SizeDragController/SizeDragController'
import WebsitesProperties from './WebsitesProperties/WebsitesProperties'

const Websites = props => (
    <div className={classes.Content}>
        <div
            className={classes.Container}
            style={{ flex: '0 0 ' + props.barSizes.width + 'px' }}
        >
            <WebsitesTree notVirtual={props.notVirtual} />
            <SizeDragController
                addClass={classes.widthControll}
                startValue={props.barSizes.width}
                changed={value =>
                    props.changeBarSize(props.barSizes, {
                        key: 'width',
                        value,
                    })
                }
            />
        </div>
        <div className={classes.LastContainer}>
            <WebsitesProperties />
        </div>
    </div>
)

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Websites)
