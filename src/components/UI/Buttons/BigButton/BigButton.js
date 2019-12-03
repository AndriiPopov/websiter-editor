import React from 'react'

import classes from './BigButton.module.css'
import Svg from '../../../Svg/Svg'

type Props = {
    title?: string,
    buttonClicked: Function,
    icon: string,
    datatestid?: string,
}

const BigButton = (props: Props) => {
    return (
        <button
            data-testid={props.datatestid || 'MyButton'}
            className={classes.Button}
            onClick={props.buttonClicked}
        >
            <table className={classes.Table}>
                <tbody>
                    <tr>
                        <td>
                            <Svg icon={props.icon} />
                        </td>
                    </tr>
                    <tr>
                        <td>{props.title}</td>
                    </tr>
                </tbody>
            </table>
        </button>
    )
}

export default BigButton
