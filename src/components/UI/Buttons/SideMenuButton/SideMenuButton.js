import React from 'react'

import classes from './SideMenuButton.module.css'
import Svg from '../../../Svg/Svg'

type Props = {
    title?: string,
    buttonClicked: Function,
    icon: string,
    datatestid?: string,
    active?: boolean,
}

const SideMenuButton = (props: Props) => {
    const addedClasses = [classes.Button]
    if (props.active) {
        addedClasses.push(classes.Active)
    }
    return (
        <button
            data-testid={props.datatestid || 'MyButton'}
            className={addedClasses.join(' ')}
            onClick={props.buttonClicked}
        >
            <table className={classes.Table}>
                <tbody>
                    <tr>
                        <td>
                            <Svg icon={props.icon} />
                        </td>
                        <td>{props.title}</td>
                    </tr>
                </tbody>
            </table>
        </button>
    )
}

export default SideMenuButton
