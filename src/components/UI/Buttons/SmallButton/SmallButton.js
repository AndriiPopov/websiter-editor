import React from 'react'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'

import classes from './SmallButton.module.css'
import Svg from '../../../Svg/Svg'
import checkUserRights from '../../../../utils/checkUserRights'

type Props = {
    title?: string,
    buttonClicked?: Function,
    mouseDown?: Function,
    icon?: string,
    inline?: boolean,
    tooltip?: string,
    disabled?: boolean,
    requiredRights?: Array<string>,
}

export const SmallButton = (props: Props) => {
    const handleButtonClick = () => {
        if (props.buttonClicked) {
            if (props.requiredRights)
                if (!props.checkUserRights(props.requiredRights || [])) {
                    return
                }
            if (props.buttonClicked) props.buttonClicked()
        }
    }
    return (
        <>
            <button
                data-tip={
                    !props.tooltipsOff && props.tooltip ? props.tooltip : ''
                }
                data-testid="MyButton"
                className={`${
                    props.disabled ? classes.ButtonDisabled : classes.Button
                } ${props.inline ? classes.Inline : ''}`}
                onClick={handleButtonClick}
                onMouseDown={props.mouseDown}
                disabled={props.disabled}
                style={props.style}
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
            {!props.tooltipsOff && props.tooltip ? (
                <ReactTooltip
                    effect="solid"
                    multiline={true}
                    place="top"
                    className={classes.Tooltip}
                    delayShow={250}
                    overridePosition={tooltipOverwritePositions}
                />
            ) : null}
        </>
    )
}

export const tooltipOverwritePositions = (
    position,
    currentEvent,
    currentTarget,
    node,
    place,
    desiredPlace,
    effect,
    offset
) => {
    const width = window.innerWidth
    let buttonRect, tooltipRect
    if (currentEvent.target) {
        buttonRect = currentTarget.getBoundingClientRect()
        tooltipRect = node.getBoundingClientRect()
    } else {
        buttonRect = currentEvent.getBoundingClientRect()
        tooltipRect = currentTarget.getBoundingClientRect()
    }

    let top, left
    if (buttonRect.top - (tooltipRect.bottom - tooltipRect.top) >= 0) {
        top = buttonRect.top - (tooltipRect.bottom - tooltipRect.top)
    } else {
        top = buttonRect.bottom
    }

    if (buttonRect.left + (tooltipRect.right - tooltipRect.left) <= width) {
        left = buttonRect.left
    } else {
        left = width - (tooltipRect.right - tooltipRect.left)
    }
    return { left, top }
}

const mapStateToProps = state => {
    return {
        tooltipsOff: state.mD.tooltipsOff,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SmallButton)
