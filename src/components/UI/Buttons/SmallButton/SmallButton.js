import React from 'react'

import classes from './SmallButton.module.css'
import Svg from '../../../Svg/Svg'

type Props = {
    title?: string,
    buttonClicked?: Function,
    mouseDown?: Function,
    icon?: string,
    inline?: boolean,
}

export const SmallButton = (props: Props) => {
    return (
        <button
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
    )
}

export default SmallButton
