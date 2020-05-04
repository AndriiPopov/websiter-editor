import React, { memo, useEffect } from 'react'

import * as classes from './SizeDragController.module.css'
import { useDrag } from 'react-dnd'
import * as actions from '../../../store/actions'
import { connect } from 'react-redux'
import { getEmptyImage } from 'react-dnd-html5-backend'

// import type { initialStateType } from '../../../store/reducer/reducer'

// type Props = {
//     addClass: string,
//     changed: (value: number) => {},
//     vertical?: boolean,
//     startValue: number,
//     barSizes?: $PropertyType<initialStateType, 'barSizes'>,
// }

export const SizeDragController = props => {
    const [, drag, preview] = useDrag({
        item: {
            id: props.type,
            type: 'barSizes',
            startValue: props.startValue,
        },
        begin: item => {
            props.setSizeIsChanging(true)
        },
        end: item => {
            props.setSizeIsChanging(false)
        },
    })

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    return (
        <div
            ref={drag}
            className={[classes.SectionHeight, props.addClass].join(' ')}
            data-testid="sizeDragController"
        >
            {!props.vertical ? (
                <div className={classes.InnerDiv}>
                    {/* <div className={classes.touchDrag} /> */}
                </div>
            ) : null}
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setSizeIsChanging: value => dispatch(actions.setSizeIsChanging(value)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(
    memo(
        SizeDragController,
        (prevProps, nextProps) =>
            prevProps.type === nextProps.type &&
            prevProps.startValue === nextProps.startValue
    )
)
