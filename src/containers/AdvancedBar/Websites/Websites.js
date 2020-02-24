import React from 'react'
import { connect } from 'react-redux'

import * as classes from '../AdvancedBar.module.css'
import WebsitesTree from './WebsitesTree/WebsitesTree'
import SizeDragController from '../SizeDragController/SizeDragController'
import WebsitesProperties from './WebsitesProperties/WebsitesProperties'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    notVirtual?: boolean,
}

const Websites = (props: Props) => (
    <div className={classes.Content}>
        <div
            className={classes.Container}
            style={{ flex: '0 0 ' + props.barSizes.width + 'px' }}
        >
            {props.websites ? (
                <WebsitesTree notVirtual={props.notVirtual} />
            ) : null}
            <SizeDragController
                addClass={classes.widthControll}
                startValue={props.barSizes.width}
                type="width"
            />
        </div>
        <div className={classes.LastContainer}>
            {props.currentWebsiteObject ? <WebsitesProperties /> : null}
        </div>
    </div>
)

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        websites: state.mD.websites,
        currentWebsiteObject: state.mD.currentWebsiteObject,
    }
}

export default connect(mapStateToProps)(Websites)
