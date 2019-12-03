import React from 'react'
import classes from './Spinner.module.css'

type Props = {
    cover?: boolean,
    datatestid?: string,
}

const spinner = (props: Props) => (
    <>
        {props.cover ? (
            <div
                className={classes.Cover}
                data-testid={props.datatestid || 'cover'}
            >
                <div className={classes.Loader}>Loading...</div>
            </div>
        ) : (
            <div className={classes.Loader}>Loading...</div>
        )}
    </>
)

export default spinner
