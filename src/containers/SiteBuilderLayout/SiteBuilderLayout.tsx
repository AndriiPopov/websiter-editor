import React from 'react'
import { connect } from 'react-redux'

import AdvancedBar from '../AdvancedBar/AdvancedBar'
import SiteBuilder from '../SiteBuilder/SiteBuilder'
import ReserveWebsite from '../../components/ReserveWebsite/ReserveWebsite'

import { DndProvider } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'
import ResizeLayer from './ResizeLayer'
import { storeType } from '../../Types/store'

type Props = {
    userObject: any
}

const SiteBuilderLayout = (props: Props) => {
    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            {props.userObject ? (
                <div
                    style={{
                        flexDirection: 'column',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        height: '100%',
                    }}
                >
                    <SiteBuilder />
                    <AdvancedBar />
                </div>
            ) : (
                'Loading...'
            )}
            <ReserveWebsite />
            <ResizeLayer />
        </DndProvider>
    )
}

const mapStateToProps = (state: storeType) => {
    return {
        userObject: state.mD.userObject,
    }
}

export default connect(mapStateToProps)(SiteBuilderLayout)
