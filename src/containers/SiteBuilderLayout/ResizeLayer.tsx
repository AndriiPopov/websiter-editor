import React, { memo, useCallback } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../store/actions'
import { useDragLayer } from 'react-dnd'
import throttle from 'lodash/throttle'

type Props = {
    changeBarSize: typeof actions.changeBarSize
}

const ResizeLayerInn = (props: Props) => {
    const { item, currentOffset } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        currentOffset: monitor.getDifferenceFromInitialOffset(),
    }))
    const delayedChange = useCallback(
        throttle(
            (initiator: { key: string; value: number } | undefined) =>
                props.changeBarSize(initiator),
            50
        ),
        []
    )
    if (item) {
        if (item.type === 'barSizes' && currentOffset) {
            const value =
                item.id === 'height'
                    ? item.startValue - currentOffset.y
                    : item.startValue + currentOffset.x

            delayedChange({ key: item.id, value })
        }
    }
    return <div />
}

const mapDispatchToPropsResize = (dispatch: any) => {
    return {
        changeBarSize: (
            initiator: { key: string; value: number } | undefined
        ) => dispatch(actions.changeBarSize(initiator)),
    }
}

export default connect(
    null,
    mapDispatchToPropsResize
)(memo(ResizeLayerInn, () => true))
