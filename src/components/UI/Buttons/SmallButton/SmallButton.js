import React from 'react'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'

import classes from './SmallButton.module.css'
import Svg from '../../../Svg/Svg'

type Props = {
    title?: string,
    buttonClicked?: Function,
    mouseDown?: Function,
    icon?: string,
    inline?: boolean,
    tooltip?: string,
    tooltipsOn: boolean,
    disabled?: boolean,
}

export const SmallButton = (props: Props) => {
    const width = window.innerWidth
    return (
        <>
            <button
                data-tip={props.tooltip}
                data-testid="MyButton"
                className={`${
                    props.disabled ? classes.ButtonDisabled : classes.Button
                } ${props.inline ? classes.Inline : ''}`}
                onClick={props.buttonClicked}
                onMouseDown={props.mouseDown}
                disabled={props.disabled}
            >
                <table className={classes.Table}>
                    <tbody>
                        <tr>
                            <td className={classes.Cell}>
                                {props.icon ? (
                                    <Svg
                                        icon={props.icon}
                                        className={classes.Svg}
                                    />
                                ) : null}
                            </td>
                            <td className={classes.Cell}>{props.title}</td>
                        </tr>
                    </tbody>
                </table>
            </button>
            {props.tooltipsOn ? (
                <ReactTooltip
                    effect="solid"
                    multiline={true}
                    place="top"
                    className={classes.Tooltip}
                    delayShow={250}
                    overridePosition={(
                        position,
                        currentEvent,
                        currentTarget,
                        node,
                        place,
                        desiredPlace,
                        effect,
                        offset
                    ) => {
                        let buttonRect, tooltipRect
                        if (currentEvent.target) {
                            buttonRect = currentTarget.getBoundingClientRect()
                            tooltipRect = node.getBoundingClientRect()
                        } else {
                            buttonRect = currentEvent.getBoundingClientRect()
                            tooltipRect = currentTarget.getBoundingClientRect()
                        }

                        let top, left
                        if (
                            buttonRect.top -
                                (tooltipRect.bottom - tooltipRect.top) >=
                            0
                        ) {
                            top =
                                buttonRect.top -
                                (tooltipRect.bottom - tooltipRect.top)
                        } else {
                            top = buttonRect.bottom
                        }

                        if (
                            buttonRect.left +
                                (tooltipRect.right - tooltipRect.left) <=
                            width
                        ) {
                            left = buttonRect.left
                        } else {
                            left =
                                width - (tooltipRect.right - tooltipRect.left)
                        }
                        return { left, top }
                    }}
                />
            ) : null}
        </>
    )
}

const mapStateToProps = state => {
    return {
        tooltipsOn: state.tooltipsOn,
    }
}

export default connect(mapStateToProps)(SmallButton)
