import React from 'react'

import classes from './BigButtonWithCheckbox.module.css'
import Svg from '../../../Svg/Svg'

type Props = {
    title: string,
    checked?: boolean,
    icon?: string,
    clicked: Function,
}

export const BigButtonWithCheckbox = (props: Props) => {
    return (
        <button
            data-testid="MyButton"
            className={classes.Button}
            onClick={props.clicked}
        >
            <table className={classes.Table}>
                <tbody>
                    <tr>
                        <td>
                            <Svg icon={props.icon} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                data-testid="checkbox"
                                type="checkbox"
                                onChange={() => {}}
                                checked={props.checked || false}
                            />
                            {props.title}
                        </td>
                    </tr>
                </tbody>
            </table>
        </button>
    )
}

export default BigButtonWithCheckbox
