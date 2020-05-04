import React from 'react'
import classes from './Spinner.module.css'
import Spin from 'antd/es/spin'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
// type Props = {
//     cover?: boolean,
//     datatestid?: string,
// }

const spinner = props => {
    const spiningIcon = (
        <Spin
            indicator={<LoadingOutlined style={{ fontSize: 74 }} spin />}
            tip="Loading..."
        />
    )

    return props.cover ? (
        <div
            className={classes.Cover}
            data-testid={props.datatestid || 'cover'}
        >
            {spiningIcon}
        </div>
    ) : (
        spiningIcon
    )
}

export default spinner
