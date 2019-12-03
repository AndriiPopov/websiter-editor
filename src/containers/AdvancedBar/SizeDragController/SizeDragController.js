import React from 'react'
import { connect } from 'react-redux'

import * as classes from './SizeDragController.module.css'
import { dragStart } from '../../../utils/dragFunction'

type Props = {
    addClass: string,
    changed: (value: number) => {},
    vertical?: boolean,
    startValue: number,
    barSizes: {},
}

export const SizeDragController = (props: Props) => {
    const startElY = props.startValue

    const handleDragMouseDown = e => {
        if (props.vertical) {
            dragStart(
                e,
                (difX, difY) => {
                    let value = startElY - difY
                    props.changed(value)
                },
                () => {}
            )
        } else {
            dragStart(
                e,
                (difX, difY) => {
                    let value = props.startValue + difX
                    props.changed(value)
                },
                () => {}
            )
        }
    }

    return (
        <div
            className={[classes.SectionHeight, props.addClass].join(' ')}
            onMouseDown={handleDragMouseDown}
            data-testid="sizeDragController"
        >
            {!props.vertical ? <div className={classes.InnerDiv} /> : null}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
    }
}

export default connect(mapStateToProps)(SizeDragController)
