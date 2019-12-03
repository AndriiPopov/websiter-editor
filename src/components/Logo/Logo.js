import React from 'react'
import { Link } from 'react-router-dom'

import websiterLogo from '../../assets/icons/logo.svg'
import classes from './Logo.module.css'

type Props = {
    height?: number,
}

const logo = (props: Props) => (
    <Link to="/dashboard" className={classes.Link}>
        <div className={classes.Logo} style={{ height: props.height }}>
            <img src={websiterLogo} alt="W" />
            <span>Websiter</span>
        </div>
    </Link>
)

export default logo
