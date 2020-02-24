import React, { memo, useCallback } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../store/actions'
import AdvancedBar from '../../containers/AdvancedBar/AdvancedBar'
import SiteBuilder from '../../containers/SiteBuilder/SiteBuilder'
import ReserveWebsite from '../ReserveWebsite/ReserveWebsite'

import { DndProvider } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'
import { useDragLayer } from 'react-dnd'
import throttle from 'lodash/throttle'

type Props = {}

const SiteBuilderLayout = (props: Props) => {
    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            {props.userObject ? (
                <div
                    style={{
                        flexDirection: 'column',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        height: '100%',
                    }}
                >
                    <SiteBuilder />
                    <AdvancedBar />
                </div>
            ) : (
                'Loading...'
            )}
            <ReserveWebsite />
            <ResizeLayer />
        </DndProvider>
    )
}

const mapStateToProps = state => {
    return {
        userObject: state.mD.userObject,
    }
}

export default connect(mapStateToProps)(SiteBuilderLayout)

const ResizeLayerInn = props => {
    const { item, currentOffset } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        currentOffset: monitor.getDifferenceFromInitialOffset(),
    }))
    const delayedChange = useCallback(
        throttle(initiator => props.changeBarSize(initiator), 50),
        []
    )
    if (item) {
        if (item.type === 'barSizes') {
            const value =
                item.id === 'height'
                    ? item.startValue - currentOffset.y
                    : item.startValue + currentOffset.x

            delayedChange({ key: item.id, value })
        }
    }
    return <div />
}

const mapDispatchToPropsResize = dispatch => {
    return {
        changeBarSize: initiator => dispatch(actions.changeBarSize(initiator)),
    }
}

const ResizeLayer = connect(
    null,
    mapDispatchToPropsResize
)(memo(ResizeLayerInn, () => true))
