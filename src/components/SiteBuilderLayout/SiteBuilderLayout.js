import React from 'react'
import type { Node } from 'react'
import { connect } from 'react-redux'

import classes from './SiteBuilderLayout.module.css'
import AdvancedBar from '../../containers/AdvancedBar/AdvancedBar'

type Props = {
    children: Node,
    barHeight: number,
}

const SiteBuilderLayout = (props: Props) => {
    return (
        <>
            <main
                data-testid="siteBuilderLayoutMain"
                className={classes.Content}
                style={{ height: 'calc(100% - ' + props.barHeight + 'px)' }}
            >
                {props.children}
            </main>
            <AdvancedBar />
        </>
    )
}

const mapStateToProps = state => {
    return {
        barHeight: state.barSizes.height,
    }
}

export default connect(mapStateToProps)(SiteBuilderLayout)
